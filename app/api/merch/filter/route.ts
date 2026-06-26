import type { Product, ProductCategory, ProductSizeStock } from "@/shared/data/mock";
import { products as defaultProducts } from "@/shared/data/mock";

type CatalogCategory = {
  value: ProductCategory;
  label: string;
};

type CatalogFilter = ProductCategory | "all";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function normalizeNumber(value: unknown, fallback: number) {
  const number = Math.round(Number(value));

  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function normalizeSizes(value: unknown): ProductSizeStock[] {
  if (!Array.isArray(value)) {
    return [{ size: "One size", stock: 0 }];
  }

  const sizes = value.flatMap((rawSize): ProductSizeStock[] => {
    if (!isRecord(rawSize)) {
      return [];
    }

    const size = normalizeText(rawSize.size, "");

    return size
      ? [{
          size,
          stock: normalizeNumber(rawSize.stock, 0),
        }]
      : [];
  });

  return sizes.length > 0 ? sizes : [{ size: "One size", stock: 0 }];
}

function normalizeProducts(value: unknown): Product[] {
  if (!Array.isArray(value)) {
    return defaultProducts;
  }

  const products = value.flatMap((rawProduct): Product[] => {
    if (!isRecord(rawProduct)) {
      return [];
    }

    const slug = normalizeText(rawProduct.slug, "");
    const title = normalizeText(rawProduct.title, "");
    const category = normalizeText(rawProduct.category, "");

    if (!slug || !title || !category) {
      return [];
    }

    return [{
      slug,
      title,
      category,
      categoryLabel: normalizeText(rawProduct.categoryLabel, "Категория"),
      description: normalizeText(rawProduct.description, "Мерч проекта Зажигай."),
      price: normalizeNumber(rawProduct.price, 0),
      imageSrc: normalizeText(rawProduct.imageSrc, "/худи.png"),
      sizes: normalizeSizes(rawProduct.sizes),
    }];
  });

  return products.length > 0 ? products : defaultProducts;
}

function defaultCategoriesFromProducts(products: Product[]): CatalogCategory[] {
  const categories = new Map<ProductCategory, string>();

  for (const product of products) {
    if (!categories.has(product.category)) {
      categories.set(product.category, product.categoryLabel);
    }
  }

  return Array.from(categories, ([value, label]) => ({ value, label }));
}

function normalizeCategories(value: unknown, products: Product[]): CatalogCategory[] {
  if (!Array.isArray(value)) {
    return defaultCategoriesFromProducts(products);
  }

  const usedValues = new Set<string>();
  const categories = value.flatMap((rawCategory): CatalogCategory[] => {
    if (!isRecord(rawCategory)) {
      return [];
    }

    const value = normalizeText(rawCategory.value, "");
    const label = normalizeText(rawCategory.label, "");

    if (!value || !label || usedValues.has(value)) {
      return [];
    }

    usedValues.add(value);

    return [{ value, label }];
  });

  return categories.length > 0 ? categories : defaultCategoriesFromProducts(products);
}

function resolveCategory(value: unknown, categories: CatalogCategory[]): CatalogFilter {
  if (value === "all") {
    return "all";
  }

  return typeof value === "string" && categories.some((category) => category.value === value)
    ? value
    : "all";
}

function createCatalogResponse(products: Product[], categories: CatalogCategory[], category: CatalogFilter) {
  const filteredProducts = category === "all"
    ? products
    : products.filter((product) => product.category === category);
  const counts = Object.fromEntries(
    categories.map((categoryItem) => [
      categoryItem.value,
      products.filter((product) => product.category === categoryItem.value).length,
    ]),
  );

  return {
    products: filteredProducts,
    counts,
    totalCount: products.length,
    selectedCategory: category,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const products = defaultProducts;
  const categories = defaultCategoriesFromProducts(products);
  const category = resolveCategory(url.searchParams.get("category"), categories);

  return Response.json(createCatalogResponse(products, categories, category));
}

export async function POST(request: Request) {
  let body: unknown = null;

  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const products = normalizeProducts(isRecord(body) ? body.products : null);
  const categories = normalizeCategories(isRecord(body) ? body.categories : null, products);
  const category = resolveCategory(isRecord(body) ? body.category : null, categories);

  return Response.json(createCatalogResponse(products, categories, category));
}
