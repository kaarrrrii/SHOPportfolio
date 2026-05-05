import Image from "next/image";
import ActionButton from "@/components/ActionButton";

export default function HeroSideCards() {
  return (
    <aside className="w-full xl:max-w-[840px]">
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <HeroCommunityCard />
        <HeroMerchCard />
      </div>
    </aside>
  );
}

function HeroCommunityCard() {
  return (
    <article className="relative h-[520px] overflow-hidden rounded-[18px] bg-[#cfcfcf]">
      <Image
        src="/students__hero.jpeg"
        alt="Студенты проекта Зажигаем"
        fill
        sizes="(max-width: 1280px) 100vw, 620px"
        className="object-cover grayscale"
        preload
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.24),transparent_48%)]" />
    </article>
  );
}

function HeroMerchCard() {
  return (
    <article className="relative h-[520px] rounded-[18px] bg-[#b2bf32] p-5">
      <h3 className="text-[35px] font-black uppercase leading-[0.9] text-black [font-family:var(--font-unbounded)]">
        Мерч,
        <br />
        который
        <br />
        вдохновляет
      </h3>

      <div className="relative mt-4 h-[320px]">
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
        className="absolute bottom-5 left-1/2 h-[66px] w-[calc(100%-40px)] max-w-[330px] -translate-x-1/2 rounded-[10px] bg-white px-5 text-[24px] font-medium text-black [font-family:var(--font-montserrat-alt)]"
      />
    </article>
  );
}
