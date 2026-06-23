import { getProductBySlug, products } from "@/shared/data/mock";
import ProductProfileWidget from "@/widgets/ProductProfileWidget";

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function AdminShowcaseProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug) || null;

  return (
    <ProductProfileWidget
      productSlug={slug}
      initialProduct={product}
      catalogHref="/admin/showcase"
      productHrefBase="/admin/showcase"
    />
  );
}
