"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MerchImage from "@/components/MerchImage";
import { FIXED_PICKUP_INFO, type Product } from "@/shared/data/mock";
import { formatCoinsLabel } from "@/shared/lib/format";
import { getProductSizeNames, getProductSizeStock, getProductTotalStock, useMerchProducts } from "@/shared/lib/merch";
import { useOrderHistory, useShopCart } from "@/shared/lib/shop";
import MerchProductCard from "@/widgets/MerchProductCard";

type ProductProfileWidgetProps = {
  productSlug: string;
  initialProduct?: Product | null;
  catalogHref?: string;
  productHrefBase?: string;
  fakeActions?: boolean;
};

export default function ProductProfileWidget({
  productSlug,
  initialProduct,
  catalogHref = "/merch",
  productHrefBase = "/merch",
  fakeActions = false,
}: ProductProfileWidgetProps) {
  const router = useRouter();
  const { addItem } = useShopCart();
  const { orders } = useOrderHistory();
  const { products } = useMerchProducts();
  const product = products.find((item) => item.slug === productSlug) || null;
  const hasOrderedProduct = orders.some((order) =>
    order.items.some((item) => item.productSlug === productSlug),
  );
  const [selectedSize, setSelectedSize] = useState(initialProduct?.sizes[0]?.size || "One size");
  const [addedLabel, setAddedLabel] = useState("");
  const [actionNotice, setActionNotice] = useState("");

  if (!product) {
    if (hasOrderedProduct && !fakeActions) {
      return <UnavailableOrderedProduct catalogHref={catalogHref} productSlug={productSlug} />;
    }

    return <MissingProduct catalogHref={catalogHref} />;
  }

  const productSizeNames = getProductSizeNames(product);
  const fallbackSize = product.sizes.find((item) => item.stock > 0)?.size || productSizeNames[0] || "One size";
  const resolvedSelectedSize = productSizeNames.includes(selectedSize)
    ? selectedSize
    : fallbackSize;
  const selectedSizeStock = getProductSizeStock(product, resolvedSelectedSize);
  const relatedProducts = [
    ...products.filter((item) => item.slug !== product.slug && item.category === product.category),
    ...products.filter((item) => item.slug !== product.slug && item.category !== product.category),
  ]
    .slice(0, 3);

  function handleAddToCart(openCart = false) {
    if (!product) {
      return;
    }

    if (fakeActions) {
      setAddedLabel("");
      setActionNotice(
        openCart
          ? "Переход к оформлению отключен в админской витрине."
          : "Добавление в корзину отключено в админской витрине.",
      );
      return;
    }

    addItem(product.slug, resolvedSelectedSize);
    setAddedLabel(resolvedSelectedSize);
    setActionNotice("");

    if (openCart) {
      router.push("/cart");
    }
  }

  return (
    <main className={`relative overflow-hidden bg-white ${fakeActions ? "admin-page" : ""}`}>
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
              <MerchImage
                src={product.imageSrc}
                alt=""
                fill
                className="object-contain p-6"
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
                          ? "border-transparent bg-[#F2C94C] text-[#111]"
                          : "border-[#dddddd] bg-[#f8f8f8] text-[#111] hover:-translate-y-0.5 hover:border-[#F2C94C]"
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

            {actionNotice ? (
              <div className="mt-7 rounded-[14px] border border-[#F4D98B] bg-[#FFF8DE] px-4 py-3">
                <p className="text-[14px] font-bold text-[#8A5A00] [font-family:var(--font-montserrat-alt)]">
                  {actionNotice}
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
                className="inline-flex h-14 items-center justify-center rounded-[10px] bg-[#F2C94C] px-7 text-[16px] font-black text-[#111] transition hover:bg-[#E4B938] disabled:cursor-not-allowed disabled:bg-[#d9d9d9] [font-family:var(--font-montserrat-alt)]"
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
              {relatedProducts.map((item, index) => (
                <MerchProductCard
                  key={item.slug}
                  title={item.title}
                  description={item.description}
                  price={String(item.price)}
                  imageSrc={item.imageSrc}
                  href={`${productHrefBase}/${item.slug}`}
                  actionLabel={fakeActions ? "Открыть" : "В корзину"}
                  actionHref={`${productHrefBase}/${item.slug}`}
                  accentIndex={index + 1}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

type UnavailableOrderedProductProps = {
  catalogHref: string;
  productSlug: string;
};

function UnavailableOrderedProduct({ catalogHref, productSlug }: UnavailableOrderedProductProps) {
  return (
    <main className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-8 md:py-20">
        <section className="mx-auto max-w-[780px] rounded-[24px] bg-white p-8 text-center shadow-[0_12px_34px_rgba(0,0,0,0.08)] md:p-10">
          <p className="text-[15px] font-black uppercase text-[#E82E78] [font-family:var(--font-montserrat-alt)]">
            Архивный мерч
          </p>
          <h1 className="mt-3 text-[34px] font-black uppercase leading-[1.05] text-[#111] [font-family:var(--font-unbounded)] md:text-[48px]">
            Товар больше недоступен
          </h1>
          <p className="mx-auto mt-4 max-w-[560px] text-[16px] font-semibold leading-[1.45] text-[#555] [font-family:var(--font-montserrat-alt)]">
            Эта позиция осталась в истории заказа, но сейчас удалена из каталога или снята с выдачи.
            Добавить ее в корзину уже нельзя.
          </p>
          <div className="mx-auto mt-6 max-w-[420px] rounded-[16px] bg-[#FFF0F6] px-4 py-3 text-[13px] font-black text-[#E82E78] [font-family:var(--font-montserrat-alt)]">
            Артикул: {productSlug}
          </div>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/orders"
              className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#FF3E80] px-6 text-[15px] font-black text-white transition hover:bg-[#E82E78] [font-family:var(--font-montserrat-alt)]"
            >
              Вернуться к заказам
            </Link>
            <Link
              href={catalogHref}
              className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#d8d8d8] bg-white px-6 text-[15px] font-black text-[#111] transition hover:border-[#22A7C7] hover:text-[#1688A3] [font-family:var(--font-montserrat-alt)]"
            >
              Открыть каталог
            </Link>
          </div>
        </section>
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
