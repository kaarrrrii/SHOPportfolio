"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useEsdirAuth } from "@/shared/lib/auth";
import { formatCoinsLabel } from "@/shared/lib/format";
import { useMerchProducts } from "@/shared/lib/merch";
import { useOrderHistory } from "@/shared/lib/shop";

export default function OrdersHistoryWidget() {
  const { orders } = useOrderHistory();
  const { products } = useMerchProducts();
  const productsBySlug = useMemo(
    () => new Map(products.map((product) => [product.slug, product])),
    [products],
  );
  const isAuthorized = useEsdirAuth();

  if (!isAuthorized) {
    return (
      <main className="bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
          <section className="mx-auto max-w-[920px] rounded-[24px] bg-white p-6 text-center shadow-[0_12px_34px_rgba(0,0,0,0.08)] md:p-10">
            <p className="text-[15px] font-black uppercase text-[#7B5BC8] [font-family:var(--font-montserrat-alt)]">
              История заказов
            </p>
            <h1 className="mx-auto mt-3 max-w-[760px] text-[30px] font-black uppercase leading-[1.05] text-[#111] [font-family:var(--font-unbounded)] sm:text-[38px] md:text-[46px]">
              Войдите как студент
            </h1>
            <p className="mx-auto mt-5 max-w-[520px] text-[16px] font-semibold leading-[1.45] text-[#555] [font-family:var(--font-montserrat-alt)]">
              Заказы отображаются только после входа покупателя.
            </p>
            <Link
              href="/account"
              className="mt-7 inline-flex min-h-14 max-w-full items-center justify-center rounded-[10px] bg-[#7B5BC8] px-6 py-4 text-center text-[14px] font-black text-white shadow-[0_10px_22px_rgba(123,91,200,0.26)] transition hover:bg-[#6748B4] [font-family:var(--font-montserrat-alt)] sm:px-8 sm:text-[16px]"
            >
              На страницу входа
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[42px] font-black uppercase leading-[0.95] text-[#111] [font-family:var(--font-unbounded)] md:text-[70px]">
              История заказов
            </h1>
            <p className="mt-3 max-w-[700px] text-[17px] font-semibold leading-[1.4] text-[#555] [font-family:var(--font-montserrat-alt)]">
              Лента заказов показывает статусы, состав и место выдачи.
            </p>
          </div>
          <Link
            href="/cart"
            className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#8B3DFF] px-6 text-[15px] font-black text-white transition hover:bg-[#6F22E8] [font-family:var(--font-montserrat-alt)]"
          >
            Вернуться в корзину
          </Link>
        </div>

        <div className="grid gap-5">
          {orders.map((order) => {
            const statusTheme = getOrderStatusTheme(order.status);

            return (
            <article key={order.id} className={`overflow-hidden rounded-[22px] border ${statusTheme.border} bg-white shadow-[0_12px_34px_rgba(0,0,0,0.08)]`}>
              <div className={`flex flex-col gap-4 border-b ${statusTheme.border} ${statusTheme.soft} p-5 md:flex-row md:items-center md:justify-between`}>
                <div>
                  <p className={`text-[13px] font-black uppercase ${statusTheme.text} [font-family:var(--font-montserrat-alt)]`}>
                    Заказ от {order.createdAt}
                  </p>
                  <h2 className={`mt-1 text-[28px] font-black ${statusTheme.text} [font-family:var(--font-unbounded)]`}>
                    {order.status}
                  </h2>
                  <p className="mt-1 text-[14px] font-semibold text-[#666] [font-family:var(--font-montserrat-alt)]">
                    {order.createdAt} · {order.pickup}
                  </p>
                </div>
                <div className="rounded-[14px] bg-white px-5 py-3 text-right shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                  <p className="text-[12px] font-black uppercase text-[#777] [font-family:var(--font-montserrat-alt)]">
                    Списано
                  </p>
                  <p className="mt-1 text-[22px] font-black text-[#111] [font-family:var(--font-unbounded)]">
                    {formatCoinsLabel(order.total)}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="grid gap-3">
                  {order.items.map((item) => {
                    const product = productsBySlug.get(item.productSlug);

                    if (!product) {
                      return null;
                    }

                    return (
                      <Link
                        key={`${order.id}-${product.slug}-${item.size}`}
                        href={`/merch/${product.slug}`}
                        className="grid gap-3 rounded-[16px] border border-[#eeeeee] bg-[#fbfbfb] p-3 transition hover:border-[#8B3DFF] sm:grid-cols-[82px_minmax(0,1fr)_auto] sm:items-center"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-[12px] bg-white">
                          <Image
                            src={product.imageSrc}
                            alt=""
                            fill
                            sizes="82px"
                            className="object-contain p-2"
                            unoptimized
                          />
                        </div>
                        <div>
                          <p className="text-[18px] font-black text-[#111] [font-family:var(--font-unbounded)]">
                            {product.title}
                          </p>
                          <p className="mt-1 text-[14px] font-semibold text-[#666] [font-family:var(--font-montserrat-alt)]">
                            Размер: {item.size}
                          </p>
                        </div>
                        <p className="text-[16px] font-black text-[#111] [font-family:var(--font-unbounded)]">
                          {formatCoinsLabel(product.price * item.quantity)}
                        </p>
                      </Link>
                    );
                  })}
                </div>

                <aside className="rounded-[18px] bg-[#f7f7f7] p-4">
                  <h3 className="text-[18px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">
                    Статус
                  </h3>
                  <div className="mt-4 grid gap-3">
                    {order.timeline.map((event, index) => {
                      const eventTheme = getOrderStatusTheme(event);

                      return (
                      <div key={event} className="flex gap-3">
                        <span className={`mt-1 grid size-6 shrink-0 place-items-center rounded-full ${eventTheme.solid} text-[11px] font-black text-white [font-family:var(--font-unbounded)]`}>
                          {index + 1}
                        </span>
                        <p className={`text-[14px] font-bold leading-[1.35] ${eventTheme.text} [font-family:var(--font-montserrat-alt)]`}>
                          {event}
                        </p>
                      </div>
                      );
                    })}
                  </div>
                </aside>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function getOrderStatusTheme(status: string) {
  if (status === "Готов к выдаче") {
    return {
      text: "text-[#7A9411]",
      soft: "bg-[#F7FBE8]",
      solid: "bg-[#B8CB2F]",
      border: "border-[#D6E779]",
    };
  }

  if (status === "Получен") {
    return {
      text: "text-[#335EC8]",
      soft: "bg-[#EEF5FF]",
      solid: "bg-[#335EC8]",
      border: "border-[#AFC9EE]",
    };
  }

  return {
    text: "text-[#E82E78]",
    soft: "bg-[#FFF0F6]",
    solid: "bg-[#FF3E80]",
    border: "border-[#F7B7D4]",
  };
}
