"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logoutEsdirDemo, useAdminAuth } from "@/shared/lib/auth";

const adminNavItems = [
  { href: "/admin/merch", label: "Мерч" },
  { href: "/admin/orders", label: "Заказы" },
  { href: "/admin/showcase", label: "Витрина" },
];

type AdminNavAccent = {
  active: string;
  inactive: string;
};

const adminNavAccents: Record<string, AdminNavAccent> = {
  "/admin/merch": {
    active: "text-[#335EC8] shadow-[inset_0_-3px_0_#335EC8]",
    inactive: "text-[#1f1f1f] hover:text-[#335EC8]",
  },
  "/admin/orders": {
    active: "text-[#9AC225] shadow-[inset_0_-3px_0_#9AC225]",
    inactive: "text-[#1f1f1f] hover:text-[#9AC225]",
  },
  "/admin/showcase": {
    active: "text-[#22A7C7] shadow-[inset_0_-3px_0_#22A7C7]",
    inactive: "text-[#1f1f1f] hover:text-[#22A7C7]",
  },
};

const defaultAdminNavAccent: AdminNavAccent = {
  active: "text-[#335EC8] shadow-[inset_0_-3px_0_#335EC8]",
  inactive: "text-[#1f1f1f] hover:text-[#335EC8]",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthorized = useAdminAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logoutEsdirDemo();
    setIsMenuOpen(false);
    router.push("/account");
  }

  return (
    <header className="sticky top-0 z-[80] w-full border-b border-[#ececec] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:h-[76px] sm:px-5 md:px-8">
        <Link href="/admin/merch" className="flex min-w-0 cursor-pointer items-center gap-2" onClick={() => setIsMenuOpen(false)}>
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
          {adminNavItems.map((item) => (
            <AdminNavLink
              key={item.href}
              href={item.href}
              label={item.label}
              isActive={isActivePath(pathname, item.href)}
              accent={adminNavAccents[item.href] || defaultAdminNavAccent}
            />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthorized ? (
            <LogoutButton onClick={handleLogout} className="hidden lg:inline-flex" />
          ) : null}

          <button
            type="button"
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#d7eff5] bg-white text-[#1f1f1f] shadow-[0_4px_16px_rgba(34,167,199,0.12)] transition hover:border-[#967DD1] hover:text-[#967DD1] lg:hidden"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-x-0 top-[64px] z-[79] max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-[#ececec] bg-white px-4 py-4 shadow-[0_18px_34px_rgba(0,0,0,0.12)] sm:top-[76px] sm:max-h-[calc(100dvh-76px)] sm:px-5 lg:hidden">
          <nav className="grid gap-2">
            {adminNavItems.map((item) => (
              <AdminNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={isActivePath(pathname, item.href)}
                accent={adminNavAccents[item.href] || defaultAdminNavAccent}
                onClick={() => setIsMenuOpen(false)}
                className="w-full px-4 py-3 text-[15px]"
              />
            ))}
            {isAuthorized ? (
              <LogoutButton onClick={handleLogout} className="mt-2 inline-flex w-full" />
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

type LogoutButtonProps = {
  onClick: () => void;
  className?: string;
};

function LogoutButton({ onClick, className }: LogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 cursor-pointer items-center justify-center rounded-[10px] bg-[#FF3E80] px-4 text-[15px] font-black text-white shadow-[0_8px_18px_rgba(255,62,128,0.24)] transition hover:bg-[#E82E78] [font-family:var(--font-montserrat-alt)] ${className || "inline-flex"}`}
    >
      Выйти
    </button>
  );
}

type AdminNavLinkProps = {
  href: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  accent?: AdminNavAccent;
  className?: string;
};

function AdminNavLink({
  href,
  label,
  isActive = false,
  onClick,
  accent = defaultAdminNavAccent,
  className = "",
}: AdminNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center rounded-[10px] px-3 py-2 text-[16px] font-semibold transition-colors [font-family:var(--font-montserrat-alt)] ${
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
