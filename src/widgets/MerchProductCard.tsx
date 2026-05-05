import Image from "next/image";

type MerchProductCardProps = {
  title: string;
  description: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  imageClassName?: string;
  buttonColor?: "pink" | "blue" | "green" | "orange";
};

export default function MerchProductCard({
  title,
  description,
  price,
  imageSrc,
  imageAlt,
  imageClassName,
  buttonColor = "pink",
}: MerchProductCardProps) {
  const buttonColors = {
    pink: "bg-[#FF3E80] hover:bg-[#FF1A65]",
    blue: "bg-[#34C3FF] hover:bg-[#1BAFFF]",
    green: "bg-[#84D65A] hover:bg-[#6BC93A]",
    orange: "bg-[#FF6B00] hover:bg-[#E65C00]",
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      <div className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-[16px] bg-[#F8F8F8]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={280}
          height={280}
          sizes="(max-width: 768px) 100vw, (max-width: 1440px) 33vw, 280px"
          className={`h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105 ${imageClassName || ""}`}
          unoptimized
        />
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="text-[20px] font-black leading-[1.1] text-[#1A1A1A] [font-family:var(--font-unbounded)]">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-[14px] leading-[1.4] text-[#6B6B6B] [font-family:var(--font-montserrat-alt)]">
          {description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-[18px] font-black leading-none text-[#1A1A1A] [font-family:var(--font-unbounded)]">
            {price}
            <span className="ml-1 text-[13px] font-semibold text-[#8A8A8A] [font-family:var(--font-montserrat-alt)]">
              монеток
            </span>
          </p>

          <button
            type="button"
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-bold text-white transition-all ${buttonColors[buttonColor]} shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] active:scale-95 [font-family:var(--font-montserrat-alt)]`}
          >
            Купить
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
          </button>
        </div>
      </div>
    </article>
  );
}
