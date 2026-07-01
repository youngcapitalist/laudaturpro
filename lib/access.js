import { ALL_PROFESSORS } from "./professors";

const ALL_SUBJECT_IDS = ALL_PROFESSORS.map((p) => p.id);

/** Tuote-ID → professori-ID:t joihin pääsy. */
const PRODUCT_SUBJECTS = {
  "laudatur-pro": ALL_SUBJECT_IDS,
  "laudatur-boost": ALL_SUBJECT_IDS,
  "matikka-pitka": ["matikka-pitka"],
  "matikka-lyhyt": ["matikka-lyhyt"],
  "matikka-pakkaus": ["matikka-pitka", "matikka-lyhyt"],
  aidinkieli: ["aidinkieli"],
  englanti: ["englanti"],
  "kielet-pakkaus": ["aidinkieli", "englanti", "ruotsi"],
  fysiikka: ["fysiikka"],
  kemia: ["kemia"],
  biologia: ["biologia"],
  historia: ["historia"],
  psykologia: ["psykologia"],
  terveystieto: ["terveystieto"],
  yhteiskuntaoppi: ["yhteiskuntaoppi"],
  "luonnontiede-pakkaus": ["fysiikka", "kemia", "biologia"],
};

export function subjectsForProduct(productId) {
  return PRODUCT_SUBJECTS[productId] || [];
}

async function supabaseAdminFetch(path, options = {}) {
  const supaUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (!supaUrl || !supaKey) return null;
  const base = supaUrl.replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
  const res = await fetch(`${base}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supaKey,
      Authorization: `Bearer ${supaKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) return null;
  return res.json();
}

/** Onko sähköpostilla aktiivinen Laudatur-pääsy? */
export async function hasLaudaturAccess(email) {
  const normalized = email.trim().toLowerCase();
  const now = new Date().toISOString();
  const rows = await supabaseAdminFetch(
    `laudatur_access?email=eq.${encodeURIComponent(normalized)}&access_until=gte.${now}&select=product_id,product_name,access_until`
  );
  return Array.isArray(rows) && rows.length > 0;
}

/** Kaikki professori-ID:t joihin käyttäjällä on pääsy. */
export async function getAccessibleSubjectIds(email) {
  const normalized = email.trim().toLowerCase();
  const now = new Date().toISOString();
  const rows = await supabaseAdminFetch(
    `laudatur_access?email=eq.${encodeURIComponent(normalized)}&access_until=gte.${now}&select=product_id`
  );
  if (!Array.isArray(rows) || rows.length === 0) return [];

  const subjects = new Set();
  for (const row of rows) {
    for (const id of subjectsForProduct(row.product_id)) subjects.add(id);
  }
  return [...subjects];
}

export async function canAccessSubject(email, subjectId) {
  const allowed = await getAccessibleSubjectIds(email);
  return allowed.includes(subjectId);
}

export function getProfessorById(subjectId) {
  return ALL_PROFESSORS.find((p) => p.id === subjectId) || null;
}
