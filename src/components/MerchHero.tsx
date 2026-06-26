type MerchHeroProps = {
  title?: string;
  subtitle?: string;
};

export default function MerchHero({
  title = "Мерч",
  subtitle = "Яркие вещи для тех, кто участвует в событиях, предлагает идеи и зажигает кампус.",
}: MerchHeroProps) {
  return (
    <section className="relative w-full overflow-hidden py-9 md:py-12">
      <div className="relative mx-auto max-w-[1440px] px-5 text-left md:px-8">
        <h1 className="text-[44px] font-black uppercase leading-[0.95] text-[#1A1A1A] [font-family:var(--font-unbounded)] md:text-[64px] lg:text-[72px]">
          {title}
        </h1>
        <p className="mt-3 max-w-[680px] text-[16px] font-medium leading-[1.4] text-[#454545] [font-family:var(--font-montserrat-alt)] md:text-[20px]">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
