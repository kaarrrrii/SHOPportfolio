"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Order } from "@/shared/data/mock";
import { useEsdirAuth } from "@/shared/lib/auth";
import { formatCoinsLabel } from "@/shared/lib/format";
import { useOrderHistory, useShopCart, type ShopCartLine } from "@/shared/lib/shop";
import { useWalletBalance } from "@/shared/lib/wallet";

export default function CartWidget() {
  const router = useRouter();
  const [authNotice, setAuthNotice] = useState("");
  const isAuthorized = useEsdirAuth();
  const { balance, spendCoins } = useWalletBalance();
  const {
    items,
    selectedItems,
    selectedTotal: total,
    isAllSelected,
    toggleAll,
    toggleItem,
    removeItem,
    clearSelected,
  } = useShopCart();
  const { orders, createOrder } = useOrderHistory();
  const canCheckout = selectedItems.length > 0 && total <= balance;

  function handleCheckout() {
    if (!canCheckout) {
      return;
    }

    if (!isAuthorized) {
      setAuthNotice("Войдите как студент, чтобы оформить заказ.");
      router.push("/account");
      return;
    }

    const order = createOrder(selectedItems);
    spendCoins(total);
    clearSelected();
    router.push(`/checkout/success?order=${encodeURIComponent(order.id)}`);
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
              Выбирайте позиции, меняйте количество и оформляйте заказ за монетки проекта.
            </p>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[22px] bg-white p-4 shadow-[0_12px_34px_rgba(0,0,0,0.08)] md:p-5">
            <div className="mb-5 flex flex-wrap items-center gap-3">
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
                className="inline-flex items-center gap-2 rounded-[8px] bg-[#eef9d5] px-4 py-2 text-[14px] font-black text-[#5f7313] transition hover:bg-[#dff0aa] disabled:cursor-not-allowed disabled:opacity-40 [font-family:var(--font-montserrat-alt)]"
              >
                Очистить выбранное
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
                Итого
              </h2>
              <div className="mt-5 space-y-3 text-[15px] font-semibold text-[#264853] [font-family:var(--font-montserrat-alt)]">
                <SummaryRow label="Выбрано товаров" value={`${selectedItems.length}`} />
                <SummaryRow label="Баланс" value={isAuthorized ? formatCoinsLabel(balance) : "Нужен вход"} />
                <SummaryRow label="К списанию" value={formatCoinsLabel(total)} />
              </div>
              {isAuthorized ? (
                <div className="mt-5 rounded-[14px] bg-white/75 p-4">
                  <p className="text-[12px] font-black uppercase text-[#1688A3] [font-family:var(--font-montserrat-alt)]">
                    После оформления
                  </p>
                  <p className="mt-2 text-[24px] font-black text-[#111] [font-family:var(--font-unbounded)]">
                    {formatCoinsLabel(Math.max(balance - total, 0))}
                  </p>
                </div>
              ) : null}

              {total > balance ? (
                <p className="mt-4 rounded-[10px] bg-[#F8F5FF] px-4 py-3 text-[13px] font-bold leading-[1.35] text-[#6A4FAD] [font-family:var(--font-montserrat-alt)]">
                  Не хватает монеток для выбранных товаров.
                </p>
              ) : null}

              {authNotice ? (
                <div className="mt-4 rounded-[10px] border border-[#C7B8F1] bg-[#F8F5FF] px-4 py-3">
                  <p className="text-[13px] font-black leading-[1.35] text-[#6A4FAD] [font-family:var(--font-montserrat-alt)]">
                    {authNotice}
                  </p>
                  <p className="mt-1 text-[12px] font-semibold leading-[1.35] text-[#5c4f85] [font-family:var(--font-montserrat-alt)]">
                    Откройте страницу авторизации и выберите роль студента.
                  </p>
                </div>
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

            {isAuthorized ? <RecentOrdersPanel orders={orders.slice(0, 2)} /> : null}
          </aside>
        </section>
      </div>
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

type RecentOrdersPanelProps = {
  orders: Order[];
};

function RecentOrdersPanel({ orders }: RecentOrdersPanelProps) {
  return (
    <div className="mt-4 rounded-[22px] bg-white p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[22px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">
          Заказы
        </h2>
        <Link
          href="/orders"
          className="text-[13px] font-black text-[#335EC8] transition hover:text-[#7B5BC8] [font-family:var(--font-montserrat-alt)]"
        >
          Все
        </Link>
      </div>

      <div className="mt-4 grid gap-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href="/orders"
            className="rounded-[14px] border border-[#eeeeee] bg-[#fbfbfb] p-4 transition hover:border-[#7B5BC8]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-black text-[#111] [font-family:var(--font-montserrat-alt)]">
                  {order.status}
                </p>
              </div>
              <p className="text-right text-[14px] font-black text-[#111] [font-family:var(--font-unbounded)]">
                {formatCoinsLabel(order.total)}
              </p>
            </div>
            <p className="mt-2 text-[12px] font-semibold text-[#777] [font-family:var(--font-montserrat-alt)]">
              {order.createdAt} · {order.items.length} поз.
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
