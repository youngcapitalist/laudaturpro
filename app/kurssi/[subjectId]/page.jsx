import { notFound, redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { canAccessSubject, getProfessorById } from "../../../lib/access";
import ProfessorChat from "../../components/course/ProfessorChat";

export default async function SubjectChatPage({ params }) {
  const subjectId = params.subjectId;
  const professor = getProfessorById(subjectId);
  if (!professor) notFound();

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/kirjaudu");

  const allowed = await canAccessSubject(user.email, subjectId);
  if (!allowed) redirect("/kurssi");

  return <ProfessorChat professor={professor} />;
}
