import { Section } from "@/components/ui/section";
import { SectionMarker } from "@/components/ui/section-marker";
import { BezelCard } from "@/components/ui/bezel-card";
import { Reveal } from "@/components/motion/reveal";

type Item = { name: string; body: string };

const SKILLS: readonly Item[] = [
  { name: "brainstorming", body: "Прояснил намерение и требования до того, как мы что-либо начали строить." },
  { name: "writing-plans", body: "Превратил спецификацию в пошаговый план с фазами и зависимостями." },
  { name: "superpowers", body: "Мета-скилл: как находить и применять нужные навыки в нужный момент." },
  { name: "ui-ux-pro-max", body: "Выбор дизайн-направления: палитры, шрифтовые пары, типы продукта." },
  { name: "frontend-design", body: "Сборка отчётливого, «студийного» UI без шаблонной ИИ-эстетики." },
  { name: "frontend-patterns", body: "Паттерны React/Next: состояние, производительность, аккуратные компоненты." },
  { name: "backend-patterns", body: "Дизайн API, работа с БД и серверные best practices." },
  { name: "security-review", body: "Чек-лист безопасности перед коммитом: ввод, секреты, утечки ошибок." },
  { name: "design-taste-frontend", body: "Критика вкуса фронтенда: где дёшево, где претенциозно, где хорошо." },
  { name: "high-end-visual-design", body: "Поднимал визуальную планку до уровня «как у хорошей студии»." },
  { name: "gpt-taste", body: "Ещё один взгляд на вкус — независимая оценка визуала и копирайта." },
  { name: "brandkit", body: "Токены бренда и идентичность: цвет, типографика, тон — записаны один раз." },
];

const MCPS: readonly Item[] = [
  { name: "Figma", body: "Мост дизайн ↔ код: токены и контекст макета вытягиваются в код и обратно." },
  { name: "21st.dev magic", body: "Генерирует готовые UI-компоненты, из которых собиралась страница." },
  { name: "Chrome / claude-in-chrome", body: "QA через него водит настоящий браузер — кликает, читает, проверяет." },
  { name: "Playwright", body: "Браузерная автоматизация для воспроизводимых E2E-сценариев." },
];

const PLUGINS: readonly Item[] = [
  { name: "ui-ux-pro-max", body: "Дизайн-интеллект: 50+ стилей, палитры, шрифтовые пары, гайды по UX." },
  { name: "everything-claude-code", body: "Набор агентов и скиллов: ревью, планирование, паттерны, TDD." },
  { name: "figma", body: "Официальный мост к Figma — чтение макетов и запись дизайна из кода." },
  { name: "playwright", body: "E2E-инструменты для проверки критических пользовательских путей." },
  { name: "claude-in-chrome", body: "Управление вашим Chrome: клики, формы, скриншоты, консоль." },
];

function ToolGroup({
  label,
  items,
}: {
  label: string;
  items: readonly Item[];
}) {
  return (
    <BezelCard className="h-full" innerClassName="h-full">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-vermilion">
        {label}
      </p>
      <dl className="mt-6 divide-y divide-line">
        {items.map((item) => (
          <div key={item.name} className="py-4 first:pt-0 last:pb-0">
            <dt className="font-mono text-sm text-ink">{item.name}</dt>
            <dd className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
              {item.body}
            </dd>
          </div>
        ))}
      </dl>
    </BezelCard>
  );
}

/** §1.4 — the skills, MCPs, and plugins we used. */
export function ToolsSection() {
  return (
    <Section id="tools" alt>
      <div className="max-w-3xl">
        <Reveal>
          <SectionMarker index="04" label="Инструментарий" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 font-display text-3xl leading-[1.1] font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Чем мы это делали — без магии, по списку.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-7 text-lg leading-relaxed text-ink-soft">
            Команда не изобретала инструменты на ходу. Каждый агент опирался на
            скиллы Claude Code, на MCP-серверы для доступа к внешним системам и
            на несколько плагинов. Вот честный перечень — и что каждый из них
            сделал.
          </p>
        </Reveal>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <ToolGroup label="Скиллы · skills" items={SKILLS} />
        </Reveal>
        <div className="grid gap-4">
          <Reveal delay={0.06}>
            <ToolGroup label="MCP-серверы" items={MCPS} />
          </Reveal>
          <Reveal delay={0.12}>
            <ToolGroup label="Плагины" items={PLUGINS} />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
