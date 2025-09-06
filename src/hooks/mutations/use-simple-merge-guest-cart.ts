import { useMutation, useQueryClient } from "@tanstack/react-query";

import { simpleMergeGuestCart } from "@/actions/simple-merge-guest-cart";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getSimpleMergeGuestCartMutationKey = () =>
  ["simple-merge-guest-cart"] as const;

export const useSimpleMergeGuestCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getSimpleMergeGuestCartMutationKey(),
    mutationFn: () => simpleMergeGuestCart(),
    onSuccess: (result) => {
      console.log("Simple merge result:", result);
      // Invalidate cart query to refetch with merged data
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
    onError: (error) => {
      console.error("Failed to simple merge guest cart:", error);
    },
  });
};
