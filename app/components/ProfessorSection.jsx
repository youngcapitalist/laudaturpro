import { PROFESSOR_GROUPS } from "../../lib/professors";
import { ProfessorCard } from "./ProfessorCard";

export function ProfessorSection() {
  return (
    <section id="professorit" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-site px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">Opettajat</p>
          <h2 className="mt-2 font-heading text-3xl font-extrabold text-navy md:text-4xl">
            Professori joka aineessa
          </h2>
          <p className="mt-3 text-navy/70">
            Jokaisella yo-kurssilla on oma AI-professori — kysy teoriaa, pyydä tehtäviä, tarkista vastaukset. Ei
            yleistä chatbottia, vaan ainekohtainen asiantuntija.
          </p>
        </div>
        {PROFESSOR_GROUPS.map((group) => (
          <div key={group.id} className="mt-12">
            <h3 className="font-heading text-xl font-bold text-navy">{group.title}</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.professors.map((p) => (
                <ProfessorCard key={p.id} professor={p} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
