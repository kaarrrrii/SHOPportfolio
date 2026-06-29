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
    "inline-flex items-center rounded-[8px]",
    className || "gap-3 px-4 py-3",
  ]
    .filter(Boolean)
    .join(" ");
  const resolvedTextClassName = [
    "font-bold uppercase tracking-[0.01em] [font-family:var(--font-unbounded)]",
    textClassName || "text-[26px] leading-[0.95] text-white",
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
