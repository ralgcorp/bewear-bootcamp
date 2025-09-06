"use server";

import { createNewGuestSession } from "@/lib/guest-cart";

export const createGuestSession = async () => {
  try {
    console.log("Creating new guest session...");
    const guestId = await createNewGuestSession();
    console.log("New guest session created with ID:", guestId);
    return { success: true, guestId };
  } catch (error) {
    console.error("Error creating guest session:", error);
    return { success: false, error: "Failed to create guest session" };
  }
};
