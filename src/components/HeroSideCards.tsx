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
    <article className="relative h-[300px] rounded-[12px] bg-[#b2bf32] p-4 sm:h-[390px] sm:rounded-[18px] sm:p-5 xl:h-[520px]">
      <h3 className="text-[24px] font-black uppercase leading-[0.95] text-black [font-family:var(--font-unbounded)] sm:text-[35px] sm:leading-[0.9]">
        Мерч,
        <br />
        который
        <br />
        вдохновляет
      </h3>

      <div className="relative mt-3 h-[160px] sm:mt-4 sm:h-[250px] xl:h-[320px]">
        <Image
          src="/merch__hero.png"
          alt="Черное худи с брендом Зажигаем"
          fill
          sizes="(max-width: 1280px) 100vw, 280px"
          className="object-contain mix-blend-multiply"
        />
      </div>

      <ActionButton
        href="/merch"
        label="Смотреть мерч"
        className="absolute bottom-4 left-1/2 h-[46px] w-[calc(100%-32px)] max-w-[300px] -translate-x-1/2 rounded-[10px] bg-white px-4 text-[16px] font-medium text-black [font-family:var(--font-montserrat-alt)] sm:bottom-5 sm:h-[58px] sm:w-[calc(100%-40px)] sm:max-w-[330px] sm:px-5 sm:text-[22px] xl:h-[66px] xl:text-[24px]"
      />
    </article>
  );
}
