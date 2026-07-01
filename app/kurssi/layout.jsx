import { CourseNav } from "../components/course/CourseNav";

export const metadata = {
  title: "Kurssit — LaudaturPro",
  robots: { index: false },
};

export default function KurssiLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-wash">
      <CourseNav />
      {children}
    </div>
  );
}
