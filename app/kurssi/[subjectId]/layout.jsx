import { requireSubjectAccess } from "../../../lib/subject-guard";
import { SubjectHeader } from "../../components/course/SubjectHeader";

export default async function SubjectLayout({ children, params }) {
  const { professor } = await requireSubjectAccess(params.subjectId);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <SubjectHeader subjectId={params.subjectId} professor={professor} />
      {children}
    </div>
  );
}
