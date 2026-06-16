"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useWaitlist } from "./waitlist-provider";
import { looksLikeEmail } from "./email";

type Status = "idle" | "submitting" | "success" | "already" | "error";

type FieldMessage = {
  kind: "error" | "info";
  text: string;
} | null;

const GENERIC_ERROR = "Something went wrong. Please try again.";
const EMPTY_ERROR = "Enter your email address.";
const FORMAT_ERROR = "Enter a valid email address.";
const ALREADY_FALLBACK = "You're already on the list — hang tight.";

type WaitlistFormProps = {
  /** distinguishes the hero form from the bottom-CTA form for stable ids */
  idPrefix?: string;
};

/**
 * Email capture form. Consumes the frozen API contract:
 *   POST /api/waitlist {email}
 *     201 {position, count} -> success "You're #N on the list" (AC1) + counter (AC2)
 *     400 {error}           -> inline field error (AC4)
 *     409 {error, already}  -> friendly already-in-line message (AC5)
 * Double-submit is guarded by an in-flight ref + disabled button (AC7, UI side).
 */
export function WaitlistForm({ idPrefix = "waitlist" }: WaitlistFormProps) {
  const { setCount } = useWaitlist();
  const reduceMotion = useReducedMotion();

  const reactId = useId();
  const inputId = `${idPrefix}-email-${reactId}`;
  const messageId = `${idPrefix}-message-${reactId}`;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [position, setPosition] = useState<number | null>(null);
  const [message, setMessage] = useState<FieldMessage>(null);

  // Guards against a second request being fired while one is in flight, even if
  // React state hasn't re-rendered yet (rapid double-click / double-Enter).
  const inFlight = useRef(false);

  const isSubmitting = status === "submitting";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return; // AC7: de-dupe in-flight submits

    const trimmed = email.trim();

    if (trimmed.length === 0) {
      setStatus("error");
      setMessage({ kind: "error", text: EMPTY_ERROR }); // AC6 client guard
      return;
    }
    if (!looksLikeEmail(trimmed)) {
      setStatus("error");
      setMessage({ kind: "error", text: FORMAT_ERROR }); // AC4 client guard
      return;
    }

    inFlight.current = true;
    setStatus("submitting");
    setMessage(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data: unknown = await res.json().catch(() => ({}));

      if (res.status === 201) {
        const body = data as { position?: number; count?: number };
        setPosition(typeof body.position === "number" ? body.position : null);
        if (typeof body.count === "number") {
          setCount(body.count); // AC2: refresh the shared live counter
        }
        setStatus("success");
        setMessage(null);
        return;
      }

      if (res.status === 409) {
        const body = data as { error?: string };
        setStatus("already");
        setMessage({
          kind: "info",
          text: body.error || ALREADY_FALLBACK, // AC5
        });
        return;
      }

      if (res.status === 400) {
        const body = data as { error?: string };
        setStatus("error");
        setMessage({ kind: "error", text: body.error || FORMAT_ERROR }); // AC4
        return;
      }

      setStatus("error");
      setMessage({ kind: "error", text: GENERIC_ERROR });
    } catch {
      // Network / parse failure — never surface internals (AC9).
      setStatus("error");
      setMessage({ kind: "error", text: GENERIC_ERROR });
    } finally {
      inFlight.current = false;
    }
  }

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            {...reveal}
            className="flex items-start gap-3 rounded-2xl border border-go/40 bg-go/10 px-5 py-4"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-go"
              aria-hidden="true"
            />
            <div className="text-left">
              <p className="font-display text-lg font-semibold text-foreground">
                {position !== null ? (
                  <>
                    You&apos;re{" "}
                    <span className="tabular font-mono text-go">
                      #{position.toLocaleString()}
                    </span>{" "}
                    on the list.
                  </>
                ) : (
                  <>You&apos;re on the list.</>
                )}
              </p>
              <p className="mt-0.5 text-sm text-muted">
                We&apos;ll email you the moment the first section opens.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            {...reveal}
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-2"
          >
            <label htmlFor={inputId} className="sr-only">
              Email address
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <input
                  id={inputId}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  disabled={isSubmitting}
                  aria-invalid={message?.kind === "error"}
                  aria-describedby={message ? messageId : undefined}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status === "error" || status === "already") {
                      setStatus("idle");
                      setMessage(null);
                    }
                  }}
                  className="h-12 w-full rounded-xl border border-edge bg-surface/80 px-4 text-base text-foreground placeholder:text-muted/70 transition-colors duration-200 outline-none focus:border-cyan/60 focus:bg-surface disabled:opacity-60"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative inline-flex h-12 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl px-6 text-base font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-80"
              >
                <span
                  className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo via-violet to-fuchsia"
                  aria-hidden="true"
                />
                <span
                  className="absolute inset-0 -z-10 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-70 bg-gradient-to-r from-indigo via-violet to-fuchsia"
                  aria-hidden="true"
                />
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Joining…
                  </>
                ) : (
                  <>
                    Join the waitlist
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            </div>

            <div className="min-h-5 px-1" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                {message ? (
                  <motion.p
                    key={message.text}
                    id={messageId}
                    role={message.kind === "error" ? "alert" : "status"}
                    initial={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className={`flex items-center gap-1.5 text-sm ${
                      message.kind === "error" ? "text-danger" : "text-go"
                    }`}
                  >
                    {message.kind === "info" && (
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {message.text}
                  </motion.p>
                ) : (
                  <motion.p
                    key="trust"
                    initial={false}
                    className="text-sm text-muted/80"
                  >
                    No spam. One launch email. Unsubscribe anytime.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reassurance line stays even after an already-on-list info message */}
      {status === "already" && (
        <p className="mt-2 px-1 text-sm text-muted/80">
          No spam. One launch email. Unsubscribe anytime.
        </p>
      )}
    </div>
  );
}
