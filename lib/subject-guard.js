import { notFound, redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { canAccessSubject, getProfessorById } from "./access";

export async function requireSubjectAccess(subjectId) {
  const professor = getProfessorById(subjectId);
  if (!professor) notFound();

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/kirjaudu?next=/kurssi");

  const allowed = await canAccessSubject(user.email, subjectId);
  if (!allowed) redirect("/kurssi");

  return { professor, user };
}
