import Image from "next/image";
import IconSquareButton from "@/widgets/IconSquareButton";

type MerchProductCardProps = {
  title: string;
  description: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  imageClassName?: string;
};

export default function MerchProductCard({
  title,
  description,
  price,
  imageSrc,
  imageAlt,
  imageClassName,
}: MerchProductCardProps) {
  return (
    <article className="flex min-h-[190px] gap-3 rounded-[14px] p-3 shadow-[0_4px_12px_rgba(0,0,0,0.14)]">
      <MerchCardMedia src={imageSrc} alt={imageAlt} className={imageClassName} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MerchCardContent title={title} description={description} />
        <MerchCardPurchase price={price} />
      </div>
    </article>
  );
}

type MerchCardMediaProps = {
  src: string;
  alt: string;
  className?: string;
};

function MerchCardMedia({ src, alt, className }: MerchCardMediaProps) {
  const resolvedClassName = ["object-contain", className].filter(Boolean).join(" ");

  return (
    <div className="flex w-[35%] min-w-[92px] items-center justify-center">
      <Image
        src={src}
        alt={alt}
        width={148}
        height={148}
        sizes="148px"
        className={resolvedClassName}
        unoptimized
      />
    </div>
  );
}

type MerchCardContentProps = {
  title: string;
  description: string;
};

function MerchCardContent({ title, description }: MerchCardContentProps) {
  return (
    <div className="min-w-0">
      <h3 className="text-[20px] font-black leading-[0.95] text-[#1b1b1b] [font-family:var(--font-unbounded)]">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-[1.35] text-[#454545] [font-family:var(--font-montserrat-alt)]">
        {description}
      </p>
    </div>
  );
}

type MerchCardPurchaseProps = {
  price: string;
};

function MerchCardPurchase({ price }: MerchCardPurchaseProps) {
  return (
    <div className="mt-auto flex items-end justify-between gap-2 pt-4">
      <p className="whitespace-nowrap text-[22px] font-black leading-none text-[#1b1b1b] [font-family:var(--font-unbounded)]">
        {price}
        <span className="ml-1 text-[14px] font-semibold text-[#707070] [font-family:var(--font-montserrat-alt)]">
          монеток
        </span>
      </p>

      <IconSquareButton icon={<CartIcon />} ariaLabel="Добавить в корзину" />
    </div>
  );
}

function CartIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 4H5.5L7.1 14.4H18.7L20.3 7.2H7.6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.6" cy="18.2" r="1.4" fill="currentColor" />
      <circle cx="16.9" cy="18.2" r="1.4" fill="currentColor" />
    </svg>
  );
}
