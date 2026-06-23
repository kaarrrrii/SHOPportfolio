import Link from "next/link";
import type { Student } from "@/shared/data/mock";
import { getStudentTotalPoints, students } from "@/shared/data/mock";
import { formatCoinsLabel } from "@/shared/lib/format";
import { accentStyles } from "@/shared/lib/theme";

type StudentProfileWidgetProps = {
  student: Student;
};

export default function StudentProfileWidget({ student }: StudentProfileWidgetProps) {
  const accent = accentStyles[student.accentColor];
  const rankTextSize = getRankTextSize(student.rank);
  const neighbor = students.find((item) => item.rank === student.rank + 1) || students[0];
  const totalPoints = getStudentTotalPoints(student);

  return (
    <main className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
        <Link
          href="/top"
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[14px] font-bold text-[#1f1f1f] shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition hover:text-[#335EC8] [font-family:var(--font-montserrat-alt)]"
        >
          <span aria-hidden="true">←</span>
          Назад в рейтинг
        </Link>

        <section className={`overflow-hidden rounded-[26px] border ${accent.border} bg-white shadow-[0_16px_42px_rgba(0,0,0,0.08)]`}>
          <div className={`${accent.soft} p-6 md:p-9`}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className={`text-[15px] font-black uppercase ${accent.text} [font-family:var(--font-montserrat-alt)]`}>
                  {student.status}
                </p>
                <h1 className="mt-3 max-w-[900px] text-[44px] font-black uppercase leading-[0.95] text-[#111] [font-family:var(--font-unbounded)] md:text-[74px]">
                  {student.name}
                </h1>
                <p className="mt-4 text-[17px] font-semibold text-[#555] [font-family:var(--font-montserrat-alt)]">
                  {student.faculty} · группа {student.group}
                </p>
              </div>
              <div className={`${accent.solid} flex h-28 min-w-[144px] items-center justify-center rounded-[24px] px-5 text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)]`}>
                <span className={`${rankTextSize} whitespace-nowrap font-black leading-none [font-family:var(--font-unbounded)]`}>
                  #{student.rank}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 md:p-9 lg:grid-cols-[minmax(0,1fr)_360px]">
            <article>
              <h2 className="text-[28px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">
                Профиль участника
              </h2>
              <p className="mt-4 text-[18px] font-semibold leading-[1.55] text-[#4d4d4d] [font-family:var(--font-montserrat-alt)]">
                {student.bio}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <StudentStat label="Событий" value={student.stats.events} />
                <StudentStat label="Идей" value={student.stats.ideas} />
                <StudentStat label="Волонтерских часов" value={student.stats.volunteerHours} />
              </div>

              <section className="mt-8">
                <h2 className="text-[24px] font-black uppercase text-[#111] [font-family:var(--font-unbounded)]">
                  Достижения
                </h2>
                <div className="mt-4 grid gap-3">
                  {student.achievements.map((achievement) => (
                    <div key={achievement} className="flex gap-3 rounded-[14px] bg-[#f7f7f7] p-4">
                      <span className={`${accent.solid} mt-1 size-3 shrink-0 rounded-full`} aria-hidden="true" />
                      <p className="text-[15px] font-semibold leading-[1.4] text-[#555] [font-family:var(--font-montserrat-alt)]">
                        {achievement}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </article>

            <aside className="rounded-[20px] bg-[#f7f7f7] p-5">
              <p className="text-[13px] font-black uppercase text-[#777] [font-family:var(--font-montserrat-alt)]">
                Баллы участника
              </p>
              <p className="mt-2 text-[34px] font-black text-[#111] [font-family:var(--font-unbounded)]">
                {formatCoinsLabel(totalPoints)}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {student.badges.map((badge) => (
                  <span key={badge} className={`${accent.soft} ${accent.text} rounded-full px-3 py-1.5 text-[12px] font-black [font-family:var(--font-montserrat-alt)]`}>
                    {badge}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-[14px] bg-white p-4">
                <p className="text-[13px] font-black uppercase text-[#777] [font-family:var(--font-montserrat-alt)]">
                  Последняя активность
                </p>
                <p className="mt-2 text-[15px] font-semibold leading-[1.35] text-[#444] [font-family:var(--font-montserrat-alt)]">
                  {student.lastActivity}
                </p>
              </div>

              <Link
                href={`/top/${neighbor.slug}`}
                className={`mt-5 inline-flex h-12 w-full items-center justify-center rounded-[10px] text-[15px] font-black text-white transition ${accent.button} [font-family:var(--font-montserrat-alt)]`}
              >
                Следующий участник
              </Link>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function getRankTextSize(rank: number) {
  if (rank >= 100) {
    return "text-[30px] md:text-[34px]";
  }

  if (rank >= 10) {
    return "text-[34px] md:text-[38px]";
  }

  return "text-[38px] md:text-[42px]";
}

type StudentStatProps = {
  label: string;
  value: number;
};

function StudentStat({ label, value }: StudentStatProps) {
  return (
    <div className="rounded-[16px] bg-[#f7f7f7] p-4">
      <p className="text-[30px] font-black text-[#111] [font-family:var(--font-unbounded)]">{value}</p>
      <p className="mt-1 text-[12px] font-black uppercase leading-[1.2] text-[#777] [font-family:var(--font-montserrat-alt)]">{label}</p>
    </div>
  );
}
