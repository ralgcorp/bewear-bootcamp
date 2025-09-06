import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { cartTable, cartItemTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const GUEST_CART_COOKIE_NAME = "guest-cart-id";
const GUEST_CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

export async function getGuestCartId(): Promise<string> {
  const cookieStore = await cookies();
  let guestId = cookieStore.get(GUEST_CART_COOKIE_NAME)?.value;

  if (!guestId) {
    // Verificar se já existe um carrinho de convidado no banco
    // Buscar por carrinhos de convidado que não pertencem a usuários
    const existingGuestCart = await db.query.cartTable.findFirst({
      where: (cart, { isNull }) => isNull(cart.userId),
      orderBy: (cart, { desc }) => [desc(cart.createdAt)],
    });

    if (existingGuestCart?.guestId) {
      // Usar o ID do carrinho existente
      guestId = existingGuestCart.guestId;
      console.log("Reusing existing guest cart ID:", guestId);
    } else {
      // Criar um novo ID apenas se não existir nenhum carrinho de convidado
      guestId = randomUUID();
      console.log("Creating new guest cart ID:", guestId);
    }

    // Definir o cookie com o ID (novo ou existente)
    cookieStore.set(GUEST_CART_COOKIE_NAME, guestId, {
      maxAge: GUEST_CART_COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  } else {
    console.log("Using existing guest cart ID from cookie:", guestId);
  }

  return guestId;
}

export async function clearGuestCartId(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_CART_COOKIE_NAME);
}

export async function createNewGuestSession(): Promise<string> {
  console.log("Creating new guest session after logout");

  // Limpar cookie existente
  await clearGuestCartId();

  // Gerar novo ID de convidado
  const newGuestId = randomUUID();
  console.log("New guest cart ID:", newGuestId);

  // Definir novo cookie
  const cookieStore = await cookies();
  cookieStore.set(GUEST_CART_COOKIE_NAME, newGuestId, {
    maxAge: GUEST_CART_COOKIE_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return newGuestId;
}

export async function cleanupDuplicateGuestCarts(): Promise<void> {
  try {
    // Buscar todos os carrinhos de convidado
    const guestCarts = await db.query.cartTable.findMany({
      where: (cart, { isNull }) => isNull(cart.userId),
      with: {
        items: true,
      },
      orderBy: (cart, { desc }) => [desc(cart.createdAt)],
    });

    if (guestCarts.length <= 1) {
      return; // Não há duplicatas
    }

    // Pegar o carrinho mais recente (primeiro da lista)
    const mainCart = guestCarts[0];
    const duplicateCarts = guestCarts.slice(1);

    console.log(
      `Found ${duplicateCarts.length} duplicate guest carts, consolidating...`,
    );

    // Mover todos os itens dos carrinhos duplicados para o carrinho principal
    for (const duplicateCart of duplicateCarts) {
      if (duplicateCart.items.length > 0) {
        // Mover itens para o carrinho principal
        await db
          .update(cartItemTable)
          .set({ cartId: mainCart.id })
          .where(eq(cartItemTable.cartId, duplicateCart.id));
      }

      // Deletar o carrinho duplicado
      await db.delete(cartTable).where(eq(cartTable.id, duplicateCart.id));
    }

    console.log("Duplicate guest carts cleaned up successfully");
  } catch (error) {
    console.error("Error cleaning up duplicate guest carts:", error);
  }
}
