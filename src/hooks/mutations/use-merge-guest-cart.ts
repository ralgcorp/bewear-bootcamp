import { useMutation, useQueryClient } from "@tanstack/react-query";

import { mergeGuestCart } from "@/actions/merge-guest-cart";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getMergeGuestCartMutationKey = () => ["merge-guest-cart"] as const;

export const useMergeGuestCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getMergeGuestCartMutationKey(),
    mutationFn: async () => {
      // Aguardar um pouco para a sessão ser estabelecida
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mergeGuestCart();
    },
    onSuccess: () => {
      // Invalidate cart query to refetch with merged data
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
