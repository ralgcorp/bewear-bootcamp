import { Header } from "@/components/common/header";
import ProductList from "@/components/common/products-list";
import { db } from "@/db";
import { desc } from "drizzle-orm";
import Image from "next/image";
import CategorySelector from "@/components/common/category-selector";
import Footer from "@/components/common/footer";
import { productTable } from "@/db/schema";
import Showcase from "@/components/common/showcase";

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
        <Header />
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

          <ProductList products={products} title="Mais vendidos" />

          <div className="px-5">
            <CategorySelector categories={categories} />
          </div>

          <div className="px-5">
            <Image
              src="/banner-02.png"
              alt="Leve uma vida com estilo"
              height={0}
              width={0}
              sizes="100vw"
              className="h-auto w-full"
            />
          </div>

          <ProductList products={newlyCreatedProducts} title="Novos produtos" />
          <Showcase />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
