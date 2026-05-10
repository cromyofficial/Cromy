import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "intro",
      title: "Product Intro",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "sizes",
      title: "Sizes & Stock",
      description:
        "Add each size you carry and the stock available for that size. Total stock is derived from this list.",
      type: "array",
      of: [
        {
          type: "object",
          name: "sizeStock",
          title: "Size Stock",
          fields: [
            defineField({
              name: "name",
              title: "Size",
              type: "string",
              options: {
                list: SIZE_OPTIONS.map((s) => ({ title: s, value: s })),
                layout: "radio",
                direction: "horizontal",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "stock",
              title: "Stock",
              type: "number",
              validation: (Rule) => Rule.required().min(0).integer(),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "stock" },
            prepare: ({ title, subtitle }) => ({
              title: `Size ${title}`,
              subtitle: `${subtitle ?? 0} in stock`,
            }),
          },
        },
      ],
      validation: (Rule) =>
        Rule.custom((sizes) => {
          if (!sizes || !Array.isArray(sizes)) return true;
          const names = sizes
            .map((s) => (s as { name?: string }).name)
            .filter(Boolean) as string[];
          const dupes = names.filter((n, i) => names.indexOf(n) !== i);
          return dupes.length
            ? `Duplicate sizes: ${[...new Set(dupes)].join(", ")}`
            : true;
        }),
    }),

    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Sale", value: "sale" },
        ],
      },
    }),
    defineField({
      name: "variant",
      title: "Product Type",
      type: "string",
      options: {
        list: [
          { title: "Comfort fit", value: "Comfort fit" },
          { title: "Straight fit", value: "Straight fit" },
          { title: "Mom fit", value: "Mom fit" },
          { title: "Cargo", value: "Cargo" },
          { title: "Tshirt", value: "Tshirt" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images",
      subtitle: "price",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      const image = media && media[0];
      return {
        title: title,
        subtitle: `₹${subtitle}`,
        media: image,
      };
    },
  },
});
