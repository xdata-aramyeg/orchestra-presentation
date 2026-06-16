import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { BezelCard } from "@/components/ui/bezel-card";
import { IslandLink } from "@/components/ui/island-link";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Цель — Orchestra",
  description:
    "Северная звезда: построить презентацию, которая честно рассказывает о самой себе.",
};

const SHOWS = [
  { name: "Цель", body: "Отдельная страница, где цель сформулирована прямо. Вы её читаете." },
  {
    name: "Как работают команды агентов",
    body: "Лид и тиммейты, общий список задач, почтовый ящик, роли-определения; что идёт асинхронно, а что — синхронно; барьеры.",
  },
  {
    name: "Агенты, которых мы реально использовали",
    body: "Страница-персонаж на каждого: Маэстро, Либреттист, Сценограф, Машинист, Камертон, Рецензент — с ролью, моделью (Opus), инструментами, характером и реальной работой по этому сайту.",
  },
  {
    name: "Структура, которую мы применили",
    body: "Две волны, асинхрон и синхрон, барьер «фича готова», правило idle-during-QA, гейты QA → Ревью.",
  },
  { name: "Скиллы, MCP и плагины по пути", body: "Поимённо и с пояснением, что каждый сделал." },
  {
    name: "Ошибки, которые мы сделали",
    body: "Честно. Лид кодил руками, роль QA была размыта, первый дизайн «выглядел плохо», полный сброс, лимит Figma. Ошибка → урок. Эта честность — лучшая часть.",
  },
] as const;

const PRINCIPLES = [
  {
    name: "Язык — русский.",
    body: "Вся видимая посетителю копия — на русском. Код, комментарии и docs остаются на английском.",
  },
  {
    name: "Дизайн — светлый, редакторский, дорогой, со вкусом.",
    body: "Не тёмный. Не дежурный «AI-slop»: без неона, без фиолетовых градиентов по чёрному, без центрированного героя поверх «меша». Думайте о красиво свёрстанном инженерном кейсе.",
  },
  {
    name: "Самореферентность и честность.",
    body: "Сайт документирует собственное создание — ошибки включительно.",
  },
  {
    name: "Планка качества.",
    body: "Должно выглядеть так, будто это выпустила сильная дизайн-студия. Мы итерируем — собрать → скриншот → критика → улучшить — пока планка не взята. Не соглашаемся на посредственное.",
  },
] as const;

export default function GoalPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-paper px-4 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-16">
        <div className="mx-auto w-full max-w-[1200px]">
          <Reveal>
            <Eyebrow>Северная звезда</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-7 max-w-[20ch] font-display text-[2.4rem] leading-[1.06] font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Цель: построить презентацию, которая честно рассказывает о самой
              себе.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              Мы строим самореферентный сайт-презентацию — силами этой самой
              команды агентов Claude Code, — который рассказывает, как работает
              агентная команда в Claude Code. Сайт и есть презентация. Это не
              фейковый продукт; это честный, хорошо рассказанный разбор самого
              себя.
            </p>
          </Reveal>
        </div>
      </section>

      {/* What the site must show */}
      <Section alt>
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Что сайт обязан показать
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-5 md:grid-cols-2">
          {SHOWS.map((item, i) => (
            <Reveal as="li" key={item.name} delay={(i % 2) * 0.06}>
              <BezelCard className="h-full" innerClassName="flex h-full gap-5">
                <span className="font-mono text-sm text-vermilion">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </div>
              </BezelCard>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Non-negotiable principles */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.6fr_1fr] lg:gap-20">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Принципы, которыми не торгуемся
            </h2>
          </Reveal>
          <ul className="space-y-8">
            {PRINCIPLES.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 0.05}>
                <div className="border-b border-line pb-7">
                  <h3 className="font-display text-lg font-semibold text-vermilion">
                    {p.name}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* Closing */}
      <Section alt>
        <Reveal>
          <p className="mx-auto max-w-3xl text-center font-display text-2xl leading-snug text-ink sm:text-3xl">
            Если коротко: демо про агентные команды должно демонстрировать
            команду — честно, с провалами, — а не продавать несуществующий
            продукт. Эта страница спланирована, построена, протестирована и
            проверена той самой командой, которую она описывает.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-12 flex justify-center">
            <IslandLink href="/agents">Познакомиться с командой</IslandLink>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
