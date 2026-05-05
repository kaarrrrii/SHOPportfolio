import type { ReactNode } from "react";

type OverlayRibbonProps = {
  text: string;
  icon?: ReactNode;
  className?: string;
  textClassName?: string;
};

export default function OverlayRibbon({
  text,
  icon,
  className,
  textClassName,
}: OverlayRibbonProps) {
  const resolvedClassName = [
    "inline-flex items-center gap-3 rounded-[8px] px-4 py-3",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const resolvedTextClassName = [
    "text-[26px] font-bold uppercase leading-[0.95] tracking-[0.01em] text-white [font-family:var(--font-unbounded)]",
    textClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={resolvedClassName}>
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <p className={resolvedTextClassName}>{text}</p>
    </div>
  );
}
