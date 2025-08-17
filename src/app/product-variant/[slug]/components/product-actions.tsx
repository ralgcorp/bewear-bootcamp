"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import AddToCartButton from "./add-to-cart-button";

interface ProductActionsProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <>
      <div className="mt-4 px-5">
        <div className="mb-6 space-y-4">
          <h3 className="text-xl font-semibold">Quantidade</h3>
          <div className="flex w-[158px] items-center justify-between rounded-lg border px-5 py-1 text-xl font-semibold">
            <Button size="icon" variant="ghost" onClick={handleDecrement}>
              <MinusIcon />
            </Button>
            <p>{quantity}</p>
            <Button size="icon" variant="ghost" onClick={handleIncrement}>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="grid flex-col gap-2 space-y-4 px-5 py-6 xl:grid-cols-2">
        <AddToCartButton
          productVariantId={productVariantId}
          quantity={quantity}
        />
        <Button
          className="rounded-full py-6 text-lg leading-2 font-bold"
          size="lg"
        >
          Comprar agora
        </Button>
      </div>
    </>
  );
};

export default ProductActions;
