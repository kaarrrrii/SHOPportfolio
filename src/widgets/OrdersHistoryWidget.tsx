"use client";

import Link from "next/link";
import { useMemo } from "react";
import MerchImage from "@/components/MerchImage";
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
        <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
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
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[42px] font-black uppercase leading-[0.95] text-[#111] [font-family:var(--font-unbounded)] md:text-[70px]">
              История заказов
            </h1>
            <p className="mt-3 max-w-[700px] text-[17px] font-semibold leading-[1.4] text-[#555] [font-family:var(--font-montserrat-alt)]">
              Лента заказов показывает статусы, состав и место выдачи.
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          {orders.map((order) => {
            const statusTheme = getOrderStatusTheme(order.status);

            return (
            <article
              key={order.id}
              className={`overflow-hidden rounded-[22px] border ${statusTheme.border} bg-white p-4 shadow-[0_12px_34px_rgba(0,0,0,0.08)] sm:p-5`}
            >
              <div className={`rounded-[16px] ${statusTheme.soft} p-3 sm:p-4`}>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex min-h-9 items-center rounded-full px-4 py-2 text-[13px] font-black [font-family:var(--font-montserrat-alt)] ${statusTheme.solid} ${statusTheme.labelText}`}>
                      {order.status}
                    </span>
                    <OrderMetaPill label="Дата" value={order.createdAt} />
                    <OrderMetaPill label="Выдача" value={order.pickup} />
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-[12px] bg-white px-4 py-3 shadow-[0_4px_14px_rgba(0,0,0,0.05)] lg:min-w-[220px]">
                    <span className="text-[12px] font-black uppercase text-[#777] [font-family:var(--font-montserrat-alt)]">
                      Списано
                    </span>
                    <strong className="text-right text-[17px] font-black text-[#111] [font-family:var(--font-unbounded)]">
                      {formatCoinsLabel(order.total)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {order.items.map((item) => {
                  const product = productsBySlug.get(item.productSlug);

                  return (
                    <Link
                      key={`${order.id}-${item.productSlug}-${item.size}`}
                      href={`/merch/${item.productSlug}`}
                      className="grid min-w-0 gap-3 rounded-[16px] border border-[#eeeeee] bg-[#fbfbfb] p-3 transition hover:border-[#8B3DFF] sm:grid-cols-[74px_minmax(0,1fr)_minmax(110px,auto)] sm:items-center"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-[12px] bg-white">
                        {product ? (
                          <MerchImage
                            src={product.imageSrc}
                            alt=""
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="grid h-full place-items-center whitespace-nowrap bg-[#FFF0F6] px-1 text-center text-[9px] font-black uppercase leading-none text-[#E82E78] [font-family:var(--font-montserrat-alt)] sm:text-[10px]">
                            Нет в каталоге
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[17px] font-black text-[#111] [font-family:var(--font-unbounded)]">
                          {product?.title || "Товар больше недоступен"}
                        </p>
                        <p className="mt-1 text-[14px] font-semibold text-[#666] [font-family:var(--font-montserrat-alt)]">
                          Размер: {item.size} · {item.quantity} шт.
                        </p>
                      </div>
                      <p className="text-left text-[16px] font-black text-[#111] [font-family:var(--font-unbounded)] sm:text-right">
                        {product ? formatCoinsLabel(product.price * item.quantity) : "Архив"}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

type OrderMetaPillProps = {
  label: string;
  value: string;
};

function OrderMetaPill({ label, value }: OrderMetaPillProps) {
  return (
    <span className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-full bg-white px-3 py-2 text-[12px] font-black text-[#111] shadow-[0_4px_14px_rgba(0,0,0,0.04)] [font-family:var(--font-montserrat-alt)]">
      <span className="shrink-0 uppercase text-[#777]">{label}</span>
      <span className="min-w-0 truncate">{value}</span>
    </span>
  );
}

function getOrderStatusTheme(status: string) {
  if (status === "Готов к выдаче") {
    return {
      text: "text-[#7A9411]",
      soft: "bg-[#F7FBE8]",
      solid: "bg-[#B8CB2F]",
      border: "border-[#D6E779]",
      labelText: "text-[#111]",
    };
  }

  if (status === "Получен") {
    return {
      text: "text-[#8A5A00]",
      soft: "bg-[#FFF8DE]",
      solid: "bg-[#F2C94C]",
      border: "border-[#F4D98B]",
      labelText: "text-[#111]",
    };
  }

  return {
    text: "text-[#E82E78]",
    soft: "bg-[#FFF0F6]",
    solid: "bg-[#FF3E80]",
    border: "border-[#F7B7D4]",
    labelText: "text-white",
  };
}
