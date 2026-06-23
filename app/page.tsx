import Header from "@/components/Header";
import HeroBlock from "@/components/HeroBlock";
import AboutProjectSection from "@/components/AboutProjectSection";
import MerchSection from "@/components/MerchSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="about-page bg-white">
        <HeroBlock />
        <AboutProjectSection />
        <MerchSection />
      </main>
    </>
  );
}
