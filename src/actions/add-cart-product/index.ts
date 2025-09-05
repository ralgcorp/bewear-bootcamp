"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getGuestCartId } from "@/lib/guest-cart";

import { AddProductToCartSchema, addProductToCartSchema } from "./schema";

export const addProductToCart = async (data: AddProductToCartSchema) => {
  addProductToCartSchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const productVariant = await db.query.productVariantTable.findFirst({
    where: (productVariant, { eq }) =>
      eq(productVariant.id, data.productVariantId),
  });
  if (!productVariant) {
    throw new Error("Product variant not found");
  }

  let cartId: string;

  if (session?.user) {
    // Usuário logado - usar carrinho do usuário
    const cart = await db.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.userId, session.user.id),
    });
    if (!cart) {
      const [newCart] = await db
        .insert(cartTable)
        .values({
          userId: session.user.id,
        })
        .returning();
      cartId = newCart.id;
    } else {
      cartId = cart.id;
    }
  } else {
    // Usuário não logado - usar carrinho de convidado
    const guestId = await getGuestCartId();
    const cart = await db.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.guestId, guestId),
    });
    if (!cart) {
      const [newCart] = await db
        .insert(cartTable)
        .values({
          guestId,
        })
        .returning();
      cartId = newCart.id;
    } else {
      cartId = cart.id;
    }
  }

  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) =>
      eq(cartItem.cartId, cartId) &&
      eq(cartItem.productVariantId, data.productVariantId),
  });
  if (cartItem) {
    await db
      .update(cartItemTable)
      .set({
        quantity: cartItem.quantity + data.quantity,
      })
      .where(eq(cartItemTable.id, cartItem.id));
    return;
  }
  await db.insert(cartItemTable).values({
    cartId,
    productVariantId: data.productVariantId,
    quantity: data.quantity,
  });
};
