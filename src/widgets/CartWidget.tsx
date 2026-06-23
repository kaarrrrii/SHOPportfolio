"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { FIXED_PICKUP_INFO, type Order } from "@/shared/data/mock";
import { useEsdirAuth } from "@/shared/lib/auth";
import { formatCoinsLabel } from "@/shared/lib/format";
import { useOrderHistory, useShopCart, type ShopCartLine } from "@/shared/lib/shop";
import { useWalletBalance } from "@/shared/lib/wallet";

export default function CartWidget() {
  const isAuthorized = useEsdirAuth();
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const { balance, spendCoins } = useWalletBalance();
  const {
    items,
    selectedItems,
    selectedTotal: total,
    selectedQuantity,
    isAllSelected,
    toggleAll,
    toggleItem,
    removeItem,
    clearSelected,
  } = useShopCart();
  const { createOrder } = useOrderHistory();
  const canCheckout = selectedItems.length > 0 && total <= balance;

  function handleCheckout() {
    if (!canCheckout) {
      return;
    }

    const order = createOrder(selectedItems);
    spendCoins(total);
    clearSelected();
    setCompletedOrder(order);
  }

  if (!isAuthorized) {
    return <CartLoginGate />;
  }

  return (
    <main className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[44px] font-black uppercase leading-[0.95] text-[#111] [font-family:var(--font-unbounded)] md:text-[72px]">
              Корзина
            </h1>
            <p className="mt-3 text-[17px] font-semibold text-[#555] [font-family:var(--font-montserrat-alt)]">
              Выбирайте позиции и оформляйте заказ за баллы проекта.
            </p>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[22px] bg-white p-4 shadow-[0_12px_34px_rgba(0,0,0,0.08)] md:p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 text-[15px] font-black text-[#111] [font-family:var(--font-montserrat-alt)]">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleAll}
                  className="size-5 accent-[#22A7C7]"
                />
                Выбрать все
              </label>
              <button
                type="button"
                onClick={clearSelected}
                disabled={selectedItems.length === 0}
                aria-label="Удалить выбранные товары"
                title="Удалить выбранные товары"
                className="inline-grid size-10 place-items-center rounded-[9px] bg-[#eef9d5] text-[#5f7313] transition hover:bg-[#dff0aa] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <TrashIcon />
              </button>
            </div>

            {items.length > 0 ? (
              <div className="grid gap-3">
                {items.map((item) => (
                  <CartLineCard
                    key={item.id}
                    item={item}
                    onToggle={() => toggleItem(item.id)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyCart />
            )}
          </div>

          <aside className="lg:sticky lg:top-[104px] lg:self-start">
            <div className="rounded-[22px] border border-[#9ADDEB] bg-white p-5 shadow-[0_12px_34px_rgba(34,167,199,0.12)]">
              <h2 className="text-[26px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">
                Оформление заказа
              </h2>
              <div className="mt-5 space-y-3 text-[15px] font-semibold text-[#264853] [font-family:var(--font-montserrat-alt)]">
                <SummaryRow label="Место выдачи" value={FIXED_PICKUP_INFO} />
                <SummaryRow label="Товары" value={`${selectedQuantity} шт.`} />
                <SummaryRow label="Итого" value={formatCoinsLabel(total)} />
              </div>

              {total > balance ? (
                <p className="mt-4 rounded-[10px] bg-[#F8F5FF] px-4 py-3 text-[13px] font-bold leading-[1.35] text-[#6A4FAD] [font-family:var(--font-montserrat-alt)]">
                  Не хватает баллов для выбранных товаров. Баланс: {formatCoinsLabel(balance)}.
                </p>
              ) : null}

              {canCheckout ? (
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-[10px] bg-[#FF3E80] text-[17px] font-black text-white shadow-[0_10px_22px_rgba(255,62,128,0.26)] transition hover:bg-[#E82E78] [font-family:var(--font-montserrat-alt)]"
                >
                  Оформить
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-6 inline-flex h-14 w-full cursor-not-allowed items-center justify-center rounded-[10px] bg-[#d9d9d9] text-[17px] font-black text-white [font-family:var(--font-montserrat-alt)]"
                >
                  Оформить
                </button>
              )}

              <Link
                href="/merch"
                className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-[10px] border border-[#d8d8d8] bg-white text-[15px] font-black text-[#111] transition hover:border-[#335EC8] hover:text-[#335EC8] [font-family:var(--font-montserrat-alt)]"
              >
                Вернуться к мерчу
              </Link>
            </div>
          </aside>
        </section>
      </div>
      <CheckoutSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />
    </main>
  );
}

type CartLineCardProps = {
  item: ShopCartLine;
  onToggle: () => void;
  onRemove: () => void;
};

function CartLineCard({ item, onToggle, onRemove }: CartLineCardProps) {
  return (
    <article className="grid gap-3 rounded-[18px] border border-[#eeeeee] bg-[#fbfbfb] p-3 md:grid-cols-[40px_112px_minmax(0,1fr)_auto] md:items-center">
      <label className="flex items-center md:justify-center">
        <input
          type="checkbox"
          checked={item.selected}
          onChange={onToggle}
          className="size-5"
          aria-label={`Выбрать ${item.product.title}`}
        />
      </label>

      <Link href={`/merch/${item.product.slug}`} className="relative aspect-square overflow-hidden rounded-[14px] bg-white">
        <Image
          src={item.product.imageSrc}
          alt=""
          fill
          sizes="112px"
          className="object-contain p-3"
          unoptimized
        />
      </Link>

      <div className="min-w-0">
        <Link
          href={`/merch/${item.product.slug}`}
          className="text-[20px] font-black leading-[1.1] text-[#111] transition hover:text-[#335EC8] [font-family:var(--font-unbounded)]"
        >
          {item.product.title}
        </Link>
        <p className="mt-2 text-[14px] font-semibold text-[#555] [font-family:var(--font-montserrat-alt)]">
          Размер: <span className="font-black text-[#335EC8]">{item.size}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 md:justify-end">
        <p className="min-w-[120px] text-right text-[18px] font-black text-[#111] [font-family:var(--font-unbounded)]">
          {formatCoinsLabel(item.product.price * item.quantity)}
        </p>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Удалить ${item.product.title}`}
          className="grid size-10 place-items-center rounded-[9px] bg-[#335EC8] text-[20px] font-black text-white transition hover:scale-105 hover:bg-[#244CA8]"
        >
          ×
        </button>
      </div>
    </article>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#9ADDEB] pb-3">
      <span>{label}</span>
      <strong className="max-w-[190px] text-right leading-[1.2] text-[#111]">{value}</strong>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="rounded-[18px] border border-dashed border-[#d8d8d8] bg-[#fafafa] p-8 text-center">
      <p className="text-[26px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">
        Корзина пуста
      </p>
      <p className="mx-auto mt-3 max-w-[460px] text-[15px] font-semibold leading-[1.4] text-[#666] [font-family:var(--font-montserrat-alt)]">
        Вы удалили все позиции из локальной корзины. Каталог остается доступен для нового выбора.
      </p>
      <Link
        href="/merch"
        className="mt-5 inline-flex h-12 items-center justify-center rounded-[10px] bg-[#9AC225] px-6 text-[14px] font-black uppercase text-white shadow-[0_10px_22px_rgba(154,194,37,0.22)] transition hover:bg-[#86AA1F] [font-family:var(--font-unbounded)]"
      >
        Открыть каталог
      </Link>
    </div>
  );
}

function CartLoginGate() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
        <section className="mx-auto max-w-[760px] rounded-[24px] bg-white p-6 text-center shadow-[0_12px_34px_rgba(0,0,0,0.08)] md:p-10">
          <p className="text-[15px] font-black uppercase text-[#22A7C7] [font-family:var(--font-montserrat-alt)]">
            Корзина
          </p>
          <h1 className="mx-auto mt-3 max-w-[620px] text-[32px] font-black uppercase leading-[1.05] text-[#111] [font-family:var(--font-unbounded)] sm:text-[40px] md:text-[52px]">
            Войдите в аккаунт
          </h1>
          <p className="mx-auto mt-5 max-w-[520px] text-[16px] font-semibold leading-[1.45] text-[#555] [font-family:var(--font-montserrat-alt)]">
            Корзина доступна только авторизованным пользователям.
          </p>
          <Link
            href="/account"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[10px] bg-[#22A7C7] px-6 py-3 text-[15px] font-black text-white shadow-[0_10px_22px_rgba(34,167,199,0.22)] transition hover:bg-[#1688A3] [font-family:var(--font-montserrat-alt)]"
          >
            Войти
          </Link>
        </section>
      </div>
    </main>
  );
}

function TrashIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M7.5 4.5H12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4.5 6.5H15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M6 8L6.6 15.2C6.68 16.16 7.48 16.9 8.44 16.9H11.56C12.52 16.9 13.32 16.16 13.4 15.2L14 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.5 9.5V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11.5 9.5V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

type CheckoutSuccessModalProps = {
  order: Order | null;
  onClose: () => void;
};

function CheckoutSuccessModal({ order, onClose }: CheckoutSuccessModalProps) {
  if (!order || typeof document === "undefined") {
    return null;
  }

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return createPortal(
    <div className="fixed inset-0 z-[120] min-h-dvh overflow-y-auto bg-black/45 px-4 py-6">
      <div className="flex min-h-full items-center justify-center">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-success-title"
        className="w-full max-w-[560px] rounded-[24px] bg-white p-6 text-center shadow-[0_24px_70px_rgba(0,0,0,0.24)] md:p-8"
      >
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#9AC225] text-white shadow-[0_10px_24px_rgba(154,194,37,0.28)]">
          <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M11 20.5L17.5 27L30 13" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2
          id="checkout-success-title"
          className="mx-auto mt-6 max-w-[360px] text-[30px] font-black uppercase leading-[1.05] text-[#111] [font-family:var(--font-unbounded)]"
        >
          Заказ оформлен
        </h2>
        <p className="mx-auto mt-3 max-w-[400px] text-[15px] font-semibold leading-[1.45] text-[#555] [font-family:var(--font-montserrat-alt)]">
          Забрать заказ можно в профкоме, аудитория 17-10-11.
        </p>

        <div className="mt-6 grid gap-2 rounded-[16px] bg-[#F2FCFF] p-4 text-left [font-family:var(--font-montserrat-alt)]">
          <SuccessSummaryRow label="Дата" value={order.createdAt} />
          <SuccessSummaryRow label="Товары" value={`${itemCount} шт.`} />
          <SuccessSummaryRow label="Итого" value={formatCoinsLabel(order.total)} />
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Link
            href="/orders"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#335EC8] px-5 text-[14px] font-black text-white transition hover:bg-[#244CA8] [font-family:var(--font-montserrat-alt)]"
          >
            Смотреть заказы
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#d8d8d8] bg-white px-5 text-[14px] font-black text-[#111] transition hover:border-[#FF3E80] hover:text-[#E82E78] [font-family:var(--font-montserrat-alt)]"
          >
            Остаться в корзине
          </button>
        </div>
      </section>
      </div>
    </div>,
    document.body,
  );
}

type SuccessSummaryRowProps = {
  label: string;
  value: string;
};

function SuccessSummaryRow({ label, value }: SuccessSummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#9ADDEB] py-2 last:border-b-0">
      <span className="text-[12px] font-black uppercase text-[#1688A3]">{label}</span>
      <strong className="text-right text-[14px] font-black text-[#111]">{value}</strong>
    </div>
  );
}
