"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getGuestCartId, clearGuestCartId } from "@/lib/guest-cart";

export const mergeGuestCart = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      console.log("User not logged in, skipping guest cart merge");
      return; // Retornar silenciosamente em vez de lançar erro
    }

    const guestId = await getGuestCartId();

    // Buscar carrinho do convidado
    const guestCart = await db.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.guestId, guestId),
      with: {
        items: true,
      },
    });

    if (!guestCart || guestCart.items.length === 0) {
      // Não há carrinho de convidado ou está vazio, não há nada para fazer
      return;
    }

    // Buscar ou criar carrinho do usuário
    let userCart = await db.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.userId, session.user.id),
      with: {
        items: true,
      },
    });

    if (!userCart) {
      const [newUserCart] = await db
        .insert(cartTable)
        .values({
          userId: session.user.id,
        })
        .returning();
      userCart = { ...newUserCart, items: [] };
    }

    // Para cada item do carrinho de convidado
    for (const guestItem of guestCart.items) {
      // Verificar se já existe um item igual no carrinho do usuário
      const existingUserItem = userCart.items.find(
        (item) => item.productVariantId === guestItem.productVariantId,
      );

      if (existingUserItem) {
        // Se já existe, somar as quantidades
        await db
          .update(cartItemTable)
          .set({
            quantity: existingUserItem.quantity + guestItem.quantity,
          })
          .where(eq(cartItemTable.id, existingUserItem.id));
      } else {
        // Se não existe, mover o item para o carrinho do usuário
        await db
          .update(cartItemTable)
          .set({
            cartId: userCart.id,
          })
          .where(eq(cartItemTable.id, guestItem.id));
      }
    }

    // Deletar o carrinho de convidado vazio
    await db.delete(cartTable).where(eq(cartTable.id, guestCart.id));

    // Limpar o cookie do guest cart
    await clearGuestCartId();
  } catch (error) {
    console.error("Error merging guest cart:", error);
    // Não lançar erro para não quebrar o fluxo de login
  }
};
