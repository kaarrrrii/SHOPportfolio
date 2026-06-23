import Image from "next/image";
import HeroSideCards from "@/components/HeroSideCards";

export default function HeroBlock() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-5 sm:py-8 md:px-8 md:py-14">
        <div className="flex flex-col gap-6 sm:gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="w-full max-w-[320px] sm:max-w-[360px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-[5px] bg-[#f04a9d] px-3 py-[6px] sm:mb-6 sm:px-4 sm:py-[7px]">
              <Image
                src="/elements__ovals.png"
                alt=""
                width={14}
                height={14}
                unoptimized
                className="size-[11px] shrink-0 object-contain brightness-0 invert sm:size-[14px]"
                aria-hidden="true"
              />
              <span className="text-[12px] font-semibold uppercase tracking-normal text-white [font-family:var(--font-montserrat-alt)] sm:text-[15px] sm:tracking-[0.08em]">
                Студенческий проект
              </span>
            </div>

            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute left-[-64px] top-2 hidden size-[60px] shrink-0 bg-[#52cadf] [mask:url('/elements__crosses.png')_center/contain_no-repeat] [-webkit-mask:url('/elements__crosses.png')_center/contain_no-repeat] sm:block"
              />

              <h1 className="mb-3 text-[34px] font-black uppercase leading-[0.98] tracking-normal text-black [font-family:var(--font-unbounded)] sm:mb-5 sm:text-[46px] sm:leading-[0.94] md:text-[58px]">
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
              <p className="mb-2 max-w-[300px] text-[16px] leading-[1.35] text-[#5c5c5c] [font-family:var(--font-montserrat-alt)] sm:mb-6 sm:max-w-[290px] sm:text-[20px] sm:leading-[1.4]">
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
