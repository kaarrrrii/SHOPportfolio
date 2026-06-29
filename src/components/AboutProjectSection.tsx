import Image from "next/image";
import OverlayRibbon from "@/widgets/OverlayRibbon";

export default function AboutProjectSection() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] px-4 pb-8 sm:px-5 sm:pb-12 md:px-8 md:pb-20">
        <div className="flex flex-col gap-6 sm:gap-8 xl:flex-row xl:items-start xl:justify-between">
          <article className="w-full max-w-[320px] sm:max-w-[360px]">
            <div className="relative mb-4 sm:mb-6">
              <span
                aria-hidden="true"
                className="absolute left-[-64px] top-2 hidden size-[58px] bg-[#22A7C7] opacity-95 [mask:url('/elements__pros.png')_center/contain_no-repeat] [-webkit-mask:url('/elements__pros.png')_center/contain_no-repeat] sm:block"
              />
              <h2 className="whitespace-nowrap text-[32px] font-black uppercase leading-[1] tracking-normal text-black sm:text-[46px] md:text-[58px] [font-family:var(--font-unbounded)]">
                О проекте
              </h2>
              <span
                className="mt-2 block h-[3px] w-full max-w-[180px] rounded-full bg-[#52cadf] sm:mt-3 sm:h-[4px] sm:max-w-[300px]"
                aria-hidden="true"
              />
            </div>

            <div className="space-y-2 text-[15px] leading-[1.35] text-[#5c5c5c] [font-family:var(--font-montserrat-alt)] sm:space-y-3 sm:text-[18px] sm:leading-[1.4] md:text-[20px]">
              <p>
                «Зажигаем» — студенческий проект, который объединяет активных
                ребят, помогает развивать инициативы и создавать события.
              </p>
              <p>
                Мы поддерживаем тех, кто хочет делать мир вокруг лучше, а
                участники получают баллы за инициативы.
              </p>
              <p>Делай добро и получай за это стильные бонусы!</p>
            </div>
          </article>

          <aside className="w-full xl:max-w-[840px]">
            <article className="relative h-[210px] overflow-hidden rounded-[12px] bg-[#cfcfcf] sm:h-[320px] sm:rounded-[18px] md:h-[420px] xl:h-[520px]">
              <Image
                src="/students__about__project.jpg"
                alt="Участники сообщества Зажигаем на мероприятии"
                fill
                sizes="(max-width: 1280px) 100vw, 840px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.5),rgba(0,0,0,0.08)_48%,transparent_76%)]" />

              <OverlayRibbon
                text="Сообщество, которое меняет университет"
                icon={
                  <span
                    aria-hidden="true"
                    className="about-community-ribbon__icon"
                  />
                }
                className="about-community-ribbon"
                textClassName="about-community-ribbon__text"
              />
            </article>
          </aside>
        </div>
      </div>
    </section>
  );
}
