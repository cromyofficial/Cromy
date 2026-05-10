import type { Product } from "@/sanity.types";

export interface ProductSize {
  name: string;
  stock: number;
}

export function getProductSizes(product: Product | null | undefined): ProductSize[] {
  // sizes was added to the Sanity schema. The generated TS types may lag until
  // `npm run typegen` runs, so we read it defensively.
  const raw = (product as unknown as { sizes?: ProductSize[] } | null)?.sizes;
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((s): s is ProductSize => !!s && typeof s.name === "string")
    .map((s) => ({ name: s.name, stock: Math.max(0, Number(s.stock) || 0) }));
}

export function getTotalStock(product: Product | null | undefined): number {
  return getProductSizes(product).reduce((sum, s) => sum + s.stock, 0);
}

export function isProductInStock(product: Product | null | undefined): boolean {
  return getTotalStock(product) > 0;
}

export function getStockForSize(
  product: Product | null | undefined,
  size: string | undefined | null
): number {
  if (!size) return 0;
  return getProductSizes(product).find((s) => s.name === size)?.stock ?? 0;
}

export function buildCartKey(productId: string, size?: string | null): string {
  return size ? `${productId}::${size}` : productId;
}
