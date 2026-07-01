/** Stripe price ID overrides — aseta Vercel-envissä kun tuotteet luotu Stripessä. */
export const STRIPE_PRICE_ENV = {
  "laudatur-pro": "STRIPE_PRICE_LAUDATUR_PRO",
  "laudatur-boost": "STRIPE_PRICE_LAUDATUR_BOOST",
  "matikka-pitka": "STRIPE_PRICE_MATIKKA_PITKA",
  "matikka-lyhyt": "STRIPE_PRICE_MATIKKA_LYHYT",
  "aidinkieli": "STRIPE_PRICE_AIDINKIELI",
  "englanti": "STRIPE_PRICE_ENGLANTI",
};

export function stripePriceIdFor(productId) {
  const envKey = STRIPE_PRICE_ENV[productId];
  if (!envKey) return null;
  return process.env[envKey] || null;
}
