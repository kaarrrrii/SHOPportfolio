"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authorizeAdminDemo, authorizeEsdirDemo, useEsdirAuthRole } from "@/shared/lib/auth";
import { formatCoins } from "@/shared/lib/format";
import { getStudentBySlug } from "@/shared/data/mock";

const profileStudent = getStudentBySlug("smirnova-anna") ?? {
  name: "Смирнова Анна Андреевна",
  faculty: "Архитектурно-строительный факультет",
  group: "24АС-1",
  coins: 450,
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
  const achievements = profileStudent.achievements.map((title, index) => ({
    title,
    points: achievementPoints[index] ?? 50,
  }));

  function handleStudentDemoLogin() {
    authorizeEsdirDemo();
  }

  function handleAdminDemoLogin() {
    authorizeAdminDemo();
    router.push("/admin/merch");
  }

  if (!authRole) {
    return (
      <main className="bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
          <section className="mx-auto max-w-[760px] rounded-[24px] bg-white p-6 text-center shadow-[0_12px_34px_rgba(0,0,0,0.08)] md:p-10">
            <p className="text-[15px] font-black uppercase text-[#7B5BC8] [font-family:var(--font-montserrat-alt)]">
              Авторизация
            </p>
            <h1 className="mx-auto mt-3 max-w-[620px] text-[32px] font-black uppercase leading-[1.05] text-[#111] [font-family:var(--font-unbounded)] sm:text-[40px] md:text-[52px]">
              Выберите роль
            </h1>
            <p className="mx-auto mt-5 max-w-[520px] text-[16px] font-semibold leading-[1.45] text-[#555] [font-family:var(--font-montserrat-alt)]">
              Студенты покупают мерч и смотрят свои заказы, администратор управляет товарами и выдачей.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleStudentDemoLogin}
                className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-[#FF3E80] px-6 py-3 text-[15px] font-black text-white shadow-[0_10px_22px_rgba(255,62,128,0.26)] transition hover:bg-[#E82E78] [font-family:var(--font-montserrat-alt)]"
              >
                Войти как студент
              </button>
              <button
                type="button"
                onClick={handleAdminDemoLogin}
                className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-[#335EC8] px-6 py-3 text-[15px] font-black text-white shadow-[0_10px_22px_rgba(51,94,200,0.22)] transition hover:bg-[#244CA8] [font-family:var(--font-montserrat-alt)]"
              >
                Войти как администратор
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (authRole === "admin") {
    return (
      <main className="bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
          <section className="mx-auto max-w-[760px] rounded-[24px] bg-white p-6 text-center shadow-[0_12px_34px_rgba(0,0,0,0.08)] md:p-10">
            <p className="text-[15px] font-black uppercase text-[#335EC8] [font-family:var(--font-montserrat-alt)]">
              Администратор
            </p>
            <h1 className="mx-auto mt-3 max-w-[620px] text-[32px] font-black uppercase leading-[1.05] text-[#111] [font-family:var(--font-unbounded)] sm:text-[40px] md:text-[52px]">
              Панель управления вынесена отдельно
            </h1>
            <Link
              href="/admin/merch"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[10px] bg-[#335EC8] px-6 py-3 text-[15px] font-black text-white shadow-[0_10px_22px_rgba(51,94,200,0.22)] transition hover:bg-[#244CA8] [font-family:var(--font-montserrat-alt)]"
            >
              Открыть админку
            </Link>
          </section>
        </div>
      </main>
    );
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

          <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
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
                Начислено
              </p>
              <p className="mt-2 text-[28px] font-black text-[#111] [font-family:var(--font-unbounded)]">
                {formatCoins(profileStudent.coins)}
              </p>
              <p className="mt-2 text-[14px] font-bold text-[#7A9411] [font-family:var(--font-montserrat-alt)]">
                баллов за активность
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[24px] bg-white p-6 shadow-[0_12px_34px_rgba(0,0,0,0.08)] md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[14px] font-black uppercase text-[#335EC8] [font-family:var(--font-montserrat-alt)]">
                Начисления
              </p>
              <h2 className="mt-2 text-[30px] font-black uppercase leading-tight text-[#111] [font-family:var(--font-unbounded)] md:text-[44px]">
                Достижения студента
              </h2>
            </div>
            <p className="rounded-full bg-[#EEF5FF] px-5 py-2 text-[14px] font-black text-[#335EC8] [font-family:var(--font-montserrat-alt)]">
              Всего: {formatCoins(profileStudent.coins)} баллов
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
                    ["bg-[#FF3E80]", "bg-[#335EC8]", "bg-[#22A7C7]", "bg-[#7B5BC8]"][index % 4]
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
