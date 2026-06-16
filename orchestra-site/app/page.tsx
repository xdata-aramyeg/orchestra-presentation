import { Nav } from "../components/sections/nav";
import { Hero } from "../components/sections/hero";
import { Features } from "../components/sections/features";
import { HowItWorks } from "../components/sections/how-it-works";
import { RoleStrip } from "../components/sections/role-strip";
import { WaitlistCta } from "../components/sections/waitlist-cta";
import { Footer } from "../components/sections/footer";
import { WaitlistProvider } from "../components/waitlist/waitlist-provider";

/**
 * Orchestra launch landing page. WaitlistProvider wraps the whole page so the
 * hero form, the bottom-CTA form, and both live counters share one count —
 * loaded from GET /api/waitlist/count on mount and refreshed on every join.
 */
export default function Home() {
  return (
    <WaitlistProvider>
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <RoleStrip />
        <WaitlistCta />
      </main>
      <Footer />
    </WaitlistProvider>
  );
}
