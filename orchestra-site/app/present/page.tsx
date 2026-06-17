import type { Metadata } from "next";
import { PresenterDeck } from "@/components/presenter/presenter-deck";

export const metadata: Metadata = {
  title: "Режим презентации — Orchestra",
  description:
    "Подсказки ведущего: что говорить и какой факт уронить в зал на каждом бите живого прохода по сайту. Держите на втором экране или телефоне.",
  robots: { index: false, follow: false },
};

/**
 * /present — the standalone presenter deck. Meant for a second device / second
 * window / phone held while the projector shows the live site.
 */
export default function PresentPage() {
  return <PresenterDeck />;
}
