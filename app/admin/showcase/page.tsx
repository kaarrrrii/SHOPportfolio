import MerchHero from "@/components/MerchHero";
import MerchCatalogWidget from "@/widgets/MerchCatalogWidget";

export default function AdminShowcasePage() {
  return (
    <main className="admin-page bg-white">
      <MerchHero />
      <MerchCatalogWidget productHrefBase="/admin/showcase" />
    </main>
  );
}
