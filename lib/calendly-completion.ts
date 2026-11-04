type Completion = { event_uri: string; invitee_uri: string };

/** Component-lifetime deduplication only. Server-side idempotency still needs verification. */
export function createCalendlyCompletionHandler({
  onScheduled,
  forward,
  onForwardError,
}: {
  onScheduled: () => void;
  forward: (completion: Completion) => Promise<{ ok: boolean }>;
  onForwardError: () => void;
}) {
  const seen = new Set<string>();
  return async (completion: Completion) => {
    if (!completion.event_uri || !completion.invitee_uri) return;
    const key = JSON.stringify([completion.event_uri, completion.invitee_uri]);
    if (seen.has(key)) return;
    seen.add(key);
    // This records the supported provider callback, not successful CRM persistence.
    onScheduled();
    try {
      const response = await forward(completion);
      if (!response.ok) onForwardError();
    } catch {
      onForwardError();
    }
    // No automatic retry: delivery may have succeeded despite a lost response.
  };
}
