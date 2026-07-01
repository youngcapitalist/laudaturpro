/** Ilmaiset AI-professorikysymykset per aine (ennen ostoa). */
export const FREE_PREVIEW_LIMIT = 3;

export function previewStorageKey(subjectId) {
  return `laudaturpro_preview_${subjectId}`;
}
