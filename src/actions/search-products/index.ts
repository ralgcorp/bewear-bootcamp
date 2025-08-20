"use server";

import { db } from "@/db";
import { productTable, productVariantTable, categoryTable } from "@/db/schema";
import { eq, or, ilike, desc } from "drizzle-orm";

export interface SearchProductResult {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  slug: string;
  description: string;
  variants: {
    id: string;
    name: string;
    slug: string;
    color: string;
    priceInCents: number;
    imageUrl: string;
  }[];
  minPriceInCents: number;
  maxPriceInCents: number;
}

export const searchProducts = async (query: string, limit: number = 20) => {
  if (!query.trim()) {
    return [];
  }

  const searchTerm = `%${query.trim()}%`;

  try {
    const products = await db
      .select({
        id: productTable.id,
        name: productTable.name,
        slug: productTable.slug,
        description: productTable.description,
        categoryId: productTable.categoryId,
        categoryName: categoryTable.name,
        categorySlug: categoryTable.slug,
      })
      .from(productTable)
      .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
      .where(
        or(
          ilike(productTable.name, searchTerm),
          ilike(productTable.description, searchTerm),
          ilike(categoryTable.name, searchTerm),
        ),
      )
      .limit(limit);

    if (products.length === 0) {
      return [];
    }

    // Buscar variantes para cada produto
    const productsWithVariants = await Promise.all(
      products.map(async (product) => {
        const variants = await db
          .select({
            id: productVariantTable.id,
            name: productVariantTable.name,
            slug: productVariantTable.slug,
            color: productVariantTable.color,
            priceInCents: productVariantTable.priceInCents,
            imageUrl: productVariantTable.imageUrl,
          })
          .from(productVariantTable)
          .where(eq(productVariantTable.productId, product.id))
          .orderBy(desc(productVariantTable.createdAt));

        const prices = variants.map((v) => v.priceInCents);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return {
          id: product.id,
          name: product.name,
          category: product.categoryName,
          categorySlug: product.categorySlug,
          slug: product.slug,
          description: product.description,
          variants,
          minPriceInCents: minPrice,
          maxPriceInCents: maxPrice,
        };
      }),
    );

    return productsWithVariants;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw new Error("Falha ao buscar produtos");
  }
};
