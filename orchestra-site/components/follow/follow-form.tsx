"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CheckCircle, CircleNotch } from "@phosphor-icons/react";
import { looksLikeEmail } from "./email";

type Status = "idle" | "submitting" | "success" | "already" | "error";

const EASE = [0.32, 0.72, 0, 1] as const;
const GENERIC_ERROR = "Что-то пошло не так. Попробуйте ещё раз.";
const EMPTY_ERROR = "Введите email.";
const FORMAT_ERROR = "Введите корректный email.";
const ALREADY_FALLBACK = "Вы уже следите за проектом.";

/**
 * A small, honest "follow the project" email capture — framed as a live
 * artifact built by the Backend agent (Машинист). Consumes the frozen contract:
 *   POST /api/waitlist {email} -> 201 {position, count} | 400 {error} | 409 {error, already}
 *   GET  /api/waitlist/count   -> 200 {count}
 * Any inline validation error is cleared the instant the input changes.
 */
export function FollowForm() {
  const reduceMotion = useReducedMotion();
  const reactId = useId();
  const inputId = `follow-email-${reactId}`;
  const messageId = `follow-message-${reactId}`;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [position, setPosition] = useState<number | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  useEffect(() => {
    let active = true;
    fetch("/api/waitlist/count", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: unknown) => {
        if (
          active &&
          data &&
          typeof (data as { count?: unknown }).count === "number"
        ) {
          setCount((data as { count: number }).count);
        }
      })
      .catch(() => {
        /* leave count null — render a quiet fallback, never a wrong number */
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const trimmed = email.trim();
    if (trimmed.length === 0) {
      setStatus("error");
      setError(EMPTY_ERROR);
      return;
    }
    if (!looksLikeEmail(trimmed)) {
      setStatus("error");
      setError(FORMAT_ERROR);
      return;
    }

    inFlight.current = true;
    setStatus("submitting");
    setError(null);

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
        if (typeof body.count === "number") setCount(body.count);
        setStatus("success");
        return;
      }
      if (res.status === 409) {
        setStatus("already");
        setError((data as { error?: string }).error || ALREADY_FALLBACK);
        return;
      }
      if (res.status === 400) {
        setStatus("error");
        setError((data as { error?: string }).error || FORMAT_ERROR);
        return;
      }
      setStatus("error");
      setError(GENERIC_ERROR);
    } catch {
      setStatus("error");
      setError(GENERIC_ERROR);
    } finally {
      inFlight.current = false;
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    // Clear any validation/already state the instant the input changes.
    if (error !== null || status === "error" || status === "already") {
      setError(null);
      setStatus("idle");
    }
  }

  const isSubmitting = status === "submitting";

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.3, ease: EASE },
      };

  return (
    <div className="w-full max-w-sm">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            {...reveal}
            className="flex items-start gap-3 rounded-2xl border border-vermilion/25 bg-vermilion-soft/40 px-4 py-3.5"
            role="status"
            aria-live="polite"
          >
            <CheckCircle
              weight="light"
              className="mt-0.5 h-5 w-5 shrink-0 text-vermilion"
              aria-hidden="true"
            />
            <p className="text-sm text-ink">
              {position !== null ? (
                <>
                  Готово — вы{" "}
                  <span className="tabular font-mono font-semibold text-vermilion">
                    №{position.toLocaleString("ru-RU")}
                  </span>{" "}
                  в списке. Напишем, когда будет что показать.
                </>
              ) : (
                <>Готово — мы напишем, когда будет что показать.</>
              )}
            </p>
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
              Email для уведомления о проекте
            </label>
            <div className="flex items-center gap-2 rounded-full border border-line bg-card p-1.5 pl-5 transition-colors duration-200 focus-within:border-ink/40">
              <input
                id={inputId}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                disabled={isSubmitting}
                aria-invalid={status === "error"}
                aria-describedby={error ? messageId : undefined}
                onChange={handleChange}
                className="h-9 flex-1 bg-transparent text-[15px] text-ink placeholder:text-ink-muted/70 outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                aria-label="Следить за проектом"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-vermilion text-paper transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-ink active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <CircleNotch
                    weight="light"
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowRight
                    weight="light"
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
            <div className="min-h-5 px-1" aria-live="polite">
              {error ? (
                <p
                  id={messageId}
                  role={status === "already" ? "status" : "alert"}
                  className={`text-[13px] ${status === "already" ? "text-ink-soft" : "text-vermilion"}`}
                >
                  {error}
                </p>
              ) : (
                <p className="text-[13px] text-ink-muted">
                  {count !== null ? (
                    <>
                      <span className="tabular font-mono text-ink-soft">
                        {count.toLocaleString("ru-RU")}
                      </span>{" "}
                      уже следят. Без спама — одно письмо.
                    </>
                  ) : (
                    <>Без спама — одно письмо, когда будет что показать.</>
                  )}
                </p>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
