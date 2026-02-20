import { NextResponse } from 'next/server';
import { z } from 'zod';

import { normalizeWebsiteUrl, websiteUrlSchema } from '@/lib/validation/url';

const auditRequestSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  websiteUrl: websiteUrlSchema,
  phoneNumber: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true;
      const trimmed = value.trim();
      if (trimmed.length === 0) return true;
      return trimmed.length >= 7 && trimmed.length <= 30;
    }, 'Phone number must be between 7 and 30 characters'),
  specifics: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (Array.isArray(val) ? val.join(', ') : val))
    .refine((value) => {
      if (!value) return true;
      const trimmed = value.trim();
      if (trimmed.length === 0) return true;
      return trimmed.length <= 2000;
    }, 'Specifics must be 2000 characters or fewer'),
  honeypot: z.string().optional(),
});

type AuditRequestPayload = z.infer<typeof auditRequestSchema>;

type AuditRequestRecord = {
  id: string;
  name: string;
  email: string;
  website_url: string;
  phone_number?: string | null;
  specifics?: string | null;
  acknowledged: boolean;
  status: string;
  created_at: string;
};

function getEnvVar(key: string) {
  const value = process.env[key];
  if (!value || value.length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

async function insertAuditRequest(payload: AuditRequestPayload): Promise<AuditRequestRecord> {
  const supabaseUrl = getEnvVar('SUPABASE_URL');
  const supabaseKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

  const normalizedWebsite = normalizeWebsiteUrl(payload.websiteUrl);

  const response = await fetch(`${supabaseUrl}/rest/v1/audit_requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify([
      {
        name: payload.name.trim(),
        email: payload.email.trim(),
        website_url: normalizedWebsite,
        phone_number: payload.phoneNumber?.trim() || null,
        specifics: payload.specifics?.trim() || null,
        status: 'pending',
        source: 'website',
      },
    ]),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to insert audit request: ${errorBody || response.statusText}`);
  }

  const data = (await response.json()) as AuditRequestRecord[];
  if (!data?.[0]) {
    throw new Error('Audit request insert succeeded but no record was returned.');
  }

  return data[0];
}

async function sendAuditNotification(record: AuditRequestRecord) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not set; skipping audit notification email.');
    return;
  }

  const sender = process.env.AUDIT_NOTIFY_FROM ?? process.env.LEAD_NOTIFY_FROM;
  if (!sender) {
    console.warn('No sender configured for audit notifications; skipping email.');
    return;
  }

  const recipientsRaw = process.env.AUDIT_NOTIFY_TO ?? process.env.LEAD_NOTIFY_TO ?? '';
  const recipients = recipientsRaw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    console.warn('No recipients configured for audit notifications; skipping email.');
    return;
  }

  const submittedAt = record.created_at
    ? new Date(record.created_at).toLocaleString('en-US', { timeZone: 'UTC' })
    : new Date().toISOString();

  const specifics = record.specifics?.trim() || 'Not provided';
  const phone = record.phone_number?.trim() || 'Not provided';

  const websiteDisplay = record.website_url;
  const websiteHref = normalizeWebsiteUrl(websiteDisplay);

  const textBody = [
    'New Free Website Audit Request',
    '',
    `Name: ${record.name}`,
    `Email: ${record.email}`,
    `Website URL: ${websiteDisplay}`,
    `Phone: ${phone}`,
    `Specifics: ${specifics}`,
    '',
    `Submitted: ${submittedAt}`,
  ].join('\n');

  const htmlBody = `
    <h2>New Free Website Audit Request</h2>
    <p><strong>Name:</strong> ${record.name}</p>
    <p><strong>Email:</strong> ${record.email}</p>
    <p><strong>Website URL:</strong> <a href="${websiteHref}" target="_blank" rel="noreferrer">${websiteDisplay}</a></p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Specifics:</strong> ${specifics}</p>
    <p><strong>Submitted:</strong> ${submittedAt}</p>
  `;

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: sender,
      to: recipients,
      subject: 'New Free Website Audit Request',
      text: textBody,
      html: htmlBody,
    }),
  });

  if (!emailResponse.ok) {
    const errorBody = await emailResponse.text();
    console.error('Failed to send audit notification email', errorBody || emailResponse.statusText);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = auditRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: 'Invalid request body.',
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    if (parsed.data.honeypot) {
      return NextResponse.json({ message: 'Thanks! We will be in touch soon.' }, { status: 200 });
    }

    const record = await insertAuditRequest(parsed.data);
    await sendAuditNotification(record);

    return NextResponse.json({ message: 'Audit request received.' }, { status: 201 });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : 'Unexpected error while submitting audit request.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
