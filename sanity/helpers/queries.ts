import { defineQuery } from "next-sanity";
import { sanityFetch } from "../lib/live";

export const getProductBySlug = async (slug: string) => {
  const PRODUCT_BY_SLUG_QUERY = defineQuery(
    `*[_type == 'product' && slug.current == $slug] | order(name asc) [0]`
  );
  try {
    const product = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: {
        slug,
      },
    });
    return product?.data || null;
  } catch (error) {
console.error("Error fetching all categories:", error);

  }
};

export const getAllCategories = async () => {
  const CATEGORIES_QUERY = defineQuery(
    `*[_type=="category"] | order(name asc)`
  );
  try {
    const categories = await sanityFetch({
      query: CATEGORIES_QUERY,
    });
    return categories.data || [];
  } catch (error) {
    console.error("Error fetching all categories");

    return [];
  }
};

export const getMyOrders = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const MY_ORDERS_QUERY =
    defineQuery(`*[_type == 'order' && clerkUserId == $userId] | order(orderData desc){
    ...,products[]{
      ...,product->
    }
  }`);

  try {
    const orders = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
    });
    return orders?.data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const getOrderCount = async (userId: string) => {
  if (!userId) return 0;
  const ORDER_COUNT_QUERY = defineQuery(
    `count(*[_type == 'order' && clerkUserId == $userId])`
  );
  try {
    const result = await sanityFetch({ query: ORDER_COUNT_QUERY, params: { userId } });
    return result?.data ?? 0;
  } catch {
    return 0;
  }
};

export const getProductsByVariant = async (variant: string) => {
  const PRODUCTS_BY_VARIANT_QUERY = defineQuery(
    `*[_type == "product" && lower(variant) == $variant] | order(name asc)`
  );
  try {
    const result = await sanityFetch({
      query: PRODUCTS_BY_VARIANT_QUERY,
      params: { variant: variant.toLowerCase() },
    });
    return result?.data || [];
  } catch (error) {
    console.error("Error fetching products by variant:", error);
    return [];
  }
};