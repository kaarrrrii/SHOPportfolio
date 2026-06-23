import Link from "next/link";

export default function AdminFooter() {
  return (
    <footer className="border-t border-[#FF3F9F] bg-white text-[#1f1f1f]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-6 text-[13px] font-bold [font-family:var(--font-montserrat-alt)] sm:px-5 md:flex-row md:items-center md:justify-between md:px-8">
        <p>Панель администратора</p>
        <div className="grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
          <Link href="/admin/merch" className="text-[#FF3F9F] transition hover:text-[#FF3F9F]">
            Управление товарами
          </Link>
          <Link href="/admin/orders" className="text-[#7A9411] transition hover:text-[#9AC225]">
            Выдача заказов
          </Link>
          <Link href="/admin/showcase" className="text-[#967DD1] transition hover:text-[#967DD1]">
            Витрина
          </Link>
        </div>
      </div>
    </footer>
  );
}
