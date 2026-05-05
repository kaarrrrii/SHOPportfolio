import Header from "@/components/Header";
import MerchHero from "@/components/MerchHero";
import MerchFilters from "@/components/MerchFilters";
import MerchProductCard from "@/widgets/MerchProductCard";

const merchItems = [
  {
    title: "Худи «Искра»",
    description: "Тёплое худи оверсайз с ярким принтом на спине.",
    price: "3 500",
    imageSrc: "/merch__hero.png",
    imageAlt: "Чёрное худи Зажигаем",
    buttonColor: "pink" as const,
  },
  {
    title: "Футболка «Зажигаем»",
    description: "Базовая футболка из плотного хлопка с фирменным принтом.",
    price: "2 900",
    imageSrc: "/merch__hero.png",
    imageAlt: "Белая футболка Зажигаем",
    imageClassName: "scale-[0.9] brightness-[1.3] saturate-0 contrast-75",
    buttonColor: "blue" as const,
  },
  {
    title: "Панама «Движ»",
    description: "Стильная панама для активных дней и ярких событий.",
    price: "1 900",
    imageSrc: "/merch__hero.png",
    imageAlt: "Чёрная панама Зажигаем",
    imageClassName: "scale-[0.82] contrast-125 brightness-75",
    buttonColor: "green" as const,
  },
  {
    title: "Толстовка «Огонь»",
    description: "Удобная толстовка с капюшоном для повседневной носки.",
    price: "3 200",
    imageSrc: "/merch__hero.png",
    imageAlt: "Серая толстовка Зажигаем",
    imageClassName: "scale-[0.85] contrast-90 brightness-90",
    buttonColor: "orange" as const,
  },
  {
    title: "Кепка «Вспышка»",
    description: "Классическая кепка с вышитым логотипом.",
    price: "1 500",
    imageSrc: "/merch__hero.png",
    imageAlt: "Чёрная кепка Зажигаем",
    imageClassName: "scale-[0.75] contrast-110 brightness-85",
    buttonColor: "pink" as const,
  },
  {
    title: "Лонгслив «Импульс»",
    description: "Удлиненная футболка с длинным рукавом.",
    price: "2 400",
    imageSrc: "/merch__hero.png",
    imageAlt: "Белый лонгслив Зажигаем",
    imageClassName: "scale-[0.88] brightness-[1.2] contrast-80",
    buttonColor: "blue" as const,
  },
];

export default function MerchPage() {
  return (
    <>
      <Header />
      <MerchHero />
      
      <main className="w-full bg-[#F5F5F5]">
        <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 md:py-16">
          <MerchFilters />
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {merchItems.map((item) => (
              <MerchProductCard
                key={item.title}
                title={item.title}
                description={item.description}
                price={item.price}
                imageSrc={item.imageSrc}
                imageAlt={item.imageAlt}
                imageClassName={item.imageClassName}
                buttonColor={item.buttonColor}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
