const rawUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cromy.in";

export const siteConfig = {
  name: "Cromy",
  /** Canonical site URL with no trailing slash. */
  url: rawUrl.replace(/\/+$/, ""),
  description:
    "Cromy — premium jeans & clothing. Comfort fit, straight fit, mom fit, cargo and tees designed for everyday wear.",
  ogImage: "/og-default.jpg",
  keywords: [
    "Cromy",
    "Cromy Jeans",
    "Cromy Clothing",
    "buy jeans online India",
    "premium denim",
    "men's jeans",
    "women's jeans",
    "cargo pants",
  ],
  twitterHandle: "@cromyofficial",
  locale: "en_IN",
};

export type SiteConfig = typeof siteConfig;
