import { Hero } from "@/components/sections/hero";
import { TeamsSection } from "@/components/sections/teams";
import { StructureSection } from "@/components/sections/structure";
import { ToolsSection } from "@/components/sections/tools";
import { MistakesSection } from "@/components/sections/mistakes";
import { TeamTeaser } from "@/components/sections/team-teaser";

/**
 * Home — the story, in order:
 * hero → how agent teams work → our structure → skills/MCP/plugins →
 * mistakes → team teaser. Copy is verbatim from knowledge/site-content-ru.md.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TeamsSection />
      {/* Structure (#how) ends with the interactive two-wave OrgChart. */}
      <StructureSection />
      {/* SLOT (next round): "watch the agents talk" message thread + build
          timeline — PM is compiling the real data. Place between structure and
          tools so the story reads: structure → see it happen → tooling. */}
      <ToolsSection />
      <MistakesSection />
      <TeamTeaser />
    </>
  );
}
