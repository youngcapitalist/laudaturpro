import { requireSubjectAccess } from "../../../../lib/subject-guard";
import { getHarkkakoeTasks } from "../../../../lib/exam-content";
import HarkkakoeView from "../../../components/course/HarkkakoeView";

export default async function HarkkakoePage({ params }) {
  const { professor } = await requireSubjectAccess(params.subjectId);
  const tasks = getHarkkakoeTasks(params.subjectId);

  return (
    <main className="mx-auto w-full max-w-site flex-1 px-4 py-10 md:px-8">
      <HarkkakoeView subjectId={params.subjectId} professorRole={professor.role} tasks={tasks} />
    </main>
  );
}
