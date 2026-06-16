/**
 * Light client-side email check for fast UX feedback only. The backend's zod
 * schema is the authoritative validator (the API contract owns the 400). This
 * just catches the obvious empties/typos before a round trip.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function looksLikeEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}
