import { Eyebrow } from "@/components/ui/eyebrow";

type SectionMarkerProps = {
  /** editorial index, e.g. "01" */
  index: string;
  /** eyebrow label */
  label: string;
};

/**
 * Numbered editorial section marker: a mono index, a hairline rule, and the
 * eyebrow pill. Threads the same 01–05 numbering used on the character pages
 * through the home sections so the rhythm reads as one publication.
 */
export function SectionMarker({ index, label }: SectionMarkerProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="tabular font-mono text-sm text-vermilion">{index}</span>
      <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
      <Eyebrow marker={false}>{label}</Eyebrow>
    </div>
  );
}
