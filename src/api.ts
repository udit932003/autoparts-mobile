import { API_BASE_URL } from "./config";
import type { Product, Category } from "./types";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

export function fetchProducts(opts: { q?: string; category?: string; featured?: boolean } = {}) {
  const params = new URLSearchParams();
  if (opts.q) params.set("q", opts.q);
  if (opts.category) params.set("category", opts.category);
  if (opts.featured) params.set("featured", "true");
  const qs = params.toString();
  return getJson<{ products: Product[] }>(`/api/products${qs ? `?${qs}` : ""}`).then(
    (d) => d.products
  );
}

export function fetchProduct(slug: string) {
  return getJson<{ product: Product; related: Product[] }>(`/api/products/${slug}`);
}

export function fetchCategories() {
  return getJson<{ categories: Category[] }>(`/api/categories`).then((d) => d.categories);
}
