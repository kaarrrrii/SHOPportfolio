import BrandFooter from "@/components/BrandFooter";
import Header from "@/components/Header";
import CartWidget from "@/widgets/CartWidget";

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <CartWidget />
      </div>
      <BrandFooter />
    </div>
  );
}
