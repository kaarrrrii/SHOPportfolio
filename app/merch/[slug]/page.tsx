import BrandFooter from "@/components/BrandFooter";
import Header from "@/components/Header";
import { getProductBySlug, products } from "@/shared/data/mock";
import ProductProfileWidget from "@/widgets/ProductProfileWidget";

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug) || null;

  return (
    <>
      <Header />
      <ProductProfileWidget productSlug={slug} initialProduct={product} />
      <BrandFooter />
    </>
  );
}
