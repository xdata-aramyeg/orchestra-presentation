import { Hero } from "@/components/sections/hero";
import { TeamsSection } from "@/components/sections/teams";
import { StructureSection } from "@/components/sections/structure";
import { MessageThread } from "@/components/sections/message-thread";
import { ToolsSection } from "@/components/sections/tools";
import { Timeline } from "@/components/sections/timeline";
import { MistakesSection } from "@/components/sections/mistakes";
import { UnderTheHood } from "@/components/sections/under-the-hood";
import { TeamTeaser } from "@/components/sections/team-teaser";

/**
 * Home — the story, in order:
 * 01 how agent teams work → 02 our structure (+ org chart) → 03 the real team
 * exchange → 04 skills/MCP/plugins → 05 build chronology → 06 mistakes →
 * 07 team teaser. Copy is verbatim from the PM's knowledge files.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TeamsSection />
      {/* Structure (#how) ends with the interactive two-wave OrgChart. */}
      <StructureSection />
      {/* The payoff of "how the team works": the real exchange. */}
      <MessageThread />
      <ToolsSection />
      {/* "How we got here" — sits right before the honest mistakes section. */}
      <Timeline />
      <MistakesSection />
      {/* The educational dial: how it works + how to repeat it. */}
      <UnderTheHood />
      <TeamTeaser />
    </>
  );
}
