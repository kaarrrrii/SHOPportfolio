type MerchHeroProps = {
  title?: string;
  subtitle?: string;
};

export default function MerchHero({
  title = "Мерч",
  subtitle = "Яркие вещи для тех, кто участвует в событиях, предлагает идеи и зажигает кампус.",
}: MerchHeroProps) {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24">
      <div className="relative mx-auto max-w-[1440px] px-5 text-center md:px-8">
        <h1 className="text-[56px] font-black uppercase leading-[0.9] text-[#1A1A1A] [font-family:var(--font-unbounded)] md:text-[72px] lg:text-[84px]">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-[680px] text-[18px] font-medium text-[#454545] [font-family:var(--font-montserrat-alt)] md:text-[22px]">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
