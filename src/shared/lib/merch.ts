"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Product, ProductCategory, ProductSizeStock } from "@/shared/data/mock";
import { products as defaultProducts } from "@/shared/data/mock";
import { migrateInlineMerchProductImages } from "@/shared/lib/merch-images";

export type ProductCategoryItem = {
  value: ProductCategory;
  label: string;
};

export const DEFAULT_PRODUCT_CATEGORIES: ProductCategoryItem[] = [
  { value: "hoodies", label: "Худи" },
  { value: "tshirts", label: "Футболки" },
  { value: "accessories", label: "Аксессуары" },
];

const PRODUCT_STORAGE_KEY = "zazhigay-merch-products";
const CATEGORY_STORAGE_KEY = "zazhigay-merch-categories";
const PRODUCT_EVENT_NAME = "zazhigay-merch-products-updated";
const CATEGORY_EVENT_NAME = "zazhigay-merch-categories-updated";
const DEFAULT_SIZES: ProductSizeStock[] = [
  { size: "S 42", stock: 0 },
  { size: "M 44", stock: 0 },
  { size: "L 46", stock: 0 },
];

let productSnapshotKey: string | null = null;
let productSnapshot: Product[] = defaultProducts;
let categorySnapshotKey: string | null = null;
let categorySnapshot: ProductCategoryItem[] = DEFAULT_PRODUCT_CATEGORIES;

export class MerchStorageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "MerchStorageError";
  }
}

