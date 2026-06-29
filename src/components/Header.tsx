"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CoinBadge from "@/components/CoinBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import { logoutEsdirDemo, useEsdirAuth } from "@/shared/lib/auth";
import { useShopCart } from "@/shared/lib/shop";

const navItems = [
  { href: "/main", label: "О проекте" },
  { href: "/top", label: "Топ студентов" },
  { href: "/merch", label: "Мерч" },
  { href: "/cart", label: "Корзина" },
  { href: "/orders", label: "Заказы" },
];

type HeaderNavAccent = {
  active: string;
  inactive: string;
};

const headerNavAccents: Record<string, HeaderNavAccent> = {
  "/main": {
    active: "text-[#FF3E80] shadow-[inset_0_-3px_0_#FF3E80]",
    inactive: "text-[#1f1f1f] hover:text-[#FF3E80]",
  },
  "/top": {
    active: "text-[#9AC225] shadow-[inset_0_-3px_0_#9AC225]",
    inactive: "text-[#1f1f1f] hover:text-[#9AC225]",
  },
  "/merch": {
    active: "text-[#8A5A00] shadow-[inset_0_-3px_0_#F2C94C]",
    inactive: "text-[#1f1f1f] hover:text-[#8A5A00]",
  },
  "/cart": {
    active: "text-[#22A7C7] shadow-[inset_0_-3px_0_#22A7C7]",
    inactive: "text-[#1f1f1f] hover:text-[#22A7C7]",
  },
  "/orders": {
    active: "text-[#7B5BC8] shadow-[inset_0_-3px_0_#7B5BC8]",
    inactive: "text-[#1f1f1f] hover:text-[#7B5BC8]",
  },
};

const defaultHeaderNavAccent: HeaderNavAccent = {
  active: "text-[#8A5A00] shadow-[inset_0_-3px_0_#F2C94C]",
  inactive: "text-[#1f1f1f] hover:text-[#8A5A00]",
};

