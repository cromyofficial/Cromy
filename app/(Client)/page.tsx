import Container from "@/components/Container";
import { HomeBanner } from "@/components/HomeBanner";
import { ProductGrid } from "@/components/ProductGrid";
import { productType } from "@/constant";
import { getProductsByVariant } from "@/sanity/helpers/queries";

export default async function Home() {
  const initialTab = productType[0]?.title || "";
  const initialProducts = await getProductsByVariant(initialTab);

  return (
    <div>
      <Container className="py-10">
        <HomeBanner />
        <ProductGrid initialProducts={initialProducts} initialTab={initialTab} />
      </Container>
    </div>
  );
}
