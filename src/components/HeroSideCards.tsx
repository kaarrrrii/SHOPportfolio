import Image from "next/image";
import ActionButton from "@/components/ActionButton";

export default function HeroSideCards() {
  return (
    <aside className="w-full xl:max-w-[840px]">
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.6fr_1fr]">
        <HeroCommunityCard />
        <HeroMerchCard />
      </div>
    </aside>
  );
}

function HeroCommunityCard() {
  return (
    <article className="relative h-[260px] overflow-hidden rounded-[12px] bg-[#cfcfcf] sm:h-[380px] sm:rounded-[18px] md:h-[460px] xl:h-[520px]">
      <Image
        src="/students__hero.jpg"
        alt="Студенты проекта Зажигаем"
        fill
        sizes="(max-width: 1280px) 100vw, 620px"
        className="object-cover object-[50%_20%] xl:object-center"
        preload
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.24),transparent_48%)]" />
    </article>
  );
}

function HeroMerchCard() {
  return (
    <article className="relative flex min-h-[330px] flex-col overflow-hidden rounded-[12px] bg-[#b2bf32] p-4 sm:min-h-[410px] sm:rounded-[18px] sm:p-5 xl:h-[520px]">
      <h3 className="relative z-10 text-[18px] font-black uppercase leading-[1] text-black [font-family:var(--font-unbounded)] sm:text-[24px] xl:text-[28px]">
        Мерч,
        <br />
        который
        <br />
        вдохновляет
      </h3>

      <div className="relative mt-2 min-h-0 flex-1 sm:mt-3">
        <Image
          src="/худи.png"
          alt="Черное худи с брендом Зажигаем"
          fill
          sizes="(max-width: 1280px) 100vw, 280px"
          className="object-contain object-center"
        />
      </div>

      <ActionButton
        href="/merch"
        label="Смотреть мерч"
        className="relative z-10 mt-3 h-[46px] w-full rounded-[10px] bg-white px-4 text-[16px] font-medium text-black [font-family:var(--font-montserrat-alt)] sm:mt-4 sm:h-[58px] sm:px-5 sm:text-[22px] xl:h-[66px] xl:text-[24px]"
      />
    </article>
  );
}
