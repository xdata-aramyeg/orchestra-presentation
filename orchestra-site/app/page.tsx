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
      <StructureSection />
      <ToolsSection />
      <MistakesSection />
      <TeamTeaser />
    </>
  );
}
