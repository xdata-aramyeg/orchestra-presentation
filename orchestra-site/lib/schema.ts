import { z } from "zod";

/** Validation for a waitlist signup. Trims and lowercases before checking. */
export const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
