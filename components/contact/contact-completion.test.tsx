// @vitest-environment jsdom
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  values: {} as Record<string, unknown>,
  setValue: vi.fn(),
  reset: vi.fn(),
  lead: vi.fn(),
  review: vi.fn(),
  start: vi.fn(),
  params: new URLSearchParams(),
}));
vi.mock('next/navigation', () => ({
  usePathname: () => '/contact/details',
  useSearchParams: () => state.params,
}));
// Supply already-validated fixture values at the form library boundary. These
// tests exercise the real component's asynchronous completion behavior, not Zod.
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: (name: string) => ({ name }),
    handleSubmit: (submit: (data: unknown) => Promise<void>) => (event: Event) => {
      event.preventDefault();
      return submit(state.values);
    },
    control: {},
    reset: state.reset,
    setValue: state.setValue,
    watch: (names: string | string[]) =>
      Array.isArray(names) ? names.map((name) => state.values[name]) : state.values[names],
    formState: { errors: {}, isSubmitting: false },
  }),
  Controller: () => null,
}));
vi.mock('@/lib/analytics', () => ({
  default: {
    trackLeadConversion: state.lead,
    trackWebsiteReviewRequest: state.review,
    trackFormStart: state.start,
  },
}));
vi.mock('@/lib/api-config', () => ({ getApiBaseUrl: () => 'http://local.invalid' }));
vi.mock('@/lib/hooks/use-promo-from-url', () => ({
  usePromoFromUrl: () => undefined,
  clearStoredPromoCode: vi.fn(),
}));
vi.mock('@/lib/attribution', () => ({
  getConversionAttribution: () => ({
    first_touch: { landing_page: '/services/seo', referrer: 'https://www.google.com' },
  }),
}));
import { ContactDetailsForm } from './contact-details-form';
import { ContactReviewForm } from './contact-review-form';

let root: Root;
let container: HTMLDivElement;
let request: ReturnType<typeof vi.fn>;
beforeEach(() => {
  (globalThis as any).React = React;
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  vi.clearAllMocks();
  state.values = {
    fullName: 'Fixture',
    email: 'fixture@example.test',
    companyName: 'Fixture Co',
    budget: '1-3k',
    timeline: '1-2mo',
    improvements: ['seo'],
    interestedIn: ['seo'],
    specifics: ['seo-visibility'],
    websiteUrl: 'https://example.test',
    promoCode: '',
  };
  request = vi.fn();
  vi.stubGlobal('fetch', request);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});
const submit = () => Simulate.submit(container.querySelector('form')!);

describe.each([
  ['details', ContactDetailsForm, state.lead, '/api/leads'],
  ['review', ContactReviewForm, state.review, '/api/audit'],
] as const)('%s completion boundary', (_name, Form, conversion, endpoint) => {
  it('counts the first interaction once without mistaking edits for completed leads', async () => {
    await act(async () => root.render(<Form />));
    const input = container.querySelector('input')!;
    await act(async () => {
      Simulate.change(input);
      Simulate.change(input);
    });
    expect(state.start).toHaveBeenCalledTimes(1);
    expect(conversion).not.toHaveBeenCalled();
    expect(request).not.toHaveBeenCalled();
  });

  it('counts one completion only after HTTP success and suppresses a concurrent duplicate', async () => {
    let resolve!: (value: { ok: boolean }) => void;
    request.mockReturnValue(
      new Promise((r) => {
        resolve = r;
      }),
    );
    await act(async () => root.render(<Form />));
    await act(async () => {
      submit();
      submit();
    });
    expect(request).toHaveBeenCalledTimes(1);
    expect(request.mock.calls[0][0]).toBe(`http://local.invalid${endpoint}`);
    expect(conversion).not.toHaveBeenCalled();
    expect(JSON.parse(request.mock.calls[0][1].body).attribution.first_touch.landing_page).toBe(
      '/services/seo',
    );
    await act(async () => resolve({ ok: true }));
    expect(conversion).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(conversion.mock.calls)).not.toContain('fixture@example.test');
    expect(container.querySelector('form')).toBeNull();
  });

  it.each(['http', 'network'])(
    'does not count a %s failure and allows an explicit retry',
    async (failure) => {
      if (failure === 'http') request.mockResolvedValueOnce({ ok: false, status: 500 });
      else request.mockRejectedValueOnce(new Error('offline'));
      await act(async () => root.render(<Form />));
      await act(async () => submit());
      expect(conversion).not.toHaveBeenCalled();
      expect(container.querySelector('form')).not.toBeNull();
      request.mockResolvedValueOnce({ ok: true });
      await act(async () => submit());
      expect(request).toHaveBeenCalledTimes(2);
      expect(conversion).toHaveBeenCalledTimes(1);
    },
  );

  it('does not turn the honeypot success screen into a real lead event', async () => {
    state.values.website_confirm = 'bot';
    await act(async () => root.render(<Form />));
    await act(async () => submit());
    expect(request).not.toHaveBeenCalled();
    expect(conversion).not.toHaveBeenCalled();
  });
});
