const STORAGE_KEY = "laudatur_wtp_offer";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const LAUDATUR_WTP_OFFER_EVENT = "laudatur-wtp-offer-updated";

function notify() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LAUDATUR_WTP_OFFER_EVENT));
}

export function persistOffer(offer) {
  if (typeof window === "undefined" || !offer?.token) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...offer, savedAt: Date.now() }));
    notify();
  } catch {
    /* private mode */
  }
}

export function loadOffer() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.token || Date.now() - data.savedAt > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearOffer() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    notify();
  } catch {
    /* private mode */
  }
}
