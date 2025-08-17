import ProductList from "@/components/common/products-list";
import { db } from "@/db";
import { desc } from "drizzle-orm";
import Image from "next/image";
import CategorySelector from "@/components/common/category-selector";
import { productTable } from "@/db/schema";
import Showcase from "@/components/common/showcase";
import CarouselList from "@/components/common/carousel-list";
import Brands from "@/components/common/brands";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });

  const categories = await db.query.categoryTable.findMany({});

  return (
    <>
      <div className="container mx-auto">
        <div className="space-y-6">
          <div className="px-5">
            <Image
              src="/banner-01-m.png"
              alt="Leve uma vida com estilo"
              height={0}
              width={0}
              sizes="100vw"
              className="block h-auto w-full md:hidden"
            />
            <Image
              src="/banner-01-d.png"
              alt="Leve uma vida com estilo"
              height={0}
              width={0}
              sizes="100vw"
              className="hidden h-auto w-full md:block"
            />
          </div>
          <Brands />
          <CarouselList products={newlyCreatedProducts} title="Mais Vendidos" />

          <div className="block px-5 md:hidden">
            <div className="rounded-3xl bg-[#F4EFFF] p-6">
              <div className="grid grid-cols-2 gap-3">
                <CategorySelector categories={categories} />
              </div>
            </div>
          </div>

          <div className="block px-5 md:hidden">
            <Image
              src="/banner-02.png"
              alt="Leve uma vida com estilo"
              height={0}
              width={0}
              sizes="100vw"
              className="h-auto w-full"
            />
          </div>

          <div className="block px-5 md:hidden">
            <ProductList
              products={newlyCreatedProducts}
              title="Novos produtos"
            />
          </div>
          <Showcase />
        </div>
      </div>
    </>
  );
};

export default Home;
