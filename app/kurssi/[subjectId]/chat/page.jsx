import { requireSubjectAccess } from "../../../../lib/subject-guard";
import ProfessorChat from "../../../components/course/ProfessorChat";

export default async function SubjectChatPage({ params }) {
  const { professor } = await requireSubjectAccess(params.subjectId);
  return <ProfessorChat professor={professor} embedded />;
}
