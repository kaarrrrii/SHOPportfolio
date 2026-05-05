import Link from "next/link";

const navItems = [
  { href: "/merch", label: "Мерч" },
  { href: "/main", label: "О проекте" },
  { href: "/top", label: "Топ студентов" },
  { href: "/cart", label: "Корзина" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#ececec] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex h-[84px] max-w-[1440px] items-center justify-between gap-3 px-5 md:px-8">
        <Link href="/" className="flex cursor-pointer items-center gap-2">
          <BrandMark />
          <span className="text-[34px] font-bold leading-none text-[#171717] [font-family:var(--font-montserrat-alt)] md:text-[40px]">
            Зажигаем
          </span>
        </Link>

        <nav className="hidden items-center gap-3 lg:flex">
          {navItems.map((item) => (
            <HeaderNavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CoinsSvgIcon className="size-9 md:hidden" />

          <div className="hidden h-[44px] items-center gap-3 rounded-[10px] border border-[#ececec] bg-white px-5 shadow-[0_4px_18px_rgba(0,0,0,0.08)] md:flex">
            <CoinsSvgIcon className="size-7" />
            <span className="text-[17px] font-semibold text-[#1f1f1f] [font-family:var(--font-montserrat-alt)]">
              Баланс:{" "}
              <span className="inline-flex items-center gap-1">
                <span className="font-bold">1029</span>
              </span>{" "}
              монеток
            </span>
          </div>

          <button
            type="button"
            aria-label="Открыть меню"
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-[10px] border border-[#e8e8e8] bg-white text-[#1f1f1f] shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition hover:border-[#ff4aa2] hover:text-[#ff4aa2] lg:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

type HeaderNavLinkProps = {
  href: string;
  label: string;
};

function HeaderNavLink({ href, label }: HeaderNavLinkProps) {
  return (
    <Link
      href={href}
      className="cursor-pointer rounded-[10px] px-3 py-2 text-[16px] font-semibold text-[#1f1f1f] transition-colors hover:text-[#ff3f9f] [font-family:var(--font-montserrat-alt)]"
    >
      {label}
    </Link>
  );
}

type CoinsSvgIconProps = {
  className?: string;
};

function CoinsSvgIcon({ className }: CoinsSvgIconProps) {
  const resolvedClassName = [
    "block bg-[#ff4aa2] [mask:url('/coins.svg')_center/contain_no-repeat] [-webkit-mask:url('/coins.svg')_center/contain_no-repeat]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span aria-hidden="true" className={resolvedClassName} />;
}

function BrandMark() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      <path d="M12 11L18 17" stroke="#FF4AA2" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 11L12 17" stroke="#FF4AA2" strokeWidth="3" strokeLinecap="round" />
      <path d="M15 3V6" stroke="#FF4AA2" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M5 14H8" stroke="#FF4AA2" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7.2 6.8L9.4 9" stroke="#FF4AA2" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7.2 21.2L9.4 19" stroke="#FF4AA2" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M15 22V25" stroke="#FF4AA2" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M3 5H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
