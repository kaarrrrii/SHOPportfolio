"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Student } from "@/shared/data/mock";
import { formatCoins } from "@/shared/lib/format";

type TopStudentsWidgetProps = {
  students: Student[];
};

const INITIAL_VISIBLE_COUNT = 10;
const LOAD_STEP = 10;
const MAX_VISIBLE_COUNT = 100;

const rowTheme = {
  blue: {
    stripe: "bg-[#335EC8]",
    border: "border-[#AFC9EE]",
    background: "bg-[#F4FAFF]",
    text: "text-[#335EC8]",
    score: "bg-[#335EC8]",
  },
  green: {
    stripe: "bg-[#B8CB2F]",
    border: "border-[#DCE88D]",
    background: "bg-[#FCFFF3]",
    text: "text-[#AFC425]",
    score: "bg-[#B8CB2F]",
  },
  pink: {
    stripe: "bg-[#FF3E80]",
    border: "border-[#F4B8D3]",
    background: "bg-[#FFF5FA]",
    text: "text-[#E83F82]",
    score: "bg-[#FF3E80]",
  },
  orange: {
    stripe: "bg-[#FF7A00]",
    border: "border-[#FFC18B]",
    background: "bg-[#FFFAF5]",
    text: "text-[#E45F00]",
    score: "bg-[#FF7A00]",
  },
  cyan: {
    stripe: "bg-[#22A7C7]",
    border: "border-[#9ADDEB]",
    background: "bg-[#F2FCFF]",
    text: "text-[#1688A3]",
    score: "bg-[#22A7C7]",
  },
  violet: {
    stripe: "bg-[#7B5BC8]",
    border: "border-[#C7B8F1]",
    background: "bg-[#F8F5FF]",
    text: "text-[#6A4FAD]",
    score: "bg-[#7B5BC8]",
  },
} as const;

type RowThemeName = keyof typeof rowTheme;

const regularThemeOrder: RowThemeName[] = ["blue", "green", "orange", "cyan", "violet", "pink"];

export default function TopStudentsWidget({ students }: TopStudentsWidgetProps) {
  const maxVisibleCount = Math.min(students.length, MAX_VISIBLE_COUNT);
  const [visibleCount, setVisibleCount] = useState(Math.min(INITIAL_VISIBLE_COUNT, maxVisibleCount));
  const visibleStudents = useMemo(() => students.slice(0, visibleCount), [students, visibleCount]);
  const canLoadMore = visibleCount < maxVisibleCount;

  function handleLoadMore() {
    setVisibleCount((currentCount) => Math.min(currentCount + LOAD_STEP, maxVisibleCount));
  }

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-[1120px] px-5 pb-8 pt-12 text-center md:px-8 md:pb-10 md:pt-16">
        <h1 className="mx-auto max-w-[760px] text-[58px] font-black uppercase leading-[0.9] tracking-normal text-black [font-family:var(--font-unbounded)] md:text-[92px]">
          Топ
          <br />
          студентов
        </h1>
        <p className="mx-auto mt-6 max-w-[680px] text-[17px] font-semibold leading-[1.45] text-[#303030] [font-family:var(--font-montserrat-alt)] md:text-[20px]">
          Рейтинг самых активных студентов проекта «Зажигай». Участвуй в мероприятиях, предлагай идеи и зарабатывай монетки!
        </p>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 pb-14 md:px-8">
        <div className="grid gap-3">
          {visibleStudents.map((student) => (
            <RatingRow key={student.slug} student={student} />
          ))}
        </div>

        {canLoadMore ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="inline-flex h-14 min-w-[230px] items-center justify-center rounded-[14px] bg-[#335EC8] px-8 text-[17px] font-black text-white shadow-[0_10px_20px_rgba(51,94,200,0.2)] transition hover:-translate-y-0.5 hover:bg-[#244CA8] [font-family:var(--font-montserrat-alt)]"
            >
              Показать ещё
            </button>
          </div>
        ) : null}

        <p className="mt-9 text-center text-[26px] font-semibold leading-tight text-[#335EC8] [font-family:var(--font-montserrat-alt)]">
          Движемся вместе к вершине!
        </p>
      </section>
    </main>
  );
}

type RatingRowProps = {
  student: Student;
};

function RatingRow({ student }: RatingRowProps) {
  const isTopThree = student.rank <= 3;
  const themeName = getRowThemeName(student.rank);
  const theme = rowTheme[themeName];

  return (
    <Link
      href={`/top/${student.slug}`}
      className={`grid min-h-[84px] grid-cols-[20px_74px_minmax(0,1fr)] items-center overflow-hidden rounded-[8px] border bg-white shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] md:grid-cols-[28px_124px_124px_minmax(0,1fr)_164px_74px_94px] ${
        isTopThree ? `${theme.border} ${theme.background} min-h-[112px]` : `${theme.border} ${theme.background}`
      }`}
    >
      <span className={`h-full w-full ${theme.stripe}`} aria-hidden="true" />

      <span className={`px-4 text-left font-black leading-none ${theme.text} [font-family:var(--font-unbounded)] ${isTopThree ? "text-[50px] md:text-[62px]" : "text-[28px] md:text-[34px]"}`}>
        {student.rank}
      </span>

      <DecorCell colorClass={theme.text} isLarge={isTopThree} variant="rhombuses" />

      <span className={`min-w-0 px-4 text-left font-black text-[#111] [font-family:var(--font-montserrat-alt)] ${
        isTopThree ? "text-[20px] md:text-[25px]" : "text-[16px] md:text-[19px]"
      }`}>
        <span className="block truncate">{student.name}</span>
      </span>

      <span className={`mx-3 hidden min-w-[136px] rounded-[10px] px-4 py-2 text-center font-black leading-none text-white [font-family:var(--font-unbounded)] md:block ${
        isTopThree ? `${theme.score} text-[25px]` : `${theme.score} text-[20px]`
      }`}>
        {formatCoins(student.coins)}
      </span>

      <span className="hidden text-left text-[12px] font-black uppercase text-[#111] [font-family:var(--font-montserrat-alt)] md:block">
        монет
      </span>

      <DecorCell colorClass={theme.text} alignRight variant="flowers" />

      <span className={`col-span-2 col-start-2 px-4 pb-4 text-left text-[14px] font-black ${theme.text} [font-family:var(--font-unbounded)] md:hidden`}>
        {formatCoins(student.coins)} монет
      </span>
    </Link>
  );
}

function getRowThemeName(rank: number): RowThemeName {
  if (rank === 1) {
    return "blue";
  }

  if (rank === 2) {
    return "green";
  }

  if (rank === 3) {
    return "pink";
  }

  return regularThemeOrder[(rank - 1) % regularThemeOrder.length];
}

type DecorCellProps = {
  colorClass: string;
  isLarge?: boolean;
  alignRight?: boolean;
  variant: "flowers" | "rhombuses";
};

function DecorCell({ colorClass, isLarge = false, alignRight = false, variant }: DecorCellProps) {
  const maskClass =
    variant === "flowers"
      ? "[mask-image:url('/pattern__square_flowers.png')] [-webkit-mask-image:url('/pattern__square_flowers.png')]"
      : "[mask-image:url('/pattern__square_rhombuses.png')] [-webkit-mask-image:url('/pattern__square_rhombuses.png')]";

  return (
    <span className={`hidden md:flex ${alignRight ? "justify-center" : "justify-start"} ${colorClass}`} aria-hidden="true">
      <span
        className={`${isLarge ? "size-[78px]" : "size-14"} bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain] ${maskClass}`}
      />
    </span>
  );
}
