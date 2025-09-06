"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { mergeGuestCart } from "../merge-guest-cart";

export const simpleMergeGuestCart = async () => {
  try {
    console.log("Starting simple merge guest cart...");
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      console.log("User not logged in, skipping guest cart merge");
      return { success: false, message: "User not logged in" };
    }

    console.log("User is logged in, attempting to merge guest cart");
    await mergeGuestCart();
    
    return { success: true, message: "Guest cart merged successfully" };
  } catch (error) {
    console.error("Error in simpleMergeGuestCart:", error);
    return { success: false, message: "Failed to merge guest cart" };
  }
};
