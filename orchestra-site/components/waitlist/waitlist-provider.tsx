"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Shared waitlist state. Holds the live count so the hero form, the bottom-CTA
 * form, and every live counter on the page stay in sync: a successful join
 * updates the count once and all counters react (AC2). On mount we fetch the
 * real count from the API (AC3) — never a hardcoded number.
 */
type WaitlistContextValue = {
  /** null until the first count has loaded */
  count: number | null;
  /** true while the initial GET /api/waitlist/count is in flight */
  loading: boolean;
  /** set the authoritative count returned by the API */
  setCount: (next: number) => void;
};

const WaitlistContext = createContext<WaitlistContextValue | undefined>(
  undefined,
);

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [count, setCountState] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const setCount = useCallback((next: number) => {
    if (Number.isFinite(next) && next >= 0) {
      setCountState(next);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadCount() {
      try {
        const res = await fetch("/api/waitlist/count", {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(`count request failed (${res.status})`);
        }
        const data: unknown = await res.json();
        if (
          active &&
          data &&
          typeof (data as { count?: unknown }).count === "number"
        ) {
          setCountState((data as { count: number }).count);
        }
      } catch {
        // Leave count null on failure — the counter renders a quiet fallback
        // rather than a wrong/hardcoded number.
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCount();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<WaitlistContextValue>(
    () => ({ count, loading, setCount }),
    [count, loading, setCount],
  );

  return (
    <WaitlistContext.Provider value={value}>
      {children}
    </WaitlistContext.Provider>
  );
}

export function useWaitlist(): WaitlistContextValue {
  const context = useContext(WaitlistContext);
  if (!context) {
    throw new Error("useWaitlist must be used within a WaitlistProvider");
  }
  return context;
}
