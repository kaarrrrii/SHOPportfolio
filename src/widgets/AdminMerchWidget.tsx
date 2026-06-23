"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product, ProductCategory, ProductSizeStock } from "@/shared/data/mock";
import { authorizeAdminDemo, useAdminAuth } from "@/shared/lib/auth";
import { formatCoinsLabel } from "@/shared/lib/format";
import {
  createMerchProductSlug,
  getCategoryLabel,
  getProductTotalStock,
  useMerchCategories,
  useMerchProducts,
  type ProductCategoryItem,
} from "@/shared/lib/merch";
import { ORDER_STATUSES, useOrderHistory, type OrderStatus } from "@/shared/lib/shop";

type AdminSection = "merch" | "orders";

type AdminMerchWidgetProps = {
  section?: AdminSection;
};

type ProductFormSize = {
  id: string;
  size: string;
  stock: string;
};

type ProductFormState = {
  slug: string;
  title: string;
  category: ProductCategory;
  description: string;
  price: string;
  imageSrc: string;
  sizes: ProductFormSize[];
};

let sizeRowSeed = 0;

export default function AdminMerchWidget({ section = "merch" }: AdminMerchWidgetProps) {
  const isAuthorized = useAdminAuth();
  const { products, saveProduct, removeProduct } = useMerchProducts();
  const { categories, addCategory, removeCategory } = useMerchCategories();
  const { orders, setOrderStatus } = useOrderHistory();
  const firstCategory = categories[0]?.value || "hoodies";
  const [form, setForm] = useState<ProductFormState>(() => createEmptyForm(firstCategory));
  const [editingSlug, setEditingSlug] = useState("");
  const [message, setMessage] = useState("");
  const [categoryDraft, setCategoryDraft] = useState("");
  const activeFormCategory = categories.some((category) => category.value === form.category)
    ? form.category
    : firstCategory;
  const productsBySlug = useMemo(
    () => new Map(products.map((product) => [product.slug, product])),
    [products],
  );
  const activeOrders = useMemo(
    () => orders.filter((order) => order.status !== "Получен"),
    [orders],
  );
  const pageTitle = section === "merch" ? "Управление мерчом" : "Выдача заказов";

  if (!isAuthorized) {
    return <AdminAuthGate />;
  }

  function updateField<Field extends keyof ProductFormState>(field: Field, value: ProductFormState[Field]) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function updateSizeField(id: string, field: "size" | "stock", value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      sizes: currentForm.sizes.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addSizeRow() {
    setForm((currentForm) => ({
      ...currentForm,
      sizes: [...currentForm.sizes, createSizeRow("", "0")],
    }));
  }

  function removeSizeRow(id: string) {
    setForm((currentForm) => {
      const targetSize = currentForm.sizes.find((item) => item.id === id);

      if (currentForm.sizes.length <= 1 || normalizePositiveNumber(targetSize?.stock || "0") > 0) {
        return currentForm;
      }

      return {
        ...currentForm,
        sizes: currentForm.sizes.filter((item) => item.id !== id),
      };
    });
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Выберите файл изображения");
      event.currentTarget.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField("imageSrc", reader.result);
        setMessage("Изображение загружено");
      }
    };
    reader.onerror = () => setMessage("Не удалось загрузить изображение");
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const product = buildProductFromForm(
      { ...form, category: activeFormCategory },
      products,
      editingSlug || undefined,
    );
    saveProduct(product);
    setForm(createFormFromProduct(product));
    setEditingSlug(product.slug);
    setMessage(editingSlug ? "Товар обновлен" : "Товар добавлен");
  }

  function handleCreateNew() {
    setForm(createEmptyForm(firstCategory));
    setEditingSlug("");
    setMessage("");
  }

  function handleAddCategory() {
    const label = categoryDraft.trim();

    if (!label) {
      setMessage("Введите название категории");
      return;
    }

    const category = addCategory(label);

    setCategoryDraft("");
    setForm((currentForm) => ({ ...currentForm, category: category.value }));
    setMessage("Категория добавлена");
  }

  function handleRemoveCategory(category: ProductCategoryItem) {
    const confirmed = window.confirm(`Удалить категорию "${category.label}"? Товары из нее перейдут в первую доступную категорию.`);

    if (!confirmed) {
      return;
    }

    const removed = removeCategory(category.value);

    setMessage(removed ? "Категория удалена" : "Нельзя удалить последнюю категорию");
  }

  function handleEditProduct(product: Product) {
    setForm(createFormFromProduct(product));
    setEditingSlug(product.slug);
    setMessage(`Редактирование: ${product.title}`);
  }

  function handleRemoveProduct(product: Product) {
    const confirmed = window.confirm(`Удалить товар "${product.title}" из каталога?`);

    if (!confirmed) {
      return;
    }

    removeProduct(product.slug);

    if (editingSlug === product.slug) {
      handleCreateNew();
    }

    setMessage("Товар удален");
  }

  function handleConfirmOrderStatus(orderId: string, currentStatus: OrderStatus, nextStatus: OrderStatus) {
    if (currentStatus === nextStatus) {
      return;
    }

    const confirmed = window.confirm(`Изменить статус заказа ${orderId} с "${currentStatus}" на "${nextStatus}"?`);

    if (!confirmed) {
      return;
    }

    setOrderStatus(orderId, nextStatus);
    setMessage(`Статус заказа ${orderId}: ${nextStatus}`);
  }

  return (
    <main className="admin-page bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-5 sm:py-10 md:px-8 md:py-14">
        <section className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-[32px] font-black uppercase leading-[1] text-[#111] [font-family:var(--font-unbounded)] sm:text-[40px] md:text-[64px]">
                {pageTitle}
              </h1>
              <p className="mt-3 max-w-[720px] text-[16px] font-semibold leading-[1.45] text-[#555] [font-family:var(--font-montserrat-alt)]">
                Управление витриной, остатками и заказами проекта.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
              <MetricTile label="Товаров" value={String(products.length)} />
              <MetricTile label="К выдаче" value={String(activeOrders.length)} />
            </div>
          </div>
        </section>

        {section === "merch" ? (
        <>
        <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(360px,1fr)]">
          <form
            onSubmit={handleSubmit}
            className="min-w-0 rounded-[18px] bg-white p-4 shadow-[0_12px_34px_rgba(0,0,0,0.08)] sm:rounded-[22px] sm:p-5 md:p-6"
          >
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[13px] font-black uppercase text-[#E82E78] [font-family:var(--font-montserrat-alt)]">
                  {editingSlug ? "Редактирование товара" : "Новый товар"}
                </p>
                <h2 className="mt-1 text-[28px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">
                  Карточка мерча
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCreateNew}
                className="inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-[#8B3DFF] px-4 text-[14px] font-black text-white shadow-[0_8px_18px_rgba(139,61,255,0.22)] transition hover:bg-[#6F22E8] sm:w-auto [font-family:var(--font-montserrat-alt)]"
              >
                Новый
              </button>
            </div>

            <CategoryManager
              categories={categories}
              draft={categoryDraft}
              onDraftChange={setCategoryDraft}
              onAdd={handleAddCategory}
              onRemove={handleRemoveCategory}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Название" value={form.title} onChange={(value) => updateField("title", value)} required />
              <SelectField
                label="Категория"
                value={activeFormCategory}
                onChange={(value) => updateField("category", value as ProductCategory)}
                options={categories.map((category) => ({ value: category.value, label: category.label }))}
              />
              <TextField label="Цена" value={form.price} onChange={(value) => updateField("price", value)} type="number" min="0" required />
            </div>

            <div className="mt-4 grid gap-4">
              <ImageUploadField imageSrc={form.imageSrc} onChange={handleImageUpload} />
              <TextAreaField label="Описание" value={form.description} onChange={(value) => updateField("description", value)} rows={3} required />
              <ProductSizesField
                sizes={form.sizes}
                onAdd={addSizeRow}
                onRemove={removeSizeRow}
                onUpdate={updateSizeField}
              />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-[#B8CB2F] px-6 text-[15px] font-black text-[#111] shadow-[0_10px_22px_rgba(184,203,47,0.28)] transition hover:bg-[#A6BA24] sm:w-auto [font-family:var(--font-montserrat-alt)]"
              >
                {editingSlug ? "Сохранить изменения" : "Добавить товар"}
              </button>
              {message ? (
                <p className="text-[14px] font-black text-[#1688A3] [font-family:var(--font-montserrat-alt)]">
                  {message}
                </p>
              ) : null}
            </div>
          </form>

          <section className="min-w-0 rounded-[18px] bg-white p-4 shadow-[0_12px_34px_rgba(0,0,0,0.08)] sm:rounded-[22px] sm:p-5 md:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[13px] font-black uppercase text-[#7A9411] [font-family:var(--font-montserrat-alt)]">
                  Каталог
                </p>
                <h2 className="mt-1 text-[28px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">
                  Товары
                </h2>
              </div>
              <Link
                href="/admin/showcase"
                className="inline-flex h-11 w-full items-center justify-center rounded-[10px] border border-[#d8d8d8] bg-white px-4 text-[14px] font-black text-[#111] transition hover:border-[#335EC8] hover:text-[#335EC8] sm:w-auto [font-family:var(--font-montserrat-alt)]"
              >
                Открыть витрину
              </Link>
            </div>

            <div className="grid max-h-[900px] gap-3 overflow-y-auto pr-1">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductAdminRow
                    key={product.slug}
                    product={product}
                    isEditing={editingSlug === product.slug}
                    onEdit={() => handleEditProduct(product)}
                    onRemove={() => handleRemoveProduct(product)}
                  />
                ))
              ) : (
                <div className="rounded-[16px] border border-dashed border-[#d8d8d8] bg-[#fafafa] p-6 text-center">
                  <p className="text-[20px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">
                    Нет товаров
                  </p>
                </div>
              )}
            </div>
          </section>
        </section>
        <InventoryStockPanel products={products} onSaveProduct={saveProduct} />
        </>
        ) : null}

        {section === "orders" ? (
        <section className="mt-6 min-w-0 rounded-[18px] bg-white p-4 shadow-[0_12px_34px_rgba(0,0,0,0.08)] sm:rounded-[22px] sm:p-5 md:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[13px] font-black uppercase text-[#7B5BC8] [font-family:var(--font-montserrat-alt)]">
                Заказы
              </p>
              <h2 className="mt-1 text-[28px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">
                Выдача
              </h2>
            </div>
            <Link
              href="/orders"
              className="inline-flex h-11 w-full items-center justify-center rounded-[10px] border border-[#d8d8d8] bg-white px-4 text-[14px] font-black text-[#111] transition hover:border-[#7B5BC8] hover:text-[#6A4FAD] sm:w-auto [font-family:var(--font-montserrat-alt)]"
            >
              История заказов
            </Link>
          </div>

          <div className="grid gap-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <article
                  key={order.id}
                  className="grid min-w-0 gap-4 rounded-[18px] border border-[#eeeeee] bg-[#fbfbfb] p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words text-[13px] font-black uppercase text-[#777] [font-family:var(--font-montserrat-alt)]">
                          {order.id} · {order.createdAt}
                        </p>
                        <h3 className="mt-1 text-[20px] font-black text-[#111] [font-family:var(--font-unbounded)] sm:text-[24px]">
                          {order.status}
                        </h3>
                      </div>
                      <p className="w-full rounded-[12px] bg-white px-4 py-2 text-[18px] font-black text-[#111] shadow-[0_4px_14px_rgba(0,0,0,0.06)] sm:w-auto [font-family:var(--font-unbounded)]">
                        {formatCoinsLabel(order.total)}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-2">
                      {order.items.map((item) => {
                        const product = productsBySlug.get(item.productSlug);

                        return (
                          <div
                            key={`${order.id}-${item.productSlug}-${item.size}`}
                            className="min-w-0 break-words rounded-[12px] bg-white px-4 py-3 text-[14px] font-bold text-[#555] [font-family:var(--font-montserrat-alt)]"
                          >
                            <span className="font-black text-[#111]">
                              {product?.title || "Товар удален"}
                            </span>{" "}
                            · {item.size}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <OrderStatusControl
                    key={`${order.id}-${getSafeOrderStatus(order.status)}`}
                    orderId={order.id}
                    status={getSafeOrderStatus(order.status)}
                    onConfirm={handleConfirmOrderStatus}
                  />
                </article>
              ))
            ) : (
              <div className="rounded-[16px] border border-dashed border-[#d8d8d8] bg-[#fafafa] p-8 text-center">
                <p className="text-[22px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">
                  Заказов пока нет
                </p>
              </div>
            )}
          </div>
        </section>
        ) : null}
      </div>
    </main>
  );
}

