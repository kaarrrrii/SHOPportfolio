import { notFound } from "next/navigation";
import BrandFooter from "@/components/BrandFooter";
import Header from "@/components/Header";
import { getStudentBySlug, students } from "@/shared/data/mock";
import StudentProfileWidget from "@/widgets/StudentProfileWidget";

export function generateStaticParams() {
  return students.map((student) => ({
    slug: student.slug,
  }));
}

export default async function StudentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const student = getStudentBySlug(slug);

  if (!student) {
    notFound();
  }

  return (
    <>
      <Header />
      <StudentProfileWidget student={student} />
      <BrandFooter />
    </>
  );
}
