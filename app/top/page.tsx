import BrandFooter from "@/components/BrandFooter";
import Header from "@/components/Header";
import { students } from "@/shared/data/mock";
import TopStudentsWidget from "@/widgets/TopStudentsWidget";

export default function TopPage() {
  return (
    <>
      <Header />
      <TopStudentsWidget students={students} />
      <BrandFooter />
    </>
  );
}
