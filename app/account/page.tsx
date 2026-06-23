import BrandFooter from "@/components/BrandFooter";
import Header from "@/components/Header";
import AccountWidget from "@/widgets/AccountWidget";

export default function AccountPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <AccountWidget />
      </div>
      <BrandFooter />
    </div>
  );
}
