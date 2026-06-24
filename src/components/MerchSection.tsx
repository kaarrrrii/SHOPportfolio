"use client";

import ActionButton from "@/components/ActionButton";
import { formatCoins } from "@/shared/lib/format";
import { useMerchProducts } from "@/shared/lib/merch";
import MerchProductCard from "@/widgets/MerchProductCard";

export default function MerchSection() {
  const { products } = useMerchProducts();
  const previewProducts = products.slice(0, 3);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-5 sm:py-12 md:px-8 md:py-16">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-[32px] font-black uppercase leading-[1] text-[#161616] [font-family:var(--font-unbounded)] sm:text-[44px] md:text-[52px]">
            Мерч
          </h2>
          <span className="mt-2 block h-[3px] w-full max-w-[90px] rounded-full bg-[#B8CB2F] sm:mt-3 sm:h-[4px] sm:max-w-[120px]" />
        </div>

        {previewProducts.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {previewProducts.map((product, index) => (
              <MerchProductCard
                key={product.slug}
                title={product.title}
                description={product.description}
                price={formatCoins(product.price)}
                imageSrc={product.imageSrc}
                href={`/merch/${product.slug}`}
                actionHref={`/merch/${product.slug}`}
                actionLabel="Выбрать"
                accentIndex={index}
              />
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex justify-center sm:mt-6">
          <ActionButton
            href="/merch"
            label="Весь каталог"
            className="h-[48px] w-full max-w-[340px] rounded-[10px] bg-[#111111] px-5 text-[16px] font-medium text-white shadow-[0_10px_20px_rgba(17,17,17,0.28)] transition hover:bg-[#303030] [font-family:var(--font-unbounded)] sm:h-[58px] sm:max-w-[420px] sm:px-8 sm:text-[22px] md:h-[64px] md:text-[26px]"
          />
        </div>
      </div>
    </section>
  );
}
