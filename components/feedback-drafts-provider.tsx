'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { hasUnsentReply, type ReplyDraft } from '@/lib/feedback-reply-draft';

type Drafts = Record<string, ReplyDraft>;
const DraftContext = createContext<{
  drafts: Drafts;
  setDrafts: React.Dispatch<React.SetStateAction<Drafts>>;
} | null>(null);

// The root layout survives client navigation, including Back/Forward. Drafts
// stay in this tab's memory only; reload/close clears them after the unload warning.
export function FeedbackDraftsProvider({ children }: { children: React.ReactNode }) {
  const [drafts, setDrafts] = useState<Drafts>({});
  const [active, setActive] = useState(false);
  const generation = useRef(0);
  const hasDrafts = Object.keys(drafts).length > 0;
  const unsent = Object.values(drafts).some(hasUnsentReply);

  useEffect(() => {
    if (hasDrafts) setActive(true);
  }, [hasDrafts]);

  useEffect(() => {
    if (!active) return;
    let disposed = false;
    let unsubscribe: (() => void) | undefined;
    let owner: string | null | undefined;
    // Keep the auth client out of the initial public-page bundle.
    void import('@/lib/supabase/client').then(({ createClient }) => {
      if (disposed) return;
      const { data } = createClient().auth.onAuthStateChange((_event, session) => {
        const nextOwner = session?.user.id ?? null;
        if (!nextOwner || (owner !== undefined && owner !== nextOwner)) {
          generation.current += 1;
          setDrafts({});
        }
        owner = nextOwner;
      });
      unsubscribe = () => data.subscription.unsubscribe();
    });
    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }, [active]);

  useEffect(() => {
    if (!unsent) return;
    const unload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', unload);
    return () => window.removeEventListener('beforeunload', unload);
  }, [unsent]);

  const epoch = generation.current;
  const update: React.Dispatch<React.SetStateAction<Drafts>> = (next) => {
    if (epoch === generation.current) setDrafts(next);
  };
  return (
    <DraftContext.Provider value={{ drafts, setDrafts: update }}>{children}</DraftContext.Provider>
  );
}

export function useFeedbackDrafts() {
  const context = useContext(DraftContext);
  if (!context) throw new Error('Feedback drafts require FeedbackDraftsProvider');
  return context;
}
