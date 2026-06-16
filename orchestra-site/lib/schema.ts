import { z } from "zod";

const EMAIL_ERROR = "Enter a valid email address";

/**
 * Validation schema for the waitlist `POST` body.
 *
 * The email is trimmed and lowercased *before* format validation, so
 * `"  A@B.com "` and `"a@b.com"` normalize to the same value (AC8). The
 * normalized value is what callers should insert/compare. Malformed inputs
 * (`foo`, `foo@`, `a@b`) and empty/missing values fail with a single,
 * human-readable message (AC4, AC6).
 */
export const waitlistSchema = z.object({
  email: z
    .string({ error: EMAIL_ERROR })
    .trim()
    .toLowerCase()
    .pipe(z.email(EMAIL_ERROR)),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
