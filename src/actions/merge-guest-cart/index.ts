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

    console.log("Starting guest cart merge for user:", session.user.id);

    // Buscar o carrinho de convidado da sessão ativa (do cookie atual)
    const guestId = await getGuestCartId();
    const guestCart = await db.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.guestId, guestId),
      with: {
        items: true,
      },
    });

    console.log(`Found guest cart with ID: ${guestId}, items: ${guestCart?.items.length || 0}`);

    // Mesclar sempre, mesmo se o carrinho estiver vazio
    if (!guestCart) {
      console.log("No guest cart found, nothing to merge");
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

    // Processar itens do carrinho de convidado (se houver)
    if (guestCart.items.length > 0) {
      console.log(`Merging ${guestCart.items.length} items from guest cart`);
      
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
          console.log(`Updated quantity for product variant: ${guestItem.productVariantId}`);
        } else {
          // Se não existe, mover o item para o carrinho do usuário
          await db
            .update(cartItemTable)
            .set({
              cartId: userCart.id,
            })
            .where(eq(cartItemTable.id, guestItem.id));
          console.log(`Moved item to user cart: ${guestItem.productVariantId}`);
        }
      }
    } else {
      console.log("Guest cart is empty, no items to merge");
    }

    // Deletar o carrinho de convidado (mesmo se vazio)
    await db.delete(cartTable).where(eq(cartTable.id, guestCart.id));
    console.log("Deleted guest cart");

    // Limpar o cookie do guest cart
    await clearGuestCartId();
    console.log("Cleared guest cart cookie");

    console.log("Guest cart merge completed successfully");
  } catch (error) {
    console.error("Error merging guest cart:", error);
    // Não lançar erro para não quebrar o fluxo de login
  }
};