function AdminAuthGate() {
  return (
    <main className="admin-page bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-5 sm:py-10 md:px-8 md:py-14">
        <section className="mx-auto max-w-[780px] rounded-[18px] bg-white p-5 text-center shadow-[0_12px_34px_rgba(0,0,0,0.08)] sm:rounded-[24px] sm:p-6 md:p-10">
          <h1 className="mt-3 text-[30px] font-black uppercase leading-[1.05] text-[#111] [font-family:var(--font-unbounded)] sm:text-[34px] md:text-[48px]">
            Нужен вход
          </h1>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] font-semibold leading-[1.45] text-[#555] [font-family:var(--font-montserrat-alt)]">
            Управление мерчем доступно только администратору.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={authorizeAdminDemo}
              className="inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-[#7B5BC8] px-6 text-[15px] font-black text-white shadow-[0_10px_22px_rgba(123,91,200,0.22)] transition hover:bg-[#6748B4] sm:w-auto [font-family:var(--font-montserrat-alt)]"
            >
              Войти как администратор
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

type MetricTileProps = {
  label: string;
  value: string;
};

function MetricTile({ label, value }: MetricTileProps) {
  return (
    <div className="min-w-0 rounded-[16px] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <p className="text-[12px] font-black uppercase text-[#777] [font-family:var(--font-montserrat-alt)]">
        {label}
      </p>
      <p className="mt-1 break-words text-[28px] font-black text-[#111] [font-family:var(--font-unbounded)] sm:text-[30px]">
        {value}
      </p>
    </div>
  );
}

type InventoryStockPanelProps = {
  products: Product[];
  onSaveProduct: (product: Product) => void;
};

type ProductStockDraftSize = {
  size: string;
  stock: string;
};

function InventoryStockPanel({ products, onSaveProduct }: InventoryStockPanelProps) {
  const [stockDrafts, setStockDrafts] = useState<Record<string, ProductStockDraftSize[]>>({});

  function getDraftSizes(product: Product) {
    return stockDrafts[product.slug] || createStockDraftSizes(product);
  }

  function updateDraftSize(
    product: Product,
    index: number,
    field: keyof ProductStockDraftSize,
    value: string,
  ) {
    setStockDrafts((currentDrafts) => {
      const currentSizes = currentDrafts[product.slug] || createStockDraftSizes(product);

      return {
        ...currentDrafts,
        [product.slug]: currentSizes.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
        ),
      };
    });
  }

  function addDraftSize(product: Product) {
    setStockDrafts((currentDrafts) => {
      const currentSizes = currentDrafts[product.slug] || createStockDraftSizes(product);

      return {
        ...currentDrafts,
        [product.slug]: [...currentSizes, { size: "", stock: "0" }],
      };
    });
  }

  function removeDraftSize(product: Product, index: number) {
    setStockDrafts((currentDrafts) => {
      const currentSizes = currentDrafts[product.slug] || createStockDraftSizes(product);
      const targetSize = currentSizes[index];

      if (currentSizes.length <= 1 || normalizePositiveNumber(targetSize?.stock || "0") > 0) {
        return currentDrafts;
      }

      return {
        ...currentDrafts,
        [product.slug]: currentSizes.filter((_, itemIndex) => itemIndex !== index),
      };
    });
  }

  function resetDraft(product: Product) {
    setStockDrafts((currentDrafts) => {
      const nextDrafts = { ...currentDrafts };

      delete nextDrafts[product.slug];

      return nextDrafts;
    });
  }

  function saveDraft(product: Product) {
    const draftSizes = getDraftSizes(product);
    const nextProduct = {
      ...product,
      sizes: normalizeProductSizeRows(
        draftSizes.map((item, index) => ({
          id: `${product.slug}-${index}`,
          size: item.size,
          stock: item.stock,
        })),
      ),
    };

    onSaveProduct(nextProduct);
    resetDraft(product);
  }

  return (
    <section className="mt-6 rounded-[18px] border border-[#C7B8F1] bg-white p-4 shadow-[0_12px_34px_rgba(123,91,200,0.12)] sm:rounded-[22px] sm:p-5 md:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-black uppercase text-[#6A4FAD] [font-family:var(--font-montserrat-alt)]">
            Остатки по размерам
          </p>
          <h2 className="mt-1 text-[28px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">
            Склад
          </h2>
          <p className="mt-2 max-w-[760px] text-[14px] font-semibold leading-[1.45] text-[#666] [font-family:var(--font-montserrat-alt)]">
            Фото товара слева, справа - размеры и их остатки.
          </p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {products.map((product) => {
            const draftSizes = getDraftSizes(product);
            const isDirty = isStockDraftDirty(product, draftSizes);

            return (
            <article
              key={product.slug}
              className="grid gap-4 rounded-[16px] border border-[#ececec] bg-[#fbfbfb] p-3 sm:p-4 lg:grid-cols-[136px_minmax(0,1fr)]"
            >
              <div className="relative aspect-square overflow-hidden rounded-[14px] bg-white">
                <Image
                  src={product.imageSrc}
                  alt=""
                  fill
                  sizes="136px"
                  className="object-contain p-3"
                  unoptimized
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate text-[18px] font-black text-[#111] [font-family:var(--font-unbounded)]">
                      {product.title}
                    </h3>
                    <p className="mt-1 text-[13px] font-bold text-[#666] [font-family:var(--font-montserrat-alt)]">
                      {product.categoryLabel} · {formatCoinsLabel(product.price)}
                    </p>
                  </div>
                  <p className="w-full rounded-[10px] bg-white px-3 py-2 text-[16px] font-black text-[#6A4FAD] shadow-[0_4px_14px_rgba(0,0,0,0.06)] [font-family:var(--font-unbounded)] sm:w-auto">
                    {draftSizes.reduce((sum, item) => sum + normalizePositiveNumber(item.stock), 0)} шт.
                  </p>
                </div>

                <div className="mt-4 grid gap-2">
                  {draftSizes.map((item, index) => {
                    const hasStock = normalizePositiveNumber(item.stock) > 0;
                    const cannotRemove = draftSizes.length <= 1 || hasStock;

                    return (
                      <div
                        key={`${product.slug}-${index}`}
                        className="grid gap-2 rounded-[12px] border border-[#dedede] bg-white p-3 md:grid-cols-[minmax(0,1fr)_150px_auto] md:items-end"
                      >
                        <label className="grid min-w-0 gap-2 text-[12px] font-black uppercase text-[#666] [font-family:var(--font-montserrat-alt)]">
                          Размер
                          <input
                            value={item.size}
                            onChange={(event) => updateDraftSize(product, index, "size", event.target.value)}
                            className="h-11 min-w-0 rounded-[9px] border border-[#dedede] bg-[#fbfbfb] px-3 text-[15px] font-bold normal-case text-[#111] outline-none transition focus:border-[#22A7C7] focus:bg-white [font-family:var(--font-montserrat-alt)]"
                          />
                        </label>
                        <label className="grid min-w-0 gap-2 text-[12px] font-black uppercase text-[#666] [font-family:var(--font-montserrat-alt)]">
                          Остаток
                          <input
                            type="number"
                            min="0"
                            value={item.stock}
                            onChange={(event) => updateDraftSize(product, index, "stock", event.target.value)}
                            className="h-11 min-w-0 rounded-[9px] border border-[#dedede] bg-[#fbfbfb] px-3 text-[15px] font-bold text-[#111] outline-none transition focus:border-[#22A7C7] focus:bg-white [font-family:var(--font-montserrat-alt)]"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeDraftSize(product, index)}
                          disabled={cannotRemove}
                          title={hasStock ? "Нельзя удалить размер, пока по нему есть остаток" : undefined}
                          className="h-11 rounded-[9px] bg-[#8B3DFF] px-4 text-[13px] font-black text-white transition hover:bg-[#6F22E8] disabled:cursor-not-allowed disabled:bg-[#d9d9d9] [font-family:var(--font-montserrat-alt)]"
                        >
                          Удалить
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => addDraftSize(product)}
                    className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#22A7C7] px-4 text-[13px] font-black text-white transition hover:bg-[#1688A3] [font-family:var(--font-montserrat-alt)]"
                  >
                    Добавить размер
                  </button>
                  <button
                    type="button"
                    onClick={() => saveDraft(product)}
                    disabled={!isDirty}
                    className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#B8CB2F] px-5 text-[13px] font-black text-[#111] transition hover:bg-[#A6BA24] disabled:cursor-not-allowed disabled:bg-[#d9d9d9] disabled:text-white [font-family:var(--font-montserrat-alt)]"
                  >
                    Сохранить склад
                  </button>
                  {isDirty ? (
                    <button
                      type="button"
                      onClick={() => resetDraft(product)}
                      className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#d8d8d8] bg-white px-4 text-[13px] font-black text-[#111] transition hover:border-[#8B3DFF] hover:text-[#6F22E8] [font-family:var(--font-montserrat-alt)]"
                    >
                      Отменить
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-[14px] border border-dashed border-[#d8d8d8] bg-[#fafafa] p-5 text-center">
          <p className="text-[15px] font-bold text-[#666] [font-family:var(--font-montserrat-alt)]">
            Остатков пока нет.
          </p>
        </div>
      )}
    </section>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  min?: string;
  placeholder?: string;
};

function TextField({ label, value, onChange, required, type = "text", min, placeholder }: FieldProps) {
  return (
    <label className="grid min-w-0 gap-2 text-[13px] font-black uppercase text-[#555] [font-family:var(--font-montserrat-alt)]">
      {label}
      <input
        type={type}
        min={min}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 min-w-0 rounded-[10px] border border-[#dedede] bg-[#fbfbfb] px-4 text-[15px] font-bold normal-case text-[#111] outline-none transition focus:border-[#22A7C7] focus:bg-white [font-family:var(--font-montserrat-alt)]"
      />
    </label>
  );
}

type TextAreaFieldProps = FieldProps & {
  rows?: number;
};

function TextAreaField({ label, value, onChange, required, rows = 3, placeholder }: TextAreaFieldProps) {
  return (
    <label className="grid min-w-0 gap-2 text-[13px] font-black uppercase text-[#555] [font-family:var(--font-montserrat-alt)]">
      {label}
      <textarea
        required={required}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 resize-y rounded-[10px] border border-[#dedede] bg-[#fbfbfb] px-4 py-3 text-[15px] font-bold normal-case leading-[1.4] text-[#111] outline-none transition focus:border-[#22A7C7] focus:bg-white [font-family:var(--font-montserrat-alt)]"
      />
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
};

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <label className="grid min-w-0 gap-2 text-[13px] font-black uppercase text-[#555] [font-family:var(--font-montserrat-alt)]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 min-w-0 rounded-[10px] border border-[#dedede] bg-[#fbfbfb] px-4 text-[15px] font-bold normal-case text-[#111] outline-none transition focus:border-[#22A7C7] focus:bg-white [font-family:var(--font-montserrat-alt)]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

type CategoryManagerProps = {
  categories: ProductCategoryItem[];
  draft: string;
  onDraftChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (category: ProductCategoryItem) => void;
};

function CategoryManager({ categories, draft, onDraftChange, onAdd, onRemove }: CategoryManagerProps) {
  return (
    <section className="mb-5 min-w-0 rounded-[16px] border border-[#C7B8F1] bg-white p-3 shadow-[0_8px_22px_rgba(123,91,200,0.1)] sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <label className="grid min-w-0 flex-1 gap-2 text-[13px] font-black uppercase text-[#555] [font-family:var(--font-montserrat-alt)]">
          Категории
          <input
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onAdd();
              }
            }}
            placeholder="Новая категория"
            className="h-12 min-w-0 rounded-[10px] border border-[#dedede] bg-white px-4 text-[15px] font-bold normal-case text-[#111] outline-none transition focus:border-[#22A7C7] [font-family:var(--font-montserrat-alt)]"
          />
        </label>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-[#8B3DFF] px-5 text-[14px] font-black text-white shadow-[0_8px_18px_rgba(139,61,255,0.24)] transition hover:bg-[#6F22E8] lg:w-auto [font-family:var(--font-montserrat-alt)]"
        >
          Добавить категорию
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map((category) => (
          <span
            key={category.value}
            className="inline-flex max-w-full min-h-10 items-center gap-2 rounded-[10px] border border-[#C7B8F1] bg-white px-3 py-2 text-[13px] font-black text-[#111] [font-family:var(--font-montserrat-alt)]"
          >
            <span className="min-w-0 truncate">{category.label}</span>
            <button
              type="button"
              onClick={() => onRemove(category)}
              disabled={categories.length <= 1}
              className="rounded-[7px] bg-[#8B3DFF] px-2 py-1 text-[12px] text-white transition hover:bg-[#6F22E8] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Удалить
            </button>
          </span>
        ))}
      </div>
    </section>
  );
}

type ImageUploadFieldProps = {
  imageSrc: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function ImageUploadField({ imageSrc, onChange }: ImageUploadFieldProps) {
  return (
    <div className="grid min-w-0 gap-2 text-[13px] font-black uppercase text-[#555] [font-family:var(--font-montserrat-alt)]">
      <span>Изображение</span>
      <div className="grid gap-3 rounded-[14px] border border-[#dedede] bg-[#fbfbfb] p-3 sm:grid-cols-[116px_minmax(0,1fr)] sm:items-center">
        <div className="relative aspect-square overflow-hidden rounded-[12px] bg-white">
          <Image
            src={imageSrc || "/merch__hero.png"}
            alt=""
            fill
            sizes="116px"
            className="object-contain p-2"
            unoptimized
          />
        </div>
        <label className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-[10px] bg-[#22A7C7] px-5 text-[14px] font-black text-white transition hover:bg-[#1688A3] sm:w-auto">
          Загрузить карточку товара
          <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}

type ProductSizesFieldProps = {
  sizes: ProductFormSize[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: "size" | "stock", value: string) => void;
};

function ProductSizesField({ sizes, onAdd, onRemove, onUpdate }: ProductSizesFieldProps) {
  return (
    <div className="grid gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] font-black uppercase text-[#555] [font-family:var(--font-montserrat-alt)]">
          Размеры и остаток
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 w-full items-center justify-center rounded-[9px] bg-[#8B3DFF] px-4 text-[13px] font-black text-white shadow-[0_6px_14px_rgba(139,61,255,0.22)] transition hover:bg-[#6F22E8] sm:w-auto [font-family:var(--font-montserrat-alt)]"
        >
          Добавить размер
        </button>
      </div>

      <div className="grid gap-2">
        {sizes.map((item) => {
          const hasStock = normalizePositiveNumber(item.stock) > 0;
          const cannotRemove = sizes.length <= 1 || hasStock;

          return (
          <div
            key={item.id}
            className="grid min-w-0 gap-2 rounded-[14px] border border-[#dedede] bg-[#fbfbfb] p-3 md:grid-cols-[minmax(0,1fr)_140px_auto] md:items-end"
          >
            <label className="grid min-w-0 gap-2 text-[12px] font-black uppercase text-[#666] [font-family:var(--font-montserrat-alt)]">
              Размер
              <input
                value={item.size}
                onChange={(event) => onUpdate(item.id, "size", event.target.value)}
                className="h-11 min-w-0 rounded-[9px] border border-[#dedede] bg-white px-3 text-[15px] font-bold normal-case text-[#111] outline-none transition focus:border-[#22A7C7] [font-family:var(--font-montserrat-alt)]"
              />
            </label>
            <label className="grid min-w-0 gap-2 text-[12px] font-black uppercase text-[#666] [font-family:var(--font-montserrat-alt)]">
              Остаток
              <input
                type="number"
                min="0"
                value={item.stock}
                onChange={(event) => onUpdate(item.id, "stock", event.target.value)}
                className="h-11 min-w-0 rounded-[9px] border border-[#dedede] bg-white px-3 text-[15px] font-bold text-[#111] outline-none transition focus:border-[#22A7C7] [font-family:var(--font-montserrat-alt)]"
              />
            </label>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              disabled={cannotRemove}
              title={hasStock ? "Нельзя удалить размер, пока по нему есть остаток" : undefined}
              className="h-11 rounded-[9px] bg-[#8B3DFF] px-4 text-[13px] font-black text-white transition hover:bg-[#6F22E8] disabled:cursor-not-allowed disabled:bg-[#d9d9d9] disabled:text-white [font-family:var(--font-montserrat-alt)]"
            >
              Удалить
            </button>
          </div>
          );
        })}
      </div>
    </div>
  );
}

type ProductAdminRowProps = {
  product: Product;
  isEditing: boolean;
  onEdit: () => void;
  onRemove: () => void;
};

function ProductAdminRow({ product, isEditing, onEdit, onRemove }: ProductAdminRowProps) {
  return (
    <article className={`grid min-w-0 gap-3 rounded-[16px] border p-3 sm:grid-cols-[92px_minmax(0,1fr)] ${isEditing ? "border-[#C7B8F1] bg-[#F8F5FF]" : "border-[#eeeeee] bg-[#fbfbfb]"}`}>
      <Link href={`/admin/showcase/${product.slug}`} className="relative aspect-square overflow-hidden rounded-[12px] bg-white">
        <Image
          src={product.imageSrc}
          alt=""
          fill
          sizes="92px"
          className="object-contain p-2"
          unoptimized
        />
      </Link>
      <div className="min-w-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-[18px] font-black text-[#111] [font-family:var(--font-unbounded)]">
              {product.title}
            </h3>
            <p className="mt-1 break-words text-[13px] font-bold text-[#666] [font-family:var(--font-montserrat-alt)]">
              {product.categoryLabel} · {formatCoinsLabel(product.price)} · остаток {getProductTotalStock(product)}
            </p>
            <p className="mt-1 break-words text-[12px] font-bold text-[#777] [font-family:var(--font-montserrat-alt)]">
              {formatProductSizeStocks(product.sizes)}
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 min-[420px]:grid-cols-3 sm:flex sm:flex-wrap">
          <button
            type="button"
            onClick={onEdit}
            className="h-10 rounded-[9px] bg-[#335EC8] px-4 text-[13px] font-black text-white transition hover:bg-[#244CA8] [font-family:var(--font-montserrat-alt)]"
          >
            Изменить
          </button>
          <Link
            href={`/admin/showcase/${product.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-[9px] border border-[#d8d8d8] bg-white px-4 text-[13px] font-black text-[#111] transition hover:border-[#22A7C7] hover:text-[#1688A3] [font-family:var(--font-montserrat-alt)]"
          >
            Открыть
          </Link>
          <button
            type="button"
            onClick={onRemove}
            className="h-10 rounded-[9px] bg-[#F8F5FF] px-4 text-[13px] font-black text-[#6A4FAD] transition hover:bg-[#EFE8FF] [font-family:var(--font-montserrat-alt)]"
          >
            Удалить
          </button>
        </div>
      </div>
    </article>
  );
}

function createEmptyForm(category: ProductCategory): ProductFormState {
  return {
    slug: "",
    title: "",
    category,
    description: "",
    price: "0",
    imageSrc: "/merch__hero.png",
    sizes: [
      createSizeRow("S 42", "1"),
      createSizeRow("M 44", "1"),
      createSizeRow("L 46", "1"),
    ],
  };
}

function createFormFromProduct(product: Product): ProductFormState {
  return {
    slug: product.slug,
    title: product.title,
    category: product.category,
    description: product.description,
    price: String(product.price),
    imageSrc: product.imageSrc,
    sizes: product.sizes.map((item) => createSizeRow(item.size, String(item.stock))),
  };
}

function buildProductFromForm(
  form: ProductFormState,
  existingProducts: Product[],
  currentSlug?: string,
): Product {
  const title = form.title.trim() || "Новый товар";
  const description = form.description.trim() || "Мерч проекта Зажигай.";
  const category = form.category;
  const slug = createMerchProductSlug(title, existingProducts, currentSlug || form.slug || undefined);

  return {
    slug,
    title,
    category,
    categoryLabel: getCategoryLabel(category),
    description,
    price: normalizePositiveNumber(form.price),
    imageSrc: form.imageSrc.trim() || "/merch__hero.png",
    sizes: normalizeProductSizeRows(form.sizes),
  };
}

function normalizePositiveNumber(value: string) {
  const number = Math.round(Number(value));

  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function createSizeRow(size: string, stock: string): ProductFormSize {
  sizeRowSeed += 1;

  return {
    id: `size-row-${sizeRowSeed}`,
    size,
    stock,
  };
}

function normalizeProductSizeRows(value: ProductFormSize[]): ProductSizeStock[] {
  const sizes = value.flatMap((item): ProductSizeStock[] => {
    const size = item.size.trim();

    if (!size) {
      return [];
    }

    return [{
      size,
      stock: normalizePositiveNumber(item.stock),
    }];
  });

  return sizes.length > 0
    ? sizes
    : [
        { size: "S 42", stock: 0 },
        { size: "M 44", stock: 0 },
        { size: "L 46", stock: 0 },
      ];
}

function createStockDraftSizes(product: Product): ProductStockDraftSize[] {
  return product.sizes.map((item) => ({
    size: item.size,
    stock: String(item.stock),
  }));
}

function isStockDraftDirty(product: Product, draftSizes: ProductStockDraftSize[]) {
  return serializeStockSizes(createStockDraftSizes(product)) !== serializeStockSizes(draftSizes);
}

function serializeStockSizes(sizes: ProductStockDraftSize[]) {
  return JSON.stringify(
    sizes
      .map((item) => ({
        size: item.size.trim(),
        stock: normalizePositiveNumber(item.stock),
      }))
      .filter((item) => item.size),
  );
}

function formatProductSizeStocks(sizes: ProductSizeStock[]) {
  return sizes.map((item) => `${item.size}: ${item.stock}`).join(" · ");
}

type OrderStatusControlProps = {
  orderId: string;
  status: OrderStatus;
  onConfirm: (orderId: string, currentStatus: OrderStatus, nextStatus: OrderStatus) => void;
};

function OrderStatusControl({ orderId, status, onConfirm }: OrderStatusControlProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(status);
  const isChanged = selectedStatus !== status;

  return (
    <div className="rounded-[16px] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12px] font-black uppercase text-[#777] [font-family:var(--font-montserrat-alt)]">
          Статус заказа
        </p>
        <span className={`rounded-[999px] px-3 py-1 text-[12px] font-black text-white [font-family:var(--font-montserrat-alt)] ${getOrderStatusTheme(status).solid}`}>
          {status}
        </span>
      </div>

      <label className="mt-4 grid gap-2 text-[12px] font-black uppercase text-[#777] [font-family:var(--font-montserrat-alt)]">
        Новый статус
        <select
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value as OrderStatus)}
          className="h-12 w-full rounded-[10px] border border-[#dedede] bg-[#fbfbfb] px-4 text-[15px] font-black normal-case text-[#111] outline-none transition focus:border-[#7B5BC8] focus:bg-white [font-family:var(--font-montserrat-alt)]"
        >
          {ORDER_STATUSES.map((statusItem) => (
            <option key={statusItem} value={statusItem}>
              {statusItem}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={() => onConfirm(orderId, status, selectedStatus)}
        disabled={!isChanged}
        className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-[#8B3DFF] px-4 text-[14px] font-black text-white transition hover:bg-[#6F22E8] disabled:cursor-not-allowed disabled:bg-[#d8d8d8] disabled:text-[#777] [font-family:var(--font-montserrat-alt)]"
      >
        Подтвердить статус
      </button>
    </div>
  );
}

function getSafeOrderStatus(status: string): OrderStatus {
  return ORDER_STATUSES.find((statusItem) => statusItem === status) || "Оформлен";
}

function getOrderStatusTheme(status: OrderStatus | string) {
  if (status === "Готов к выдаче") {
    return {
      solid: "bg-[#B8CB2F]",
    };
  }

  if (status === "Получен") {
    return {
      solid: "bg-[#335EC8]",
    };
  }

  return {
    solid: "bg-[#FF3E80]",
  };
}
