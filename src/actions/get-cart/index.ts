"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getGuestCartId, cleanupDuplicateGuestCarts } from "@/lib/guest-cart";

export const getCart = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Se o usuário está logado, buscar carrinho do usuário
  if (session?.user) {
    const cart = await db.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.userId, session.user.id),
      with: {
        shippingAddress: true,
        items: {
          with: {
            productVariant: {
              with: {
                product: true,
              },
            },
          },
          orderBy: (cartItem, { asc }) => [asc(cartItem.createdAt)],
        },
      },
    });
    if (!cart) {
      const [newCart] = await db
        .insert(cartTable)
        .values({
          userId: session.user.id,
        })
        .returning();
      return {
        ...newCart,
        items: [],
        totalPriceInCents: 0,
        shippingAddress: null,
      };
    }
    return {
      ...cart,
      totalPriceInCents: cart.items.reduce(
        (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
        0,
      ),
    };
  }

  // Se não está logado, buscar carrinho de convidado
  // Primeiro, limpar carrinhos duplicados
  await cleanupDuplicateGuestCarts();
  
  const guestId = await getGuestCartId();
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.guestId, guestId),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
        orderBy: (cartItem, { asc }) => [asc(cartItem.createdAt)],
      },
    },
  });
  if (!cart) {
    const [newCart] = await db
      .insert(cartTable)
      .values({
        guestId,
      })
      .returning();
    return {
      ...newCart,
      items: [],
      totalPriceInCents: 0,
      shippingAddress: null,
    };
  }
  return {
    ...cart,
    totalPriceInCents: cart.items.reduce(
      (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
      0,
    ),
  };
};
