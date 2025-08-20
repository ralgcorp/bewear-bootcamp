import { useMutation, useQueryClient } from "@tanstack/react-query";

import { decreaseCartProductQuantity } from "@/actions/decrease-cart-product-quantity";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getDecreaseCartProductMutationKey = (cartItemId: string) =>
  ["decrease-cart-product-quantity", cartItemId] as const;

export const useDecreaseCartProduct = (cartItemId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getDecreaseCartProductMutationKey(cartItemId),
    mutationFn: () => decreaseCartProductQuantity({ cartItemId }),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: getUseCartQueryKey() });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(getUseCartQueryKey());

      // Optimistically update to the new value
      queryClient.setQueryData(getUseCartQueryKey(), (old: any) => {
        if (!old?.items) return old;

        const updatedItems = old.items
          .map((item: any) => {
            if (item.id === cartItemId) {
              const newQuantity = item.quantity - 1;
              if (newQuantity <= 0) {
                return null; // Remove item if quantity becomes 0
              }
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
          .filter(Boolean); // Remove null items

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
