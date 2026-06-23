"use client";

import Link from "next/link";
import { useMemo } from "react";
import CoinBadge from "@/components/CoinBadge";
import { formatCoinsLabel } from "@/shared/lib/format";
import { useMerchProducts } from "@/shared/lib/merch";
import { useOrderHistory } from "@/shared/lib/shop";

type CheckoutSuccessWidgetProps = {
  orderId?: string;
};

export default function CheckoutSuccessWidget({ orderId }: CheckoutSuccessWidgetProps) {
  const { orders, lastOrder } = useOrderHistory();
  const { products } = useMerchProducts();
  const productsBySlug = useMemo(
    () => new Map(products.map((product) => [product.slug, product])),
    [products],
  );
  const order = orderId ? orders.find((item) => item.id === orderId) || lastOrder : lastOrder;

  return (
    <main className="relative min-h-[calc(100vh-84px)] overflow-hidden bg-white">
      <section className="mx-auto flex max-w-[1440px] items-center justify-center px-5 py-16 md:px-8 md:py-24">
        <article className="relative isolate w-full max-w-[680px] overflow-hidden rounded-[28px] bg-white px-6 py-12 text-center shadow-[0_22px_60px_rgba(34,167,199,0.14)] md:px-14 md:py-16">
          <div className="relative z-10">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-[#9AC225] text-white shadow-[0_10px_24px_rgba(154,194,37,0.28)]">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M11 20.5L17.5 27L30 13" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h1 className="mx-auto mt-8 max-w-[420px] text-[34px] font-black leading-[1.02] text-[#111] [font-family:var(--font-unbounded)] md:text-[46px]">
              Заказ оформлен успешно!
            </h1>
            <p className="mx-auto mt-5 max-w-[430px] text-[17px] font-semibold leading-[1.45] text-[#555] [font-family:var(--font-montserrat-alt)]">
              Забрать заказ можно в профкоме, аудитория 17-10-11.
            </p>

            {order ? (
              <div className="mx-auto mt-6 max-w-[500px] border-y border-[#ececec] py-5 text-left">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[13px] font-black uppercase text-[#7B5BC8] [font-family:var(--font-montserrat-alt)]">
                      Заказ от {order.createdAt}
                    </p>
                    <p className="mt-1 text-[18px] font-black text-[#111] [font-family:var(--font-unbounded)]">
                      {order.status}
                    </p>
                  </div>
                  <p className="text-[18px] font-black text-[#111] [font-family:var(--font-unbounded)]">
                    {formatCoinsLabel(order.total)}
                  </p>
                </div>

                <div className="mt-4 grid gap-2">
                  {order.items.map((item) => {
                    const product = productsBySlug.get(item.productSlug);

                    if (!product) {
                      return null;
                    }

                    return (
                      <p
                        key={`${order.id}-${item.productSlug}-${item.size}`}
                        className="text-[14px] font-semibold leading-[1.35] text-[#555] [font-family:var(--font-montserrat-alt)]"
                      >
                        {product.title}: размер {item.size}
                      </p>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="mx-auto mt-6 h-px w-28 border-t-2 border-dashed border-[#22A7C7]" />

            <div className="mt-6 flex justify-center">
              <CoinBadge compact />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/orders"
                className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#335EC8] px-6 text-[15px] font-black text-white transition hover:bg-[#244CA8] [font-family:var(--font-montserrat-alt)]"
              >
                Смотреть историю
              </Link>
              <Link
                href="/merch"
                className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#d8d8d8] bg-white px-6 text-[15px] font-black text-[#111] transition hover:border-[#FF3E80] hover:text-[#E82E78] [font-family:var(--font-montserrat-alt)]"
              >
                Вернуться к мерчу
              </Link>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
