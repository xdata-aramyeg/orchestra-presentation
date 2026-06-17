import type { Metadata, Viewport } from "next";
import { Unbounded, Onest, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@/components/avatars/avatars.css";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { EasterTerminal } from "@/components/easter/terminal";

/*
 * Cyrillic-capable type system (all three carry the `cyrillic` subset on Google
 * Fonts, so Russian renders without falling back to a system font):
 *   display — Unbounded (expressive, confident headlines)
 *   body/UI — Onest (clean, modern, excellent Cyrillic)
 *   mono    — JetBrains Mono (technical labels, handles, slugs)
 */
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/*
 * Same typeface, loaded as the variable font (full `wght` axis, no fixed
 * weights) so a single element can animate `font-variation-settings: "wght"` on
 * scroll. Exposed under its own variable and used ONLY by the «ОРКЕСТР»
 * divider — the static instance above still backs every other heading.
 */
const unboundedVariable = Unbounded({
  variable: "--font-unbounded-var",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Orchestra — сайт, который построил сам себя",
  description:
    "Самореферентная презентация: команда из семи агентов Claude Code на Opus спланировала, построила, протестировала и проверила эту страницу — параллельно, с барьерами качества и честными ошибками.",
  openGraph: {
    title: "Orchestra — сайт, который построил сам себя",
    description:
      "Семь агентов Claude Code: оркестратор, аналитик, фронтенд, бэкенд, тестировщик, ревьюер и хроникёр. Их отчёт о самих себе — ошибки включительно.",
    type: "website",
    locale: "ru_RU",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${unbounded.variable} ${unboundedVariable.variable} ${onest.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-[100dvh] antialiased">
        <div className="grain" aria-hidden="true" />
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
        <EasterTerminal />
      </body>
    </html>
  );
}
