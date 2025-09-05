import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const GUEST_CART_COOKIE_NAME = "guest-cart-id";
const GUEST_CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

export async function getGuestCartId(): Promise<string> {
  const cookieStore = await cookies();
  let guestId = cookieStore.get(GUEST_CART_COOKIE_NAME)?.value;

  if (!guestId) {
    guestId = randomUUID();
    cookieStore.set(GUEST_CART_COOKIE_NAME, guestId, {
      maxAge: GUEST_CART_COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return guestId;
}

export async function clearGuestCartId(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_CART_COOKIE_NAME);
}
