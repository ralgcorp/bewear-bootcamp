import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeProductFromCart } from "@/actions/remove-cart-product";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getRemoveProductFromCartMutationKey = (cartItemId: string) =>
  ["remove-cart-product", cartItemId] as const;

export const useRemoveProductFromCart = (cartItemId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getRemoveProductFromCartMutationKey(cartItemId),
    mutationFn: () => removeProductFromCart({ cartItemId }),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: getUseCartQueryKey() });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(getUseCartQueryKey());

      // Optimistically update to the new value
      queryClient.setQueryData(getUseCartQueryKey(), (old: any) => {
        if (!old?.items) return old;

        const updatedItems = old.items.filter(
          (item: any) => item.id !== cartItemId,
        );

        const totalPriceInCents = updatedItems.reduce(
          (acc: number, item: any) =>
            acc + item.productVariant.priceInCents * item.quantity,
          0,
        );

        return {
          ...old,
          items: updatedItems,
          totalPriceInCents,
        };
      });

      // Return a context object with the snapshotted value
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCart) {
        queryClient.setQueryData(getUseCartQueryKey(), context.previousCart);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
