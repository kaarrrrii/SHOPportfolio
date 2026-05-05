import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: string;
  icon?: ReactNode;
  className?: string;
  titleClassName?: string;
  accentBarClassName?: string;
};

export default function SectionHeading({
  title,
  icon,
  className,
  titleClassName,
  accentBarClassName,
}: SectionHeadingProps) {
  const wrapperClassName = ["flex items-start gap-4", className]
    .filter(Boolean)
    .join(" ");
  const resolvedTitleClassName = [
    "text-[43px] font-black uppercase leading-[0.9] tracking-[-0.02em] text-[#111] [font-family:var(--font-unbounded)]",
    titleClassName,
  ]
    .filter(Boolean)
    .join(" ");
  const resolvedAccentBarClassName = [
    "mt-3 block h-[4px] w-full max-w-[190px] rounded-full bg-[#4bc8de]",
    accentBarClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName}>
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <div className="min-w-0">
        <h2 className={resolvedTitleClassName}>{title}</h2>
        <span className={resolvedAccentBarClassName} aria-hidden="true" />
      </div>
    </div>
  );
}