export default function Header() {
  const pathname = usePathname();
  const { totalQuantity } = useShopCart();
  const isAuthorized = useEsdirAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const visibleNavItems = navItems.filter((item) => (
    (item.href !== "/cart" && item.href !== "/orders") || isAuthorized
  ));

  function handleLogoutConfirm() {
    logoutEsdirDemo();
    setIsMenuOpen(false);
    setIsLogoutConfirmOpen(false);
  }

  return (
    <header className="sticky top-0 z-[80] w-full border-b border-[#ececec] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:h-[76px] sm:px-5 md:px-8">
        <Link href="/" className="flex min-w-0 cursor-pointer items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <Image
            src="/fire.svg"
            alt=""
            width={38}
            height={38}
            className="size-7 shrink-0 sm:size-8 md:size-9"
            priority
          />
          <span className="truncate text-[24px] font-bold leading-none text-[#171717] [font-family:var(--font-montserrat-alt)] sm:text-[30px] md:text-[36px]">
            Зажигаем
          </span>
        </Link>

        <nav className="hidden items-center gap-3 lg:flex">
          {visibleNavItems.map((item) => (
            <HeaderNavLink
              key={item.href}
              href={item.href}
              label={getNavLabel(item.label, item.href, totalQuantity)}
              isActive={isActivePath(pathname, item.href)}
              accent={headerNavAccents[item.href] || defaultHeaderNavAccent}
            />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <AccountShortcut
            isActive={isActivePath(pathname, "/account")}
            isAuthorized={isAuthorized}
            className="hidden lg:inline-flex"
          />
          {isAuthorized ? (
            <LogoutButton onClick={() => setIsLogoutConfirmOpen(true)} className="hidden lg:inline-flex" />
          ) : null}

          <button
            type="button"
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#d7eff5] bg-white text-[#1f1f1f] shadow-[0_4px_16px_rgba(34,167,199,0.12)] transition hover:border-[#22A7C7] hover:text-[#22A7C7] lg:hidden"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-x-0 top-[64px] z-[79] max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-[#ececec] bg-white px-4 py-4 shadow-[0_18px_34px_rgba(0,0,0,0.12)] sm:top-[76px] sm:max-h-[calc(100dvh-76px)] sm:px-5 lg:hidden">
          <div className="mb-4 grid gap-2">
            {isAuthorized ? <CoinBadge compact className="inline-flex w-full justify-center" /> : null}
            <AccountShortcut
              isActive={isActivePath(pathname, "/account")}
              isAuthorized={isAuthorized}
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex w-full"
            />
            {isAuthorized ? (
              <LogoutButton onClick={() => setIsLogoutConfirmOpen(true)} className="inline-flex w-full" />
            ) : null}
          </div>
          <nav className="grid gap-2">
            {visibleNavItems.map((item) => (
              <HeaderNavLink
                key={item.href}
                href={item.href}
                label={getNavLabel(item.label, item.href, totalQuantity)}
                isActive={isActivePath(pathname, item.href)}
                accent={headerNavAccents[item.href] || defaultHeaderNavAccent}
                onClick={() => setIsMenuOpen(false)}
                className="w-full px-4 py-3 text-[15px]"
              />
            ))}
          </nav>
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        title="Выйти из аккаунта?"
        description="После выхода корзина и заказы будут скрыты до следующего входа."
        confirmLabel="Выйти"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />
    </header>
  );
}

type LogoutButtonProps = {
  onClick?: () => void;
  className?: string;
};

function LogoutButton({ onClick, className }: LogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 cursor-pointer items-center justify-center whitespace-nowrap rounded-[10px] border border-[#ececec] bg-white px-4 text-[15px] font-black text-[#1f1f1f] shadow-[0_4px_18px_rgba(0,0,0,0.08)] transition hover:border-[#8B3DFF] hover:text-[#6F22E8] [font-family:var(--font-montserrat-alt)] ${className || "inline-flex"}`}
    >
      Выйти
    </button>
  );
}

type AccountShortcutProps = {
  isActive: boolean;
  isAuthorized: boolean;
  onClick?: () => void;
  className?: string;
};

function AccountShortcut({ isActive, isAuthorized, onClick, className }: AccountShortcutProps) {
  const resolvedClassName = [
    "h-11 items-center justify-center whitespace-nowrap rounded-[10px] px-4 text-[15px] font-black transition [font-family:var(--font-montserrat-alt)]",
    isAuthorized
      ? isActive
        ? "bg-[#FF3E80] text-white shadow-[0_8px_18px_rgba(255,62,128,0.24)]"
        : "border border-[#ececec] bg-white text-[#1f1f1f] shadow-[0_4px_18px_rgba(0,0,0,0.08)] hover:border-[#FF3E80] hover:text-[#E82E78]"
      : "bg-[#FF3E80] text-white shadow-[0_8px_18px_rgba(255,62,128,0.24)] hover:bg-white hover:text-[#FF3E80] hover:shadow-[0_12px_26px_rgba(255,62,128,0.28)]",
    className || "inline-flex",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href="/account" onClick={onClick} className={resolvedClassName}>
      {isAuthorized ? "Мой профиль" : "Вход"}
    </Link>
  );
}

type HeaderNavLinkProps = {
  href: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  accent?: HeaderNavAccent;
  className?: string;
};

function HeaderNavLink({
  href,
  label,
  isActive = false,
  onClick,
  accent = defaultHeaderNavAccent,
  className = "",
}: HeaderNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center whitespace-nowrap rounded-[10px] px-3 py-2 text-[16px] font-semibold transition-colors [font-family:var(--font-montserrat-alt)] ${
        isActive ? accent.active : accent.inactive
      } ${className}`}
    >
      {label}
    </Link>
  );
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getNavLabel(label: string, href: string, totalQuantity: number) {
  if (href === "/cart" && totalQuantity > 0) {
    return `${label} (${totalQuantity})`;
  }

  return label;
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

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
