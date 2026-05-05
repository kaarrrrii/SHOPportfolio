import Image from "next/image";
import ActionButton from "@/components/ActionButton";
import OverlayRibbon from "@/widgets/OverlayRibbon";

export default function AboutProjectSection() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] px-5 pb-14 md:px-8 md:pb-20">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between">
          <article className="w-full max-w-[360px]">
            <div className="relative mb-6">
              <span
                aria-hidden="true"
                className="absolute left-[-64px] top-2 block size-[58px] bg-[#52cadf] opacity-95 [mask:url('/pattern__square_square.png')_center/contain_no-repeat] [-webkit-mask:url('/pattern__square_square.png')_center/contain_no-repeat]"
              />
              <h2 className="whitespace-nowrap text-[50px] font-black uppercase leading-[0.92] tracking-[-0.03em] text-black sm:text-[58px] [font-family:var(--font-unbounded)]">
                О проекте
              </h2>
              <span
                className="mt-3 block h-[4px] w-full max-w-[300px] rounded-full bg-[#52cadf]"
                aria-hidden="true"
              />
            </div>

            <div className="space-y-3 text-[20px] leading-[1.4] text-[#5c5c5c] [font-family:var(--font-montserrat-alt)]">
              <p>
                «Зажигаем» — студенческий проект, который объединяет активных
                ребят, помогает развивать инициативы и создавать события.
              </p>
              <p>
                Мы поддерживаем тех, кто хочет делать мир вокруг лучше, а
                участники получают монетки за инициативы.
              </p>
              <p>Делай добро и получай за это стильные бонусы!</p>
            </div>
          </article>

          <aside className="w-full xl:max-w-[840px]">
            <article className="relative h-[340px] overflow-hidden rounded-[18px] bg-[#cfcfcf] sm:h-[420px] xl:h-[520px]">
              <Image
                src="/students__hero.jpeg"
                alt="Участники сообщества Зажигаем на мероприятии"
                fill
                sizes="(max-width: 1280px) 100vw, 840px"
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.5),rgba(0,0,0,0.08)_48%,transparent_76%)]" />

              <OverlayRibbon
                text="Сообщество, которое меняет университет"
                icon={
                  <Image
                    src="/pattern__square_rhombuses.png"
                    alt=""
                    width={56}
                    height={56}
                    unoptimized
                    className="size-[56px] shrink-0 object-contain opacity-95"
                    aria-hidden="true"
                  />
                }
                className="absolute bottom-4 left-4 max-w-[calc(100%-32px)] bg-[#335ec8] sm:bottom-6 sm:left-6 sm:max-w-[560px]"
                textClassName="text-[18px] leading-[1] sm:text-[27px]"
              />
            </article>
          </aside>
        </div>
      </div>
    </section>
  );
}
