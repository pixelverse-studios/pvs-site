import type { ReactNode } from 'react';

const EMAIL_FALLBACK_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

function escapeForRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Converts raw error messages that contain email addresses into clickable links.
 * Optionally prioritizes a provided support email + subject line.
 */
export function formatMessageWithEmailLink(
  message: string,
  supportEmail?: string,
  subjectLine?: string,
): ReactNode {
  const trimmedEmail = supportEmail?.trim();

  const buildMailtoHref = (email: string) => {
    const base = `mailto:${email}`;
    if (subjectLine && subjectLine.trim().length > 0) {
      return `${base}?subject=${encodeURIComponent(subjectLine.trim())}`;
    }
    return base;
  };

  const transformMessage = (regex: RegExp, emailForHref?: string) => {
    const nodes: ReactNode[] = [];
    let lastIndex = 0;

    let match = regex.exec(message);
    let index = 0;

    while (match) {
      const matchedEmail = match[0];
      const startIndex = match.index ?? 0;

      if (startIndex > lastIndex) {
        nodes.push(message.slice(lastIndex, startIndex));
      }

      const hrefEmail = emailForHref ?? matchedEmail;

      nodes.push(
        <a
          key={`email-${startIndex}-${index}`}
          href={buildMailtoHref(hrefEmail)}
          className="focus-visible:ring-[var(--pv-primary)]/40 underline decoration-[var(--pv-primary)] decoration-2 underline-offset-4 transition hover:text-[var(--pv-primary)] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2"
        >
          {matchedEmail}
        </a>,
      );

      lastIndex = startIndex + matchedEmail.length;
      index += 1;
      match = regex.exec(message);
    }

    if (index === 0) {
      return null;
    }

    if (lastIndex < message.length) {
      nodes.push(message.slice(lastIndex));
    }

    return nodes;
  };

  if (trimmedEmail) {
    const targetedRegex = new RegExp(escapeForRegex(trimmedEmail), 'gi');
    const result = transformMessage(targetedRegex, trimmedEmail);
    if (result) {
      return result;
    }
  }

  const fallbackResult = transformMessage(EMAIL_FALLBACK_REGEX);
  if (fallbackResult) {
    return fallbackResult;
  }

  return message;
}
