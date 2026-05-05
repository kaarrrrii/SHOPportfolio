import Image from "next/image";

type MerchHeroProps = {
  title?: string;
  subtitle?: string;
};

export default function MerchHero({
  title = "МЕРЧ",
  subtitle = "Яркий мерч для тех, кто зажигает!",
}: MerchHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#FFF0F6] to-[#F5F5F5] py-16 md:py-24">
      {/* Декоративные элементы */}
      <div className="pointer-events-none absolute left-[10%] top-[20%] h-8 w-8 animate-pulse">
        <svg viewBox="0 0 32 32" fill="none" className="h-full w-full text-[#FF3E80]">
          <path
            d="M16 2L18.5 9.5H26L20 14.5L22.5 22L16 17L9.5 22L12 14.5L6 9.5H13.5L16 2Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="pointer-events-none absolute right-[15%] top-[30%] h-6 w-6">
        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full text-[#34C3FF]">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7V17M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="pointer-events-none absolute bottom-[25%] left-[20%] h-5 w-5">
        <svg viewBox="0 0 20 20" fill="none" className="h-full w-full text-[#84D65A]">
          <rect x="2" y="2" width="16" height="16" rx="4" fill="currentColor" />
        </svg>
      </div>
      <div className="pointer-events-none absolute right-[25%] bottom-[15%] h-7 w-7">
        <svg viewBox="0 0 28 28" fill="none" className="h-full w-full text-[#FF6B00]">
          <path
            d="M14 4L16.5 10.5H23L17.5 15L19.5 22L14 17.5L8.5 22L10.5 15L5 10.5H11.5L14 4Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 text-center md:px-8">
        <h1 className="text-[56px] font-black uppercase leading-[0.9] tracking-tight text-[#1A1A1A] [font-family:var(--font-unbounded)] md:text-[72px] lg:text-[84px]">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-[600px] text-[18px] font-medium text-[#454545] [font-family:var(--font-montserrat-alt)] md:text-[22px]">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
