import type { ReactNode } from "react";

type IconSquareButtonProps = {
  icon: ReactNode;
  ariaLabel: string;
  className?: string;
};

export default function IconSquareButton({
  icon,
  ariaLabel,
  className,
}: IconSquareButtonProps) {
  const resolvedClassName = [
    "grid size-[44px] cursor-pointer place-items-center rounded-[9px] bg-[#b8cb2f] text-[#1f1f1f] transition-transform hover:scale-[1.04]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={resolvedClassName} aria-label={ariaLabel}>
      {icon}
    </button>
  );
}
