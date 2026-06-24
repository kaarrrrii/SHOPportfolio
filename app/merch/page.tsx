import BrandFooter from "@/components/BrandFooter";
import Header from "@/components/Header";
import MerchHero from "@/components/MerchHero";
import MerchCatalogWidget from "@/widgets/MerchCatalogWidget";

export default function MerchPage() {
  return (
    <>
      <Header />
      <main className="merch-page bg-white">
        <MerchHero />
        <MerchCatalogWidget />
      </main>
      <BrandFooter />
    </>
  );
}
