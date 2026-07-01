export function orderUrl(productId, params = {}) {
  const url = new URL("/tilaa", "https://laudaturpro.fi");
  url.searchParams.set("paketti", productId);
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== "") url.searchParams.set(k, String(v));
  }
  return `${url.pathname}${url.search}`;
}
