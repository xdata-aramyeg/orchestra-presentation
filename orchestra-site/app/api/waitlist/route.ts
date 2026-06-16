import { addEmail } from "@/lib/db";
import { waitlistSchema } from "@/lib/schema";

const GENERIC_ERROR = "Something went wrong. Please try again.";
const DUPLICATE_MESSAGE = "You're already on the list — hang tight.";

/**
 * POST /api/waitlist
 *
 * Body: { email: string }
 *  - 201 { position, count } on a successful new join
 *  - 400 { error }          on invalid / empty / malformed email
 *  - 409 { error, already } when the email is already on the list
 *  - 500 { error }          on any unexpected failure (never leaks internals)
 */
export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Enter a valid email address";
    return Response.json({ error: message }, { status: 400 });
  }

  try {
    const { position, count } = addEmail(parsed.data.email);
    return Response.json({ position, count }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "DUP") {
      return Response.json(
        { error: DUPLICATE_MESSAGE, already: true },
        { status: 409 },
      );
    }
    console.error("POST /api/waitlist failed:", error);
    return Response.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
