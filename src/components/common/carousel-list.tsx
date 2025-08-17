"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { productTable, productVariantTable } from "@/db/schema";
import ProductItem from "./product-item";

interface CarouselListProps {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[];
}

const CarouselList = ({ title, products }: CarouselListProps) => {
  return (
    <Carousel opts={{ align: "start" }} className="w-full px-5">
      <div className="flex items-center justify-between py-4">
        <div className="text-2xl font-bold">{title}</div>
        <div className="flex font-semibold">
          <div className="flex items-center px-5 text-sm font-bold">
            Ver Todos
          </div>
          <CarouselPrevious className="relative left-0 translate-y-0 border-none shadow-none" />
          <CarouselNext className="relative left-0 translate-x-0 translate-y-0 border-none shadow-none" />
        </div>
      </div>
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
            <div className="p-1">
              <ProductItem key={product.id} product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default CarouselList;
