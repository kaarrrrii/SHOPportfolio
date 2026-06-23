import MerchHero from "@/components/MerchHero";
import MerchCatalogWidget from "@/widgets/MerchCatalogWidget";

export default function AdminShowcasePage() {
  return (
    <>
      <MerchHero />
      <MerchCatalogWidget productHrefBase="/admin/showcase" />
    </>
  );
}
