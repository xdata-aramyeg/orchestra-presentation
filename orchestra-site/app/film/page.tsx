import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";
import FilmPlayer from "./player";

export const metadata: Metadata = {
  title: "Фильм — Orchestra",
  description:
    "~75-секундный фильм о том, как команда из семи агентов собрала этот сайт — честно, с провальным v1, резкой обратной связью и сбросом к чистому листу. Снято Хроникёром на Remotion.",
};

export default function FilmPage() {
  return (
    <>
      <section className="bg-paper px-4 pt-28 pb-10 sm:px-8 sm:pt-32 sm:pb-12">
        <div className="mx-auto w-full max-w-[1200px]">
          <Reveal>
            <Eyebrow>Хроника</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 max-w-[20ch] font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Посмотрите, как этот сайт собрал сам себя.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-soft">
              ~75-секундный фильм о том, как команда из семи агентов пришла к этой
              странице — честно, с провальным v1, резкой обратной связью и сбросом
              к чистому листу. Снято Хроникёром на Remotion и встроено прямо сюда.
            </p>
          </Reveal>
        </div>
      </section>

      <Section>
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-[0_30px_80px_rgba(26,23,20,0.10)]">
            <FilmPlayer />
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-5 text-center font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
            Этот фильм тоже сделан командой. На Opus. С настоящими ошибками по пути.
          </p>
        </Reveal>
      </Section>
    </>
  );
}
