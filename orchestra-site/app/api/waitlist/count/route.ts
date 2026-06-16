import { getCount } from "@/lib/db";

// Always reflect the live DB count — never a cached/prerendered value (AC3).
export const dynamic = "force-dynamic";

/**
 * GET /api/waitlist/count
 *  - 200 { count } — current total on the waitlist
 *  - 500 { error } — on any unexpected failure (never leaks internals)
 */
export async function GET(): Promise<Response> {
  try {
    const count = getCount();
    return Response.json({ count }, { status: 200 });
  } catch (error) {
    console.error("GET /api/waitlist/count failed:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
