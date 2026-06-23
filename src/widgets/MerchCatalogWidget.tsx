"use client";

import { useMemo, useState } from "react";
import type { ProductCategory } from "@/shared/data/mock";
import { formatCoins } from "@/shared/lib/format";
import {
  useMerchCategories,
  useMerchProducts,
  type ProductCategoryItem,
} from "@/shared/lib/merch";
import MerchProductCard from "@/widgets/MerchProductCard";

type CategoryFilter = ProductCategory | "all";

type MerchCatalogWidgetProps = {
  productHrefBase?: string;
};

export default function MerchCatalogWidget({ productHrefBase = "/merch" }: MerchCatalogWidgetProps) {
  const { products } = useMerchProducts();
  const { categories } = useMerchCategories();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const selectedCategory =
    activeCategory === "all" || categories.some((category) => category.value === activeCategory)
      ? activeCategory
      : "all";
  const filteredProducts = useMemo(
    () =>
      selectedCategory === "all"
        ? products
        : products.filter((product) => product.category === selectedCategory),
    [selectedCategory, products],
  );
  const categoryCounts = useMemo(
    () =>
      new Map<ProductCategory, number>(
        categories.map((category) => [
          category.value,
          products.filter((product) => product.category === category.value).length,
        ]),
      ),
    [categories, products],
  );

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 md:py-16">
        <div className="mb-8 flex justify-start">
          <CategoryFilters
            activeCategory={selectedCategory}
            totalCount={products.length}
            categories={categories}
            categoryCounts={categoryCounts}
            onChange={setActiveCategory}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <MerchProductCard
                key={product.slug}
                title={product.title}
                description={product.description}
                price={formatCoins(product.price)}
                imageSrc={product.imageSrc}
                href={`${productHrefBase}/${product.slug}`}
                actionHref={`${productHrefBase}/${product.slug}`}
                actionLabel="В корзину"
              />
            ))
          ) : (
            <div className="rounded-[18px] border border-dashed border-[#cfcfcf] bg-white p-8 text-center sm:col-span-2 lg:col-span-3">
              <p className="text-[26px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">
                {products.length > 0 ? "В категории пока пусто" : "Каталог пуст"}
              </p>
              <p className="mx-auto mt-3 max-w-[520px] text-[15px] font-semibold leading-[1.4] text-[#666] [font-family:var(--font-montserrat-alt)]">
                {products.length > 0
                  ? "Выберите другую категорию или добавьте товар в админке."
                  : "Администратор может добавить новые вещи на странице управления мерчем."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

type CategoryFiltersProps = {
  activeCategory: CategoryFilter;
  totalCount: number;
  categories: ProductCategoryItem[];
  categoryCounts: Map<ProductCategory, number>;
  onChange: (category: CategoryFilter) => void;
};

function CategoryFilters({
  activeCategory,
  totalCount,
  categories,
  categoryCounts,
  onChange,
}: CategoryFiltersProps) {
  const filters: Array<{ value: CategoryFilter; label: string; count: number }> = [
    { value: "all", label: "Все", count: totalCount },
    ...categories.map((category) => ({
      value: category.value,
      label: category.label,
      count: categoryCounts.get(category.value) || 0,
    })),
  ];
  const filterAccents = [
    {
      active: "bg-[#335EC8] text-white shadow-[0_8px_18px_rgba(51,94,200,0.22)]",
      inactive: "border border-[#AFC9EE] bg-white text-[#111] hover:border-[#335EC8] hover:text-[#335EC8]",
    },
    {
      active: "bg-[#8B3DFF] text-white shadow-[0_8px_18px_rgba(139,61,255,0.24)]",
      inactive: "border border-[#C7B8F1] bg-white text-[#111] hover:border-[#8B3DFF] hover:text-[#6F22E8]",
    },
    {
      active: "bg-[#9AC225] text-white shadow-[0_8px_18px_rgba(154,194,37,0.22)]",
      inactive: "border border-[#D6E779] bg-white text-[#111] hover:border-[#9AC225] hover:text-[#7A9411]",
    },
    {
      active: "bg-[#FF3E80] text-white shadow-[0_8px_18px_rgba(255,62,128,0.22)]",
      inactive: "border border-[#F7B7D4] bg-white text-[#111] hover:border-[#FF3E80] hover:text-[#E82E78]",
    },
    {
      active: "bg-[#22A7C7] text-white shadow-[0_8px_18px_rgba(34,167,199,0.22)]",
      inactive: "border border-[#9ADDEB] bg-white text-[#111] hover:border-[#22A7C7] hover:text-[#1688A3]",
    },
    {
      active: "bg-[#7B5BC8] text-white shadow-[0_8px_18px_rgba(123,91,200,0.22)]",
      inactive: "border border-[#C7B8F1] bg-white text-[#111] hover:border-[#7B5BC8] hover:text-[#6A4FAD]",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2" aria-label="Категории товаров">
      {filters.map((filter, index) => {
        const isActive = filter.value === activeCategory;
        const accent = filterAccents[index % filterAccents.length];

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-4 text-[14px] font-black transition [font-family:var(--font-montserrat-alt)] ${
              isActive ? accent.active : accent.inactive
            }`}
            aria-pressed={isActive}
          >
            <span>{filter.label}</span>
            <span className={isActive ? "text-white/80" : "text-[#777]"}>{filter.count}</span>
          </button>
        );
      })}
    </div>
  );
}
