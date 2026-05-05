import Image from "next/image";
import HeroSideCards from "@/components/HeroSideCards";

export default function HeroBlock() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between">
          <div className="w-full max-w-[360px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-[5px] bg-[#f04a9d] px-4 py-[7px]">
              <Image
                src="/elements__ovals.png"
                alt=""
                width={14}
                height={14}
                unoptimized
                className="size-[14px] shrink-0 object-contain brightness-0 invert"
                aria-hidden="true"
              />
              <span className="text-[15px] font-semibold uppercase tracking-[0.08em] text-white [font-family:var(--font-montserrat-alt)]">
                Студенческий проект
              </span>
            </div>

            <div className="relative">
              <Image
                src="/elements__crosses.png"
                alt=""
                width={60}
                height={60}
                unoptimized
                className="absolute left-[-64px] top-2 shrink-0 object-contain"
                aria-hidden="true"
              />

              <h1 className="mb-5 text-[58px] font-black uppercase leading-[0.92] tracking-[-0.03em] text-black [font-family:var(--font-unbounded)]">
                Зажигаем
                <br />
                студентов,
                <br />
                идеи и
                <br />
                события
              </h1>
							<span
                className="mb-3 block h-[4px] w-full max-w-[300px] rounded-full bg-[#f04a9d]"
                aria-hidden="true"
              />
              <p className="mb-6 max-w-[290px] text-[20px] leading-[1.4] text-[#5c5c5c] [font-family:var(--font-montserrat-alt)]">
                Объединяем активных ребят, проводим мероприятия, запускаем инициативы и
                делаем добрые дела вместе.
              </p>
            </div>
          </div>

          <HeroSideCards />
        </div>
      </div>
    </section>
  );
}
