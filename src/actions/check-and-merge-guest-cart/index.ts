"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { mergeGuestCart } from "../merge-guest-cart";

export const checkAndMergeGuestCart = async () => {
  try {
    // Aguardar um pouco para a sessão ser estabelecida
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      console.log("User not logged in, skipping guest cart merge");
      return;
    }

    console.log("User is logged in, attempting to merge guest cart");
    await mergeGuestCart();
  } catch (error) {
    console.error("Error in checkAndMergeGuestCart:", error);
    // Não lançar erro para não quebrar o fluxo
  }
};
