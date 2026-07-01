export function checkoutUrl(productId, params = {}) {
  const url = new URL("/api/checkout", "https://laudaturpro.fi");
  url.searchParams.set("paketti", productId);
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== "") url.searchParams.set(k, String(v));
  }
  return `${url.pathname}${url.search}`;
}

/** Client-side checkout path with optional WTP offer token. */
export function checkoutPath(productId, params = {}) {
  return checkoutUrl(productId, params);
}

/** @deprecated use checkoutUrl */
export function orderUrl(productId, params = {}) {
  return checkoutUrl(productId, params);
}
