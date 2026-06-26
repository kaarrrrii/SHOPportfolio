"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { authorizeByCredentials, useEsdirAuthRole } from "@/shared/lib/auth";
import { formatCoins, formatCoinsLabel } from "@/shared/lib/format";
import { getStudentBySlug, type Order, type Product } from "@/shared/data/mock";
import { useMerchProducts } from "@/shared/lib/merch";
import { useOrderHistory } from "@/shared/lib/shop";
import { useWalletBalance } from "@/shared/lib/wallet";

const profileStudent = getStudentBySlug("smirnova-anna") ?? {
  name: "Смирнова Анна Андреевна",
  faculty: "Архитектурно-строительный факультет",
  group: "24АС-1",
  coins: 450,
  totalEarnedPoints: 450,
  achievements: [
    "Оформила навигацию для форума",
    "Собрала серию афиш",
    "Помогла с фотозоной проекта",
  ],
};

const achievementPoints = [180, 150, 120];

export default function AccountWidget() {
  const router = useRouter();
  const authRole = useEsdirAuthRole();
  const { balance } = useWalletBalance();
  const { orders } = useOrderHistory();
  const { products } = useMerchProducts();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const productsBySlug = useMemo(
    () => new Map(products.map((product) => [product.slug, product])),
    [products],
  );
  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders],
  );
  const achievements = profileStudent.achievements.map((title, index) => ({
    title,
    points: achievementPoints[index] ?? 50,
  }));

  useEffect(() => {
    if (authRole === "admin") {
      router.replace("/admin/merch");
    }
  }, [authRole, router]);

  function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const role = authorizeByCredentials(login, password);

    if (!role) {
      setLoginError("Неверный логин или пароль");
      return;
    }

    setLoginError("");

    if (role === "admin") {
      router.replace("/admin/merch");
    }
  }

  if (!authRole) {
    return (
      <main className="login-page bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
          <section className="mx-auto max-w-[760px] rounded-[24px] bg-white p-6 text-center shadow-[0_12px_34px_rgba(0,0,0,0.08)] md:p-10">
            <p className="text-[15px] font-black uppercase text-[#7B5BC8] [font-family:var(--font-montserrat-alt)]">
              Авторизация
            </p>
            <h1 className="mx-auto mt-3 max-w-[620px] text-[32px] font-black uppercase leading-[1.05] text-[#111] [font-family:var(--font-unbounded)] sm:text-[40px] md:text-[52px]">
              Вход
            </h1>
            <p className="mx-auto mt-5 max-w-[520px] text-[16px] font-semibold leading-[1.45] text-[#555] [font-family:var(--font-montserrat-alt)]">
              Войдите, чтобы покупать мерч и смотреть свои заказы.
            </p>
            <form onSubmit={handleLoginSubmit} className="mx-auto mt-7 grid max-w-[420px] gap-4 text-left">
              <label className="grid gap-2 text-[13px] font-black uppercase text-[#555] [font-family:var(--font-montserrat-alt)]">
                Логин
                <input
                  value={login}
                  onChange={(event) => setLogin(event.target.value)}
                  autoComplete="username"
                  className="h-12 rounded-[10px] border border-[#dedede] bg-[#fbfbfb] px-4 text-[15px] font-bold normal-case text-[#111] outline-none transition focus:border-[#7B5BC8] focus:bg-white [font-family:var(--font-montserrat-alt)]"
                />
              </label>
              <label className="grid gap-2 text-[13px] font-black uppercase text-[#555] [font-family:var(--font-montserrat-alt)]">
                Пароль
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  className="h-12 rounded-[10px] border border-[#dedede] bg-[#fbfbfb] px-4 text-[15px] font-bold normal-case text-[#111] outline-none transition focus:border-[#7B5BC8] focus:bg-white [font-family:var(--font-montserrat-alt)]"
                />
              </label>
              {loginError ? (
                <p className="rounded-[10px] bg-[#FFF0F6] px-4 py-3 text-[13px] font-black text-[#E82E78] [font-family:var(--font-montserrat-alt)]">
                  {loginError}
                </p>
              ) : null}
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-[#FF3E80] px-6 py-3 text-[15px] font-black text-white shadow-[0_10px_22px_rgba(255,62,128,0.26)] transition hover:bg-[#E82E78] [font-family:var(--font-montserrat-alt)]"
              >
                Войти
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  if (authRole === "admin") {
    return null;
  }

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
        <section className="overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_12px_34px_rgba(0,0,0,0.08)] md:p-8">
          <p className="text-[15px] font-black uppercase text-[#7B5BC8] [font-family:var(--font-montserrat-alt)]">
            Личный кабинет
          </p>
          <h1 className="mt-3 max-w-[980px] text-[38px] font-black uppercase leading-[0.98] text-[#111] [font-family:var(--font-unbounded)] md:text-[68px]">
            {profileStudent.name}
          </h1>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/orders"
              className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#d8d8d8] bg-white px-6 text-[15px] font-black text-[#111] transition hover:border-[#22A7C7] hover:text-[#1688A3] [font-family:var(--font-montserrat-alt)]"
            >
              Мои заказы
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px_240px]">
            <div className="rounded-[18px] bg-[#F2FCFF] p-5">
              <p className="text-[13px] font-black uppercase text-[#777] [font-family:var(--font-montserrat-alt)]">
                Группа
              </p>
              <p className="mt-2 text-[28px] font-black text-[#111] [font-family:var(--font-unbounded)]">
                {profileStudent.group}
              </p>
              <p className="mt-3 text-[15px] font-semibold leading-[1.35] text-[#555] [font-family:var(--font-montserrat-alt)]">
                {profileStudent.faculty}
              </p>
            </div>

            <div className="rounded-[18px] bg-[#F7FBE8] p-5">
              <p className="text-[13px] font-black uppercase text-[#7A9411] [font-family:var(--font-montserrat-alt)]">
                Баланс
              </p>
              <p className="mt-2 text-[28px] font-black text-[#111] [font-family:var(--font-unbounded)]">
                {formatCoins(balance)}
              </p>
              <p className="mt-2 text-[14px] font-bold text-[#7A9411] [font-family:var(--font-montserrat-alt)]">
                доступно для мерча
              </p>
            </div>

            <div className="rounded-[18px] bg-[#FFF0F6] p-5">
              <p className="text-[13px] font-black uppercase text-[#E82E78] [font-family:var(--font-montserrat-alt)]">
                Списано
              </p>
              <p className="mt-2 text-[28px] font-black text-[#111] [font-family:var(--font-unbounded)]">
                {formatCoins(totalSpent)}
              </p>
              <p className="mt-2 text-[14px] font-bold text-[#E82E78] [font-family:var(--font-montserrat-alt)]">
                по заказам мерча
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[24px] bg-white p-6 shadow-[0_12px_34px_rgba(0,0,0,0.08)] md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[14px] font-black uppercase text-[#E82E78] [font-family:var(--font-montserrat-alt)]">
                Монетки
              </p>
              <h2 className="mt-2 text-[30px] font-black uppercase leading-tight text-[#111] [font-family:var(--font-unbounded)] md:text-[44px]">
                Списания
              </h2>
            </div>
            <p className="rounded-full bg-[#FFF0F6] px-5 py-2 text-[14px] font-black text-[#E82E78] [font-family:var(--font-montserrat-alt)]">
              Всего: {formatCoinsLabel(totalSpent)}
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {orders.length > 0 ? (
              orders.map((order) => (
                <SpendingRow
                  key={order.id}
                  order={order}
                  productsBySlug={productsBySlug}
                />
              ))
            ) : (
              <div className="rounded-[18px] border border-dashed border-[#d8d8d8] bg-[#fafafa] p-6 text-center">
                <p className="text-[18px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">
                  Списаний пока нет
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[24px] bg-white p-6 shadow-[0_12px_34px_rgba(0,0,0,0.08)] md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[14px] font-black uppercase text-[#8A5A00] [font-family:var(--font-montserrat-alt)]">
                Начисления
              </p>
              <h2 className="mt-2 text-[30px] font-black uppercase leading-tight text-[#111] [font-family:var(--font-unbounded)] md:text-[44px]">
                Достижения студента
              </h2>
            </div>
            <p className="rounded-full bg-[#FFF8DE] px-5 py-2 text-[14px] font-black text-[#8A5A00] [font-family:var(--font-montserrat-alt)]">
              Всего: {formatCoinsLabel(profileStudent.coins)}
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {achievements.map((achievement, index) => (
              <article
                key={achievement.title}
                className="grid gap-4 rounded-[18px] border border-[#eeeeee] bg-[#fbfbfb] p-4 sm:grid-cols-[64px_minmax(0,1fr)_120px] sm:items-center"
              >
                <span
                  aria-hidden="true"
                  className={`block size-12 ${
                    ["bg-[#FF3E80]", "bg-[#F2C94C]", "bg-[#22A7C7]", "bg-[#7B5BC8]"][index % 4]
                  } [mask:url('/pattern__square_flowers.png')_center/contain_no-repeat] [-webkit-mask:url('/pattern__square_flowers.png')_center/contain_no-repeat]`}
                />
                <div>
                  <h3 className="text-[18px] font-black leading-[1.2] text-[#111] [font-family:var(--font-montserrat-alt)]">
                    {achievement.title}
                  </h3>
                  <p className="mt-1 text-[14px] font-semibold text-[#666] [font-family:var(--font-montserrat-alt)]">
                    Баллы начислены за вклад в проект и участие в активности.
                  </p>
                </div>
                <p className="text-left text-[22px] font-black text-[#111] [font-family:var(--font-unbounded)] sm:text-right">
                  +{formatCoins(achievement.points)}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

type ProductLookup = Map<string, Product>;

type SpendingRowProps = {
  order: Order;
  productsBySlug: ProductLookup;
};

function SpendingRow({ order, productsBySlug }: SpendingRowProps) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const productSummary = getOrderProductSummary(order, productsBySlug);

  return (
    <article className="grid min-w-0 gap-4 rounded-[18px] border border-[#F6CADC] bg-[#FFF8FB] p-4 sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:items-center">
      <div className="grid size-12 place-items-center rounded-[14px] bg-white text-[24px] font-black text-[#E82E78] shadow-[inset_0_0_0_1px_rgba(232,46,120,0.18)] [font-family:var(--font-unbounded)]">
        -
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="break-words text-[18px] font-black text-[#111] [font-family:var(--font-montserrat-alt)]">
            Списание за мерч
          </h3>
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase text-[#E82E78] [font-family:var(--font-montserrat-alt)]">
            {order.status}
          </span>
        </div>
        <p className="mt-2 break-words text-[14px] font-semibold text-[#555] [font-family:var(--font-montserrat-alt)]">
          {productSummary}
        </p>
        <p className="mt-1 text-[13px] font-bold text-[#8A6171] [font-family:var(--font-montserrat-alt)]">
          {order.createdAt} · {formatOrderItemCount(itemCount)} · {order.id}
        </p>
      </div>
      <p className="inline-flex min-h-12 items-center justify-start rounded-[12px] bg-white px-4 text-left text-[20px] font-black text-[#111] shadow-[inset_0_0_0_1px_rgba(232,46,120,0.16)] [font-family:var(--font-unbounded)] sm:justify-center sm:text-right">
        -{formatCoinsLabel(order.total)}
      </p>
    </article>
  );
}

function getOrderProductSummary(order: Order, productsBySlug: ProductLookup) {
  const titles = order.items.map((item) => productsBySlug.get(item.productSlug)?.title || "Товар удален");
  const visibleTitles = titles.slice(0, 2);
  const hiddenCount = titles.length - visibleTitles.length;

  if (visibleTitles.length === 0) {
    return "Мерч проекта";
  }

  if (hiddenCount > 0) {
    return `${visibleTitles.join(", ")} и еще ${hiddenCount}`;
  }

  return visibleTitles.join(", ");
}

function formatOrderItemCount(count: number) {
  return `${count} шт.`;
}
