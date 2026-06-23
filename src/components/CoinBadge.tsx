"use client";

import { formatCoins } from "@/shared/lib/format";
import { useWalletBalance } from "@/shared/lib/wallet";

type CoinBadgeProps = {
  value?: number;
  className?: string;
  compact?: boolean;
};

export default function CoinBadge({
  value,
  className,
  compact = false,
}: CoinBadgeProps) {
  const { balance } = useWalletBalance();
  const resolvedValue = value ?? balance;
  const resolvedClassName = [
    "inline-flex items-center gap-2 rounded-[10px] border border-[#D6E779] bg-[#FCFFF3] shadow-[0_4px_18px_rgba(184,203,47,0.14)]",
    compact ? "px-3 py-2" : "px-5 py-3",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={resolvedClassName}>
      <span
        aria-hidden="true"
        className="block size-6 shrink-0 bg-[#B8CB2F] [mask:url('/coins.svg')_center/contain_no-repeat] [-webkit-mask:url('/coins.svg')_center/contain_no-repeat]"
      />
      <span className="whitespace-nowrap text-[13px] font-semibold text-[#1f1f1f] [font-family:var(--font-montserrat-alt)] md:text-[15px]">
        Баланс: <strong>{formatCoins(resolvedValue)}</strong> баллов
      </span>
    </span>
  );
}
