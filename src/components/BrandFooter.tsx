type BrandFooterProps = {
  className?: string;
};

export default function BrandFooter({ className }: BrandFooterProps) {
  const resolvedClassName = [
    "border-t border-[#C7B8F1] bg-white",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <footer className={resolvedClassName}>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-6 md:flex-row md:items-center md:px-8">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="block size-12 bg-[#FF3E80] [mask:url('/pattern__square_flowers.png')_center/contain_no-repeat] [-webkit-mask:url('/pattern__square_flowers.png')_center/contain_no-repeat]"
            />
            <p className="text-[13px] font-bold leading-[1.05] text-[#1f1f1f] [font-family:var(--font-montserrat-alt)]">
              создано с
              <br />
              росмолодежью
            </p>
          </div>

          <span className="hidden h-12 w-px bg-[#cfcfcf] sm:block" aria-hidden="true" />

          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="block h-14 w-8 bg-[#F2C94C] [mask:url('/osu_logo.png')_center/contain_no-repeat] [-webkit-mask:url('/osu_logo.png')_center/contain_no-repeat]"
            />
            <p className="max-w-[170px] text-[12px] font-bold uppercase leading-[1.1] text-[#1f1f1f] [font-family:var(--font-montserrat-alt)]">
              Оренбургский государственный университет
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