export function isMerchStorageError(error: unknown) {
  return error instanceof MerchStorageError;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function safeParse(value: string | null): unknown {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function normalizeText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function normalizeNumber(value: unknown, fallback: number) {
  const number = Math.round(Number(value));

  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function normalizeCategory(value: unknown): ProductCategory {
  const categories = readMerchCategoriesSnapshot();

  return categories.some((category) => category.value === value)
    ? (value as ProductCategory)
    : categories[0]?.value || DEFAULT_PRODUCT_CATEGORIES[0].value;
}

function normalizeProductSizes(value: unknown, legacyStock: unknown): ProductSizeStock[] {
  if (!Array.isArray(value)) {
    return DEFAULT_SIZES;
  }

  const stringSizes = value
    .filter((rawSize): rawSize is string => typeof rawSize === "string")
    .map((rawSize) => rawSize.trim())
    .filter(Boolean);

  if (stringSizes.length === value.length && stringSizes.length > 0) {
    const totalStock = normalizeNumber(legacyStock, 0);
    const baseStock = Math.floor(totalStock / stringSizes.length);
    const remainder = totalStock % stringSizes.length;

    return stringSizes.map((size, index) => ({
      size,
      stock: baseStock + (index < remainder ? 1 : 0),
    }));
  }

  const sizes = value.flatMap((rawSize): ProductSizeStock[] => {
    if (typeof rawSize === "string") {
      const size = rawSize.trim();

      return size ? [{ size, stock: 0 }] : [];
    }

    if (!isRecord(rawSize)) {
      return [];
    }

    const size = normalizeText(rawSize.size, "");

    if (!size) {
      return [];
    }

    return [{
      size,
      stock: normalizeNumber(rawSize.stock, 0),
    }];
  });

  return sizes.length > 0 ? sizes : DEFAULT_SIZES;
}

export function getCategoryLabel(category: ProductCategory) {
  return readMerchCategoriesSnapshot().find((item) => item.value === category)?.label || "Категория";
}

function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function slugifyCategoryLabel(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9а-яё-]+/giu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeCategories(value: unknown): ProductCategoryItem[] {
  const source = Array.isArray(value) ? value : DEFAULT_PRODUCT_CATEGORIES;
  const usedValues = new Set<string>();
  const categories = source.flatMap((rawCategory): ProductCategoryItem[] => {
    if (!isRecord(rawCategory)) {
      return [];
    }

    const label = normalizeText(rawCategory.label, "");
    const requestedValue = normalizeText(rawCategory.value, slugifyCategoryLabel(label));

    if (!label || !requestedValue || usedValues.has(requestedValue)) {
      return [];
    }

    usedValues.add(requestedValue);

    return [{ value: requestedValue, label }];
  });

  return categories.length > 0 ? categories : DEFAULT_PRODUCT_CATEGORIES;
}

export function readMerchCategoriesSnapshot() {
  if (typeof window === "undefined") {
    return DEFAULT_PRODUCT_CATEGORIES;
  }

  const storedValue = window.localStorage.getItem(CATEGORY_STORAGE_KEY);
  const snapshotKey = storedValue ?? "__initial_categories__";

  if (snapshotKey === categorySnapshotKey) {
    return categorySnapshot;
  }

  categorySnapshot = storedValue === null
    ? DEFAULT_PRODUCT_CATEGORIES
    : normalizeCategories(safeParse(storedValue));
  categorySnapshotKey = snapshotKey;

  return categorySnapshot;
}

function writeMerchCategoriesSnapshot(nextCategories: ProductCategoryItem[]) {
  const normalizedCategories = normalizeCategories(nextCategories);
  const serializedCategories = JSON.stringify(normalizedCategories);

  try {
    window.localStorage.setItem(CATEGORY_STORAGE_KEY, serializedCategories);
  } catch (error) {
    throw new MerchStorageError(
      "Не удалось сохранить категории: данные слишком большие для хранилища браузера.",
      { cause: error },
    );
  }

  categorySnapshot = normalizedCategories;
  categorySnapshotKey = serializedCategories;
  window.dispatchEvent(new CustomEvent(CATEGORY_EVENT_NAME));
}

export function subscribeToMerchCategories(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === CATEGORY_STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CATEGORY_EVENT_NAME, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CATEGORY_EVENT_NAME, onStoreChange);
  };
}

function createCategoryValue(label: string, existingCategories: ProductCategoryItem[]) {
  const usedValues = new Set(existingCategories.map((category) => category.value));
  const baseValue = slugifyCategoryLabel(label) || `category-${Date.now().toString(36)}`;
  let value = baseValue;
  let index = 2;

  while (usedValues.has(value)) {
    value = `${baseValue}-${index}`;
    index += 1;
  }

  return value;
}

function reassignProductsFromCategory(categoryValue: ProductCategory, fallbackCategory: ProductCategoryItem) {
  const nextProducts = readMerchProductsSnapshot().map((product) =>
    product.category === categoryValue
      ? {
          ...product,
          category: fallbackCategory.value,
          categoryLabel: fallbackCategory.label,
        }
      : product,
  );

  writeMerchProductsSnapshot(nextProducts);
}

export function createMerchProductSlug(
  title: string,
  existingProducts: Product[],
  currentSlug?: string,
) {
  if (currentSlug) {
    return currentSlug;
  }

  const usedSlugs = new Set(existingProducts.map((product) => product.slug));
  const baseSlug = slugifyTitle(title) || `item-${Date.now().toString(36)}`;
  let slug = baseSlug;
  let index = 2;

  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${index}`;
    index += 1;
  }

  return slug;
}

function normalizeProduct(rawProduct: unknown, index: number, usedSlugs: Set<string>): Product | null {
  if (!isRecord(rawProduct)) {
    return null;
  }

  const title = normalizeText(rawProduct.title, `Товар ${index + 1}`);
  const requestedSlug = normalizeText(rawProduct.slug, slugifyTitle(title) || `item-${index + 1}`);
  let slug = requestedSlug;
  let duplicateIndex = 2;

  while (usedSlugs.has(slug)) {
    slug = `${requestedSlug}-${duplicateIndex}`;
    duplicateIndex += 1;
  }

  usedSlugs.add(slug);

  const category = normalizeCategory(rawProduct.category);
  const description = normalizeText(rawProduct.description, "Мерч проекта Зажигай.");

  return {
    slug,
    title,
    category,
    categoryLabel: getCategoryLabel(category),
    description,
    price: normalizeNumber(rawProduct.price, 0),
    imageSrc: normalizeText(rawProduct.imageSrc, "/merch__hero.png"),
    sizes: normalizeProductSizes(rawProduct.sizes, rawProduct.stock),
  };
}

function normalizeProducts(value: unknown): Product[] {
  const source = Array.isArray(value) ? value : defaultProducts;
  const usedSlugs = new Set<string>();

  return source.flatMap((rawProduct, index) => {
    const product = normalizeProduct(rawProduct, index, usedSlugs);

    return product ? [product] : [];
  });
}

export function readMerchProductsSnapshot() {
  if (typeof window === "undefined") {
    return defaultProducts;
  }

  const storedValue = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
  const snapshotKey = storedValue ?? "__initial_products__";

  if (snapshotKey === productSnapshotKey) {
    return productSnapshot;
  }

  productSnapshot = storedValue === null ? defaultProducts : normalizeProducts(safeParse(storedValue));
  productSnapshotKey = snapshotKey;

  return productSnapshot;
}

function writeMerchProductsSnapshot(nextProducts: Product[]) {
  const normalizedProducts = normalizeProducts(nextProducts);
  const serializedProducts = JSON.stringify(normalizedProducts);

  try {
    window.localStorage.setItem(PRODUCT_STORAGE_KEY, serializedProducts);
  } catch (error) {
    throw new MerchStorageError(
      "Не удалось сохранить каталог: данные слишком большие для хранилища браузера.",
      { cause: error },
    );
  }

  productSnapshot = normalizedProducts;
  productSnapshotKey = serializedProducts;
  window.dispatchEvent(new CustomEvent(PRODUCT_EVENT_NAME));
}

export function subscribeToMerchProducts(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === PRODUCT_STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(PRODUCT_EVENT_NAME, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(PRODUCT_EVENT_NAME, onStoreChange);
  };
}

export function getMerchProductFromSnapshot(productSlug: string) {
  return readMerchProductsSnapshot().find((product) => product.slug === productSlug);
}

export function getProductSizeNames(product: Product) {
  return product.sizes.map((item) => item.size);
}

export function getProductTotalStock(product: Product) {
  return product.sizes.reduce((sum, item) => sum + item.stock, 0);
}

export function getProductSizeStock(product: Product, size: string) {
  return product.sizes.find((item) => item.size === size)?.stock || 0;
}

export function useMerchProducts() {
  const products = useSyncExternalStore(
    subscribeToMerchProducts,
    readMerchProductsSnapshot,
    () => defaultProducts,
  );

  const saveProduct = useCallback(async (nextProduct: Product) => {
    const currentProducts = readMerchProductsSnapshot();
    const existingProduct = currentProducts.some((product) => product.slug === nextProduct.slug);
    const nextProducts = existingProduct
      ? currentProducts.map((product) => (product.slug === nextProduct.slug ? nextProduct : product))
      : [nextProduct, ...currentProducts];

    try {
      writeMerchProductsSnapshot(await migrateInlineMerchProductImages(nextProducts));
    } catch (error) {
      if (isMerchStorageError(error)) {
        throw error;
      }

      throw new MerchStorageError(
        "Не удалось сохранить каталог: изображение не удалось перенести в хранилище браузера.",
        { cause: error },
      );
    }
  }, []);

  const removeProduct = useCallback((productSlug: string) => {
    writeMerchProductsSnapshot(readMerchProductsSnapshot().filter((product) => product.slug !== productSlug));
  }, []);

  const resetProducts = useCallback(() => {
    writeMerchProductsSnapshot(defaultProducts);
  }, []);

  return {
    products,
    saveProduct,
    removeProduct,
    resetProducts,
  };
}

export function useMerchCategories() {
  const categories = useSyncExternalStore(
    subscribeToMerchCategories,
    readMerchCategoriesSnapshot,
    () => DEFAULT_PRODUCT_CATEGORIES,
  );

  const addCategory = useCallback((label: string) => {
    const normalizedLabel = label.trim();
    const currentCategories = readMerchCategoriesSnapshot();
    const existingCategory = currentCategories.find(
      (category) => category.label.toLowerCase() === normalizedLabel.toLowerCase(),
    );

    if (existingCategory) {
      return existingCategory;
    }

    const nextCategory = {
      value: createCategoryValue(normalizedLabel, currentCategories),
      label: normalizedLabel,
    };

    writeMerchCategoriesSnapshot([...currentCategories, nextCategory]);

    return nextCategory;
  }, []);

  const removeCategory = useCallback((categoryValue: ProductCategory) => {
    const currentCategories = readMerchCategoriesSnapshot();

    if (currentCategories.length <= 1) {
      return false;
    }

    const nextCategories = currentCategories.filter((category) => category.value !== categoryValue);
    const fallbackCategory = nextCategories[0];

    if (!fallbackCategory || nextCategories.length === currentCategories.length) {
      return false;
    }

    writeMerchCategoriesSnapshot(nextCategories);
    reassignProductsFromCategory(categoryValue, fallbackCategory);

    return true;
  }, []);

  const resetCategories = useCallback(() => {
    writeMerchCategoriesSnapshot(DEFAULT_PRODUCT_CATEGORIES);
  }, []);

  return {
    categories,
    addCategory,
    removeCategory,
    resetCategories,
  };
}
