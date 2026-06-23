"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FIXED_PICKUP_INFO, type Product } from "@/shared/data/mock";
import { formatCoinsLabel } from "@/shared/lib/format";
import { getProductSizeNames, getProductSizeStock, getProductTotalStock, useMerchProducts } from "@/shared/lib/merch";
import { useShopCart } from "@/shared/lib/shop";
import MerchProductCard from "@/widgets/MerchProductCard";

type ProductProfileWidgetProps = {
  productSlug: string;
  initialProduct?: Product | null;
  catalogHref?: string;
  productHrefBase?: string;
};

export default function ProductProfileWidget({
  productSlug,
  initialProduct,
  catalogHref = "/merch",
  productHrefBase = "/merch",
}: ProductProfileWidgetProps) {
  const router = useRouter();
  const { addItem } = useShopCart();
  const { products } = useMerchProducts();
  const product = products.find((item) => item.slug === productSlug) || null;
  const [selectedSize, setSelectedSize] = useState(initialProduct?.sizes[0]?.size || "One size");
  const [addedLabel, setAddedLabel] = useState("");

  if (!product) {
    return <MissingProduct catalogHref={catalogHref} />;
  }

  const productSizeNames = getProductSizeNames(product);
  const fallbackSize = product.sizes.find((item) => item.stock > 0)?.size || productSizeNames[0] || "One size";
  const resolvedSelectedSize = productSizeNames.includes(selectedSize)
    ? selectedSize
    : fallbackSize;
  const selectedSizeStock = getProductSizeStock(product, resolvedSelectedSize);
  const relatedProducts = products
    .filter((item) => item.slug !== product.slug && item.category === product.category)
    .slice(0, 3);

  function handleAddToCart(openCart = false) {
    if (!product) {
      return;
    }

    addItem(product.slug, resolvedSelectedSize);
    setAddedLabel(resolvedSelectedSize);

    if (openCart) {
      router.push("/cart");
    }
  }

  return (
    <main className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
        <Link
          href={catalogHref}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-bold text-[#1f1f1f] shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition hover:text-[#22A7C7] [font-family:var(--font-montserrat-alt)]"
        >
          <span aria-hidden="true">←</span>
          Назад в каталог
        </Link>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1fr)] lg:items-start">
          <div className="relative overflow-hidden rounded-[22px] border border-[#ececec] bg-white p-6 shadow-[0_14px_36px_rgba(0,0,0,0.08)]">
            <div className="relative mx-auto aspect-square max-w-[560px]">
              <Image
                src={product.imageSrc}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-contain p-6"
                unoptimized
                priority
              />
            </div>
          </div>

          <article className="rounded-[22px] bg-white p-5 shadow-[0_10px_32px_rgba(0,0,0,0.08)] md:p-8">
            <p className="text-[15px] font-black uppercase text-[#E82E78] [font-family:var(--font-montserrat-alt)]">
              {product.categoryLabel}
            </p>
            <h1 className="mt-3 text-[40px] font-black uppercase leading-[0.95] text-[#111] [font-family:var(--font-unbounded)] md:text-[64px]">
              {product.title}
            </h1>
            <p className="mt-5 text-[18px] font-semibold leading-[1.45] text-[#4d4d4d] [font-family:var(--font-montserrat-alt)]">
              {product.description}
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <InfoTile label="Цена" value={formatCoinsLabel(product.price)} />
              <InfoTile label="Наличие" value={`${getProductTotalStock(product)} шт.`} />
              <InfoTile label="Выдача" value={FIXED_PICKUP_INFO} />
            </div>

            <div className="mt-7">
              <OptionBlock title="Размер">
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.size}
                      type="button"
                      onClick={() => setSelectedSize(size.size)}
                      disabled={size.stock <= 0}
                      className={`min-w-[92px] rounded-[9px] border px-4 py-3 text-left text-[14px] font-black transition [font-family:var(--font-montserrat-alt)] ${
                        resolvedSelectedSize === size.size
                          ? "border-transparent bg-[#335EC8] text-white"
                          : "border-[#dddddd] bg-[#f8f8f8] text-[#111] hover:-translate-y-0.5 hover:border-[#335EC8]"
                      }`}
                      aria-pressed={resolvedSelectedSize === size.size}
                    >
                      <span className="block">{size.size}</span>
                      <span className="mt-1 block text-[12px] font-bold opacity-75">{size.stock} шт.</span>
                    </button>
                  ))}
                </div>
              </OptionBlock>
            </div>

            {addedLabel ? (
              <div className="mt-7 rounded-[14px] border border-[#D6E779] bg-[#F7FBE8] px-4 py-3">
                <p className="text-[14px] font-bold text-[#333] [font-family:var(--font-montserrat-alt)]">
                  Добавлено в корзину. Размер: <span className="text-[#7A9411]">{addedLabel}</span>
                </p>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => handleAddToCart(false)}
                disabled={selectedSizeStock <= 0}
                className="inline-flex h-14 items-center justify-center rounded-[10px] bg-[#FF3E80] px-7 text-[16px] font-black text-white transition hover:bg-[#E82E78] disabled:cursor-not-allowed disabled:bg-[#d9d9d9] [font-family:var(--font-montserrat-alt)]"
              >
                Добавить в корзину
              </button>
              <button
                type="button"
                onClick={() => handleAddToCart(true)}
                disabled={selectedSizeStock <= 0}
                className="inline-flex h-14 items-center justify-center rounded-[10px] bg-[#335EC8] px-7 text-[16px] font-black text-white transition hover:bg-[#244CA8] disabled:cursor-not-allowed disabled:bg-[#d9d9d9] [font-family:var(--font-montserrat-alt)]"
              >
                Перейти к оформлению
              </button>
            </div>
          </article>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-[34px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">
              Похожие товары
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((item) => (
                <MerchProductCard
                  key={item.slug}
                  title={item.title}
                  description={item.description}
                  price={String(item.price)}
                  imageSrc={item.imageSrc}
                  href={`${productHrefBase}/${item.slug}`}
                  actionLabel="В корзину"
                  actionHref={`${productHrefBase}/${item.slug}`}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

type MissingProductProps = {
  catalogHref: string;
};

function MissingProduct({ catalogHref }: MissingProductProps) {
  return (
    <main className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-8 md:py-20">
        <section className="mx-auto max-w-[720px] rounded-[24px] bg-white p-8 text-center shadow-[0_12px_34px_rgba(0,0,0,0.08)] md:p-10">
          <p className="text-[15px] font-black uppercase text-[#1688A3] [font-family:var(--font-montserrat-alt)]">
            Мерч
          </p>
          <h1 className="mt-3 text-[34px] font-black uppercase leading-[1.05] text-[#111] [font-family:var(--font-unbounded)] md:text-[48px]">
            Товар не найден
          </h1>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] font-semibold leading-[1.45] text-[#555] [font-family:var(--font-montserrat-alt)]">
            Позиция могла быть удалена администратором или еще не загружена в локальный каталог.
          </p>
          <Link
            href={catalogHref}
            className="mt-6 inline-flex h-12 items-center justify-center rounded-[10px] bg-[#22A7C7] px-6 text-[15px] font-black text-white transition hover:bg-[#1688A3] [font-family:var(--font-montserrat-alt)]"
          >
            Вернуться в каталог
          </Link>
        </section>
      </div>
    </main>
  );
}

type InfoTileProps = {
  label: string;
  value: string;
};

function InfoTile({ label, value }: InfoTileProps) {
  return (
    <div className="rounded-[14px] bg-[#f6f6f6] p-4">
      <p className="text-[12px] font-black uppercase text-[#888] [font-family:var(--font-montserrat-alt)]">{label}</p>
      <p className="mt-2 text-[17px] font-black leading-[1.2] text-[#111] [font-family:var(--font-montserrat-alt)]">{value}</p>
    </div>
  );
}

type OptionBlockProps = {
  title: string;
  children: React.ReactNode;
};

function OptionBlock({ title, children }: OptionBlockProps) {
  return (
    <div>
      <h2 className="mb-3 text-[18px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">{title}</h2>
      {children}
    </div>
  );
}
