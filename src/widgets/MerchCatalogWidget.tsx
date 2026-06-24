"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Product, ProductCategory } from "@/shared/data/mock";
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

type CatalogFilterResponse = {
  products: Product[];
  counts: Record<string, number>;
  totalCount: number;
  selectedCategory: CategoryFilter;
};

export default function MerchCatalogWidget({ productHrefBase = "/merch" }: MerchCatalogWidgetProps) {
  const { products } = useMerchProducts();
  const { categories } = useMerchCategories();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [categoryCountValues, setCategoryCountValues] = useState<Record<string, number>>({});
  const [isFiltering, setIsFiltering] = useState(false);
  const selectedCategory =
    activeCategory === "all" || categories.some((category) => category.value === activeCategory)
      ? activeCategory
      : "all";
  const categoryCounts = useMemo(
    () =>
      new Map<ProductCategory, number>(
        categories.map((category) => [
          category.value,
          categoryCountValues[category.value] ?? 0,
        ]),
      ),
    [categories, categoryCountValues],
  );

  useEffect(() => {
    const controller = new AbortController();
    let isCurrentRequest = true;

    async function filterProducts() {
      setIsFiltering(true);

      try {
        const response = await fetch("/api/merch/filter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: selectedCategory,
            products,
            categories,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Catalog filter request failed");
        }

        const data = (await response.json()) as CatalogFilterResponse;

        if (!isCurrentRequest) {
          return;
        }

        setFilteredProducts(data.products);
        setCategoryCountValues(data.counts);
      } catch {
        if (!isCurrentRequest || controller.signal.aborted) {
          return;
        }

        setFilteredProducts(
          selectedCategory === "all"
            ? products
            : products.filter((product) => product.category === selectedCategory),
        );
        setCategoryCountValues(
          Object.fromEntries(
            categories.map((category) => [
              category.value,
              products.filter((product) => product.category === category.value).length,
            ]),
          ),
        );
      } finally {
        if (isCurrentRequest) {
          setIsFiltering(false);
        }
      }
    }

    filterProducts();

    return () => {
      isCurrentRequest = false;
      controller.abort();
    };
  }, [categories, products, selectedCategory]);

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
            isLoading={isFiltering}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <MerchProductCard
                key={product.slug}
                title={product.title}
                description={product.description}
                price={formatCoins(product.price)}
                imageSrc={product.imageSrc}
                href={`${productHrefBase}/${product.slug}`}
                actionHref={`${productHrefBase}/${product.slug}`}
                actionLabel="В корзину"
                accentIndex={index}
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
  isLoading: boolean;
};

function CategoryFilters({
  activeCategory,
  totalCount,
  categories,
  categoryCounts,
  onChange,
  isLoading,
}: CategoryFiltersProps) {
  const filters: Array<{ value: CategoryFilter; label: string; count: number }> = [
    { value: "all", label: "Все", count: totalCount },
    ...categories.map((category) => ({
      value: category.value,
      label: category.label,
      count: categoryCounts.get(category.value) || 0,
    })),
  ];
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeFilter = filters.find((filter) => filter.value === activeCategory) || filters[0];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  function handleChange(category: CategoryFilter) {
    onChange(category);
    setIsOpen(false);
  }

  return (
    <div ref={dropdownRef} className="relative w-full max-w-[380px] [font-family:var(--font-montserrat-alt)]">
      <p className="mb-2 text-[13px] font-black uppercase text-[#8A5A00]">
        Категория
      </p>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex h-14 w-full items-center justify-between gap-3 rounded-[14px] border border-[#F4D98B] bg-white px-4 text-left shadow-[0_8px_24px_rgba(242,201,76,0.10)] transition hover:border-[#F2C94C]"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-busy={isLoading}
      >
        <span className="min-w-0">
          <span className="block truncate text-[16px] font-black text-[#111]">
            {activeFilter.label}
          </span>
          <span className="mt-0.5 block text-[12px] font-bold text-[#777]">
            {isLoading ? "Обновляем каталог" : `${activeFilter.count} товаров`}
          </span>
        </span>
        <span className={`grid size-9 shrink-0 place-items-center rounded-[10px] bg-[#FFF8DE] text-[#8A5A00] transition ${isOpen ? "rotate-180" : ""}`} aria-hidden="true">
          <ChevronDownIcon />
        </span>
      </button>

      {isOpen ? (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-[14px] border border-[#F4D98B] bg-white p-2 shadow-[0_18px_42px_rgba(242,201,76,0.18)]"
        >
          {filters.map((filter) => {
            const isActive = filter.value === activeCategory;

            return (
              <button
                key={filter.value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => handleChange(filter.value)}
                className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2 text-left transition ${
                  isActive
                    ? "bg-[#F2C94C] text-[#111]"
                    : "text-[#111] hover:bg-[#FFF8DE] hover:text-[#8A5A00]"
                }`}
              >
                <span className="truncate text-[14px] font-black">
                  {filter.label}
                </span>
                <span className={`rounded-full px-2 py-1 text-[12px] font-black ${isActive ? "bg-white/20 text-white" : "bg-[#F7FBE8] text-[#7A9411]"}`}>
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M4.5 7L9 11.5L13.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
