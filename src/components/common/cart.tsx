"use client";

import { ShoppingBagIcon, X, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCentsToBRL } from "@/helpers/money";
import { useCart } from "@/hooks/queries/use-cart";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CartItem from "./cart-item";
import Link from "next/link";
import { useCartSheet } from "@/hooks/use-cart-sheet";
import ButtonClose from "./button-close";

export const Cart = () => {
  const { isOpen, setIsOpen, closeCart } = useCartSheet();
  const { data: cart } = useCart();
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="link"
          className="text-black [&_svg:not([class*='size-'])]:size-auto"
        >
          <ShoppingBagIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="rounded-4xl [&>button:last-child]:hidden">
        <SheetHeader>
          <SheetTitle className="mt-2 px-3">Carrinho</SheetTitle>
        </SheetHeader>
        <ButtonClose onClick={closeCart} className="absolute top-4 right-4" />
        <div className="flex h-full flex-col px-5 pb-5">
          <div className="flex h-full max-h-full flex-col overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex h-full flex-col gap-8">
                {cart?.items && cart.items.length > 0 ? (
                  cart.items.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      productVariantId={item.productVariant.id}
                      productName={item.productVariant.product.name}
                      productVariantName={item.productVariant.name}
                      productVariantImageUrl={item.productVariant.imageUrl}
                      productVariantPriceInCents={
                        item.productVariant.priceInCents
                      }
                      quantity={item.quantity}
                    />
                  ))
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 py-10">
                    <ShoppingBagIcon className="text-muted-foreground h-16 w-16" />
                    <p className="text-muted-foreground text-center text-lg font-semibold">
                      Carrinho vazio
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {cart?.items && cart?.items.length > 0 && (
            <div className="flex flex-col gap-4">
              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p className="text-sm font-semibold">Subtotal</p>
                <p className="text-sm">
                  {formatCentsToBRL(cart?.totalPriceInCents ?? 0)}
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p className="text-sm font-semibold">Entrega</p>
                <p className="text-sm">GRÁTIS</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-sm">
                  {formatCentsToBRL(cart?.totalPriceInCents ?? 0)}
                </p>
              </div>

              <Button
                onClick={closeCart}
                className="mt-5 rounded-full py-6 text-lg leading-2 font-semibold"
                asChild
              >
                <Link href="/cart/identification">Finalizar compra</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
