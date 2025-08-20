import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addProductToCart } from "@/actions/add-cart-product";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getIncreaseCartProductMutationKey = (productVariantId: string) =>
  ["increase-cart-product-quantity", productVariantId] as const;

export const useIncreaseCartProduct = (productVariantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getIncreaseCartProductMutationKey(productVariantId),
    mutationFn: () => addProductToCart({ productVariantId, quantity: 1 }),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: getUseCartQueryKey() });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(getUseCartQueryKey());

      // Optimistically update to the new value
      queryClient.setQueryData(getUseCartQueryKey(), (old: any) => {
        if (!old?.items) return old;

        const updatedItems = old.items.map((item: any) => {
          if (item.productVariant.id === productVariantId) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });

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
