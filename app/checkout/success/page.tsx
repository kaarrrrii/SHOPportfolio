import BrandFooter from "@/components/BrandFooter";
import Header from "@/components/Header";
import CheckoutSuccessWidget from "@/widgets/CheckoutSuccessWidget";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string | string[] }>;
}) {
  const params = await searchParams;
  const orderId = Array.isArray(params.order) ? params.order[0] : params.order;

  return (
    <>
      <Header />
      <CheckoutSuccessWidget orderId={orderId} />
      <BrandFooter />
    </>
  );
}
