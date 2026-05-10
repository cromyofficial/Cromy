import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { siteConfig } from "@/lib/site";

interface SitemapProduct {
  slug: string;
  updatedAt: string;
}

interface SitemapCategory {
  slug: string;
  updatedAt: string;
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/faqs`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  let productEntries: MetadataRoute.Sitemap = [];
  let categoryEntries: MetadataRoute.Sitemap = [];

  try {
    const products = await client.fetch<SitemapProduct[]>(
      `*[_type == "product" && defined(slug.current)]{
        "slug": slug.current,
        "updatedAt": coalesce(_updatedAt, _createdAt)
      }`
    );
    productEntries = products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (err) {
    console.error("[sitemap] failed to fetch products:", err);
  }

  try {
    const categories = await client.fetch<SitemapCategory[]>(
      `*[_type == "category" && defined(slug.current)]{
        "slug": slug.current,
        "updatedAt": coalesce(_updatedAt, _createdAt)
      }`
    );
    categoryEntries = categories.map((c) => ({
      url: `${base}/category/${c.slug}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (err) {
    console.error("[sitemap] failed to fetch categories:", err);
  }

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
