import { useMutation, useQueryClient } from "@tanstack/react-query";

import { checkAndMergeGuestCart } from "@/actions/check-and-merge-guest-cart";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getCheckAndMergeGuestCartMutationKey = () =>
  ["check-and-merge-guest-cart"] as const;

export const useCheckAndMergeGuestCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getCheckAndMergeGuestCartMutationKey(),
    mutationFn: () => checkAndMergeGuestCart(),
    onSuccess: () => {
      // Invalidate cart query to refetch with merged data
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
    onError: (error) => {
      console.error("Failed to check and merge guest cart:", error);
      // Não mostrar erro para o usuário
    },
  });
};
