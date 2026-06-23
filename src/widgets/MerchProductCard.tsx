"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

type MerchProductCardProps = {
  title: string;
  description: string;
  price: string;
  imageSrc: string;
  href?: string;
  actionHref?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function MerchProductCard({
  title,
  description,
  price,
  imageSrc,
  href,
  actionHref,
  actionLabel = "В корзину",
  onAction,
}: MerchProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[14px] bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_8px_24px_rgba(34,167,199,0.16)] sm:rounded-[20px] sm:p-4">
      <ProductCardLink
        href={href}
        className="relative mb-3 flex h-[168px] items-center justify-center overflow-hidden rounded-[12px] bg-[#F8F8F8] sm:mb-4 sm:aspect-square sm:h-auto sm:rounded-[16px]"
      >
        <Image
          src={imageSrc}
          alt=""
          width={280}
          height={280}
          sizes="(max-width: 768px) 100vw, (max-width: 1440px) 33vw, 280px"
          className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105 sm:p-4"
          unoptimized
        />
      </ProductCardLink>

      <div className="flex flex-1 flex-col">
        <ProductCardLink href={href} className="block">
          <h3 className="text-[16px] font-black leading-[1.15] text-[#1A1A1A] transition-colors group-hover:text-[#335EC8] [font-family:var(--font-unbounded)] sm:text-[20px] sm:leading-[1.1]">
            {title}
          </h3>
        </ProductCardLink>
        <p className="mt-2 flex-1 text-[13px] leading-[1.35] text-[#6B6B6B] [font-family:var(--font-montserrat-alt)] sm:text-[14px] sm:leading-[1.4]">
          {description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4 sm:gap-3">
          <p className="text-[15px] font-black leading-none text-[#1A1A1A] [font-family:var(--font-unbounded)] sm:text-[18px]">
            {price}
            <span className="ml-1 text-[11px] font-semibold text-[#8A8A8A] [font-family:var(--font-montserrat-alt)] sm:text-[13px]">
              монеток
            </span>
          </p>

          <ProductAction
            href={actionHref || href}
            onAction={onAction}
            className="flex shrink-0 items-center gap-1 rounded-full bg-[#FF3E80] px-3 py-2 text-[12px] font-bold text-white shadow-[0_4px_12px_rgba(255,62,128,0.24)] transition-all hover:bg-[#E82E78] hover:shadow-[0_6px_16px_rgba(255,62,128,0.3)] active:scale-95 [font-family:var(--font-montserrat-alt)] sm:gap-2 sm:px-5 sm:py-2.5 sm:text-[14px]"
          >
            {actionLabel}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform group-hover:translate-x-1"
            >
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ProductAction>
        </div>
      </div>
    </article>
  );
}

type LinkLikeProps = {
  href?: string;
  className: string;
  children: ReactNode;
  onAction?: () => void;
};

function ProductCardLink({ href, className, children }: LinkLikeProps) {
  if (!href) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function ProductAction({ href, className, children, onAction }: LinkLikeProps) {
  if (onAction) {
    return (
      <button type="button" onClick={onAction} className={className}>
        {children}
      </button>
    );
  }

  if (!href) {
    return (
      <button type="button" className={className}>
        {children}
      </button>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
