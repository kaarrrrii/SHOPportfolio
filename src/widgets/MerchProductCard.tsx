"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import MerchImage from "@/components/MerchImage";

type MerchProductCardProps = {
  title: string;
  description: string;
  price: string;
  imageSrc: string;
  href?: string;
  actionHref?: string;
  actionLabel?: string;
  onAction?: () => void;
  accentIndex?: number;
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
  accentIndex = 0,
}: MerchProductCardProps) {
  const accent = cardAccentThemes[Math.abs(accentIndex) % cardAccentThemes.length];

  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-[14px] border p-3 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1.5 hover:rotate-[0.35deg] ${accent.card} sm:rounded-[20px] sm:p-4`}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-12 -left-1/2 z-10 w-1/3 rotate-12 bg-white/40 opacity-0 blur-[1px] transition-all duration-700 ease-out group-hover:left-[125%] group-hover:opacity-100"
      />
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1.5 transition-all duration-500 group-hover:h-2 ${accent.bar}`}
      />
      <ProductCardLink
        href={href}
        className={`relative mb-3 flex h-[168px] items-center justify-center overflow-hidden rounded-[12px] transition-colors duration-500 ${accent.image} sm:mb-4 sm:aspect-square sm:h-auto sm:rounded-[16px]`}
      >
        <MerchImage
          src={imageSrc}
          alt=""
          width={280}
          height={280}
          className="h-full w-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-2 sm:p-4"
        />
      </ProductCardLink>

      <div className="flex flex-1 flex-col">
        <ProductCardLink href={href} className="block">
          <h3 className={`text-[16px] font-black leading-[1.15] text-[#1A1A1A] transition-colors duration-300 ${accent.title} [font-family:var(--font-unbounded)] sm:text-[20px] sm:leading-[1.1]`}>
            {title}
          </h3>
        </ProductCardLink>
        <p className={`mt-2 flex-1 text-[13px] leading-[1.35] text-[#6B6B6B] transition-colors duration-300 ${accent.description} [font-family:var(--font-montserrat-alt)] sm:text-[14px] sm:leading-[1.4]`}>
          {description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4 sm:gap-3">
          <p className={`text-[15px] font-black leading-none text-[#1A1A1A] transition-colors duration-300 ${accent.price} [font-family:var(--font-unbounded)] sm:text-[18px]`}>
            {price}
            <span className={`ml-1 text-[11px] font-semibold text-[#8A8A8A] transition-colors duration-300 ${accent.priceUnit} [font-family:var(--font-montserrat-alt)] sm:text-[13px]`}>
              баллов
            </span>
          </p>

          <ProductAction
            href={actionHref || href}
            onAction={onAction}
            className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-[12px] font-bold shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_6px_16px_rgba(0,0,0,0.18)] ${accent.action} active:scale-95 [font-family:var(--font-montserrat-alt)] sm:gap-2 sm:px-5 sm:py-2.5 sm:text-[14px]`}
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

const cardAccentThemes = [
  {
    card: "border-[#F7B7D4] bg-[#FFF7FB] hover:border-[#FF3E80] hover:bg-[#FF3E80] hover:shadow-[0_16px_34px_rgba(255,62,128,0.28)]",
    bar: "bg-[#FF3E80] group-hover:bg-white/85",
    image: "bg-white/70 group-hover:bg-white",
    title: "text-[#E82E78] group-hover:text-white",
    description: "group-hover:text-white/90",
    price: "group-hover:text-white",
    priceUnit: "group-hover:text-white/75",
    action: "bg-[#FF3E80] text-white group-hover:bg-white group-hover:text-[#E82E78]",
  },
  {
    card: "border-[#C7B8F1] bg-[#FBF8FF] hover:border-[#7B5BC8] hover:bg-[#7B5BC8] hover:shadow-[0_16px_34px_rgba(123,91,200,0.28)]",
    bar: "bg-[#7B5BC8] group-hover:bg-white/85",
    image: "bg-white/70 group-hover:bg-white",
    title: "text-[#6A4FAD] group-hover:text-white",
    description: "group-hover:text-white/90",
    price: "group-hover:text-white",
    priceUnit: "group-hover:text-white/75",
    action: "bg-[#7B5BC8] text-white group-hover:bg-white group-hover:text-[#6A4FAD]",
  },
  {
    card: "border-[#9ADDEB] bg-[#F5FDFF] hover:border-[#22A7C7] hover:bg-[#22A7C7] hover:shadow-[0_16px_34px_rgba(34,167,199,0.28)]",
    bar: "bg-[#22A7C7] group-hover:bg-white/85",
    image: "bg-white/70 group-hover:bg-white",
    title: "text-[#1688A3] group-hover:text-white",
    description: "group-hover:text-white/90",
    price: "group-hover:text-white",
    priceUnit: "group-hover:text-white/75",
    action: "bg-[#22A7C7] text-white group-hover:bg-white group-hover:text-[#1688A3]",
  },
  {
    card: "border-[#F4D98B] bg-[#FFFCF0] hover:border-[#F2C94C] hover:bg-[#F2C94C] hover:shadow-[0_16px_34px_rgba(242,201,76,0.26)]",
    bar: "bg-[#F2C94C] group-hover:bg-white/85",
    image: "bg-white/70 group-hover:bg-white",
    title: "text-[#8A5A00] group-hover:text-[#111]",
    description: "group-hover:text-[#3F2A00]",
    price: "group-hover:text-[#111]",
    priceUnit: "group-hover:text-[#5F4300]",
    action: "bg-[#F2C94C] text-[#111] group-hover:bg-white group-hover:text-[#8A5A00]",
  },
  {
    card: "border-[#D6E779] bg-[#FCFFF3] hover:border-[#9AC225] hover:bg-[#9AC225] hover:shadow-[0_16px_34px_rgba(154,194,37,0.28)]",
    bar: "bg-[#B8CB2F] group-hover:bg-white/85",
    image: "bg-white/70 group-hover:bg-white",
    title: "text-[#7A9411] group-hover:text-white",
    description: "group-hover:text-white/90",
    price: "group-hover:text-white",
    priceUnit: "group-hover:text-white/75",
    action: "bg-[#9AC225] text-white group-hover:bg-white group-hover:text-[#6F8E16]",
  },
];

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
