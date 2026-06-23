import Link from "next/link";

type ActionButtonProps = {
  label: string;
  className?: string;
  href?: string;
};

export default function ActionButton({
  label,
  className,
  href,
}: ActionButtonProps) {
  const baseClassName =
    "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap";
  const resolvedClassName = [baseClassName, className].filter(Boolean).join(" ");

  if (href) {
    return (
      <Link href={href} className={resolvedClassName}>
        <span>{label}</span>
        <ArrowRightIcon />
      </Link>
    );
  }

  return (
    <button type="button" className={resolvedClassName}>
      <span>{label}</span>
      <ArrowRightIcon />
    </button>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="34"
      height="18"
      viewBox="0 0 34 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[14px] w-[26px] shrink-0 sm:h-[18px] sm:w-[34px]"
      aria-hidden="true"
    >
      <path
        d="M1.5 9H31M31 9L24.5 2.5M31 9L24.5 15.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
