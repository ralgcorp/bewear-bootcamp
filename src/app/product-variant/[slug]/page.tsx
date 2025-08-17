import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import ProductList from "@/components/common/products-list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

import ProductActions from "./components/product-actions";
import VariantSelector from "./components/variant-selector";
import CarouselList from "@/components/common/carousel-list";

interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });
  if (!productVariant) {
    return notFound();
  }
  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });
  return (
    <>
      <div className="grid gap-4 md:grid-cols-5">
        <div className="col-span-3 p-4">
          <div className="flex flex-col space-y-6">
            <Image
              src={productVariant.imageUrl}
              alt={productVariant.name}
              sizes="100vw"
              height={0}
              width={0}
              className="h-auto w-full rounded-4xl object-cover"
            />
          </div>
        </div>

        <div className="col-span-2 p-4">
          <div className="px-5">
            {/* DESCRIÇÃO */}
            <h2 className="text-4xl font-bold">
              {productVariant.product.name}
            </h2>
            <h3 className="text-muted-foreground text-lg font-semibold">
              {productVariant.name}
            </h3>
            <h3 className="py-3 text-xl font-bold">
              {formatCentsToBRL(productVariant.priceInCents)}
            </h3>
            <div className="py-6">
              <VariantSelector
                selectedVariantSlug={productVariant.slug}
                variants={productVariant.product.variants}
              />
            </div>
          </div>

          <ProductActions productVariantId={productVariant.id} />

          <div className="px-5 text-lg">
            <p className="text-shadow-amber-600">
              {productVariant.product.description}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 py-6">
        <CarouselList
          title="Você também pode gostar"
          products={likelyProducts}
        />
      </div>
    </>
  );
};

export default ProductVariantPage;
