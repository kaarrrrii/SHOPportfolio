import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Product, ProductCategory, ProductSizeStock } from "@/shared/data/mock";
import { products as defaultProducts } from "@/shared/data/mock";

export const runtime = "nodejs";

type ProductCategoryItem = {
  value: ProductCategory;
  label: string;
};

type MerchStore = {
  products: Product[];
  categories: ProductCategoryItem[];
};

const STORE_DIR = path.join(process.cwd(), "public", "uploads", "merch");
const STORE_PATH = path.join(STORE_DIR, "catalog.json");
const DEFAULT_CATEGORIES: ProductCategoryItem[] = [
  { value: "hoodies", label: "Худи" },
  { value: "tshirts", label: "Футболки" },
  { value: "accessories", label: "Аксессуары" },
];
const DEFAULT_SIZES: ProductSizeStock[] = [
  { size: "S 42", stock: 0 },
  { size: "M 44", stock: 0 },
  { size: "L 46", stock: 0 },
];

export async function GET() {
  return Response.json(await readMerchStore());
}

export async function PUT(request: Request) {
  let body: unknown = null;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const store = normalizeStore(body);

  await mkdir(STORE_DIR, { recursive: true });
  await writeFile(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf8");

  return Response.json(store);
}

async function readMerchStore(): Promise<MerchStore> {
  try {
    const content = await readFile(STORE_PATH, "utf8");

    return normalizeStore(JSON.parse(content));
  } catch {
    return {
      products: defaultProducts,
      categories: DEFAULT_CATEGORIES,
    };
  }
}

function normalizeStore(value: unknown): MerchStore {
  const categories = normalizeCategories(isRecord(value) ? value.categories : null);
  const products = normalizeProducts(isRecord(value) ? value.products : null, categories);

  return {
    products,
    categories,
  };
}

function normalizeCategories(value: unknown): ProductCategoryItem[] {
  const source = Array.isArray(value) ? value : DEFAULT_CATEGORIES;
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

  return categories.length > 0 ? categories : DEFAULT_CATEGORIES;
}

function normalizeProducts(value: unknown, categories: ProductCategoryItem[]): Product[] {
  const source = Array.isArray(value) ? value : defaultProducts;
  const usedSlugs = new Set<string>();
  const products = source.flatMap((rawProduct, index): Product[] => {
    if (!isRecord(rawProduct)) {
      return [];
    }

    const title = normalizeText(rawProduct.title, `Товар ${index + 1}`);
    const requestedSlug = normalizeText(rawProduct.slug, slugifyTitle(title) || `item-${index + 1}`);
    const slug = getUniqueValue(requestedSlug, usedSlugs);
    const category = normalizeCategory(rawProduct.category, categories);

    return [{
      slug,
      title,
      category,
      categoryLabel: categories.find((item) => item.value === category)?.label || "Категория",
      description: normalizeText(rawProduct.description, "Мерч проекта Зажигай."),
      price: normalizeNumber(rawProduct.price, 0),
      imageSrc: normalizeText(rawProduct.imageSrc, "/худи.png"),
      sizes: normalizeProductSizes(rawProduct.sizes),
    }];
  });

  return products.length > 0 ? products : defaultProducts;
}

function normalizeProductSizes(value: unknown): ProductSizeStock[] {
  if (!Array.isArray(value)) {
    return DEFAULT_SIZES;
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

  return sizes.length > 0 ? sizes : DEFAULT_SIZES;
}

function normalizeCategory(value: unknown, categories: ProductCategoryItem[]) {
  return typeof value === "string" && categories.some((category) => category.value === value)
    ? value
    : categories[0]?.value || DEFAULT_CATEGORIES[0].value;
}

function normalizeText(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function normalizeNumber(value: unknown, fallback: number) {
  const number = Math.round(Number(value));

  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/giu, "-")
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

function getUniqueValue(requestedValue: string, usedValues: Set<string>) {
  let value = requestedValue;
  let index = 2;

  while (usedValues.has(value)) {
    value = `${requestedValue}-${index}`;
    index += 1;
  }

  usedValues.add(value);

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
