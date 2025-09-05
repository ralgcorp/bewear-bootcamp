"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";

import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getGuestCartId } from "@/lib/guest-cart";

import { removeProductFromCartSchema } from "./schema";

export const removeProductFromCart = async (
  data: z.infer<typeof removeProductFromCartSchema>,
) => {
  removeProductFromCartSchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cartItemId),
    with: {
      cart: true,
    },
  });
  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  // Verificar se o carrinho pertence ao usuário logado ou ao convidado
  if (session?.user) {
    const cartDoesNotBelongToUser = cartItem.cart.userId !== session.user.id;
    if (cartDoesNotBelongToUser) {
      throw new Error("Unauthorized");
    }
  } else {
    const guestId = await getGuestCartId();
    const cartDoesNotBelongToGuest = cartItem.cart.guestId !== guestId;
    if (cartDoesNotBelongToGuest) {
      throw new Error("Unauthorized");
    }
  }

  await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
};
