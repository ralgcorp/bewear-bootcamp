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

    // Verificar se o usuário já tem um carrinho
    const existingUserCart = await db.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.userId, session.user.id),
      with: {
        items: true,
      },
    });

    if (existingUserCart) {
      // Se o usuário já tem carrinho, mesclar com o carrinho guest
      console.log(`User already has cart with ${existingUserCart.items.length} items, merging...`);
      
      // Mover itens do carrinho do usuário para o carrinho guest
      for (const userItem of existingUserCart.items) {
        const existingGuestItem = guestCart.items.find(
          (item) => item.productVariantId === userItem.productVariantId,
        );

        if (existingGuestItem) {
          // Se já existe no guest cart, somar as quantidades
          await db
            .update(cartItemTable)
            .set({
              quantity: existingGuestItem.quantity + userItem.quantity,
            })
            .where(eq(cartItemTable.id, existingGuestItem.id));
          console.log(`Updated quantity for product variant: ${userItem.productVariantId}`);
        } else {
          // Se não existe no guest cart, mover o item
          await db
            .update(cartItemTable)
            .set({
              cartId: guestCart.id,
            })
            .where(eq(cartItemTable.id, userItem.id));
          console.log(`Moved user item to guest cart: ${userItem.productVariantId}`);
        }
      }
      
      // Deletar o carrinho antigo do usuário
      await db.delete(cartTable).where(eq(cartTable.id, existingUserCart.id));
      console.log("Deleted old user cart");
    }

    // Adicionar user_id ao carrinho guest existente
    await db
      .update(cartTable)
      .set({
        userId: session.user.id,
        guestId: null, // Remove o guestId pois agora é do usuário
      })
      .where(eq(cartTable.id, guestCart.id));
    
    console.log("Added user_id to guest cart, removed guest_id");

    // O carrinho guest agora pertence ao usuário, não precisa deletar
    console.log(`Guest cart now belongs to user with ${guestCart.items.length} items`);

    // Limpar o cookie do guest cart
    await clearGuestCartId();
    console.log("Cleared guest cart cookie");

    console.log("Guest cart merge completed successfully");
  } catch (error) {
    console.error("Error merging guest cart:", error);
    // Não lançar erro para não quebrar o fluxo de login
  }
};
