import ActionButton from "@/components/ActionButton";
import MerchProductCard from "@/widgets/MerchProductCard";

const merchItems = [
  {
    title: "Худи «Искра»",
    description: "Тёплое худи оверсайз с ярким принтом на спине.",
    price: "3 500",
    imageSrc: "/merch__hero.png",
    imageAlt: "Чёрное худи Зажигаем",
    imageClassName: "",
  },
  {
    title: "Футболка «Зажигаем»",
    description: "Базовая футболка из плотного хлопка с фирменным принтом.",
    price: "2 900",
    imageSrc: "/merch__hero.png",
    imageAlt: "Белая футболка Зажигаем",
    imageClassName: "scale-[0.9] brightness-[1.3] saturate-0 contrast-75",
  },
  {
    title: "Панама «Движ»",
    description: "Стильная панама для активных дней и ярких событий.",
    price: "1 900",
    imageSrc: "/merch__hero.png",
    imageAlt: "Чёрная панама Зажигаем",
    imageClassName: "scale-[0.82] contrast-125 brightness-75",
  },
];

export default function MerchSection() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-8 md:py-16">
        <div className="mb-6">
          <h2 className="text-[52px] font-black uppercase leading-[0.9] text-[#161616] [font-family:var(--font-unbounded)]">
            Мерч
          </h2>
          <span className="mt-3 block h-[4px] w-full max-w-[120px] rounded-full bg-[#B8CB2F]" />
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {merchItems.map((item) => (
            <MerchProductCard
              key={item.title}
              title={item.title}
              description={item.description}
              price={item.price}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
              imageClassName={item.imageClassName}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <ActionButton
            href="/merch"
            label="Весь каталог"
            className="h-[64px] w-full max-w-[420px] rounded-[10px] bg-[#1f2b00] px-8 text-[28px] font-medium text-white shadow-[0_10px_20px_rgba(31,43,0,0.28)] [font-family:var(--font-unbounded)]"
          />
        </div>
      </div>
    </section>
  );
}
