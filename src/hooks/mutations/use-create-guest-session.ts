import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGuestSession } from "@/actions/create-guest-session";
import { getUseCartQueryKey } from "../queries/use-cart";

export const getCreateGuestSessionMutationKey = () =>
  ["create-guest-session"] as const;

export const useCreateGuestSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getCreateGuestSessionMutationKey(),
    mutationFn: () => createGuestSession(),
    onSuccess: () => {
      // Invalidar cache do carrinho para refletir nova sessão
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
    onError: (error) => {
      console.error("Failed to create guest session:", error);
    },
  });
};
