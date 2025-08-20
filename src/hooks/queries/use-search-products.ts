import { useQuery } from "@tanstack/react-query";
import { searchProducts, SearchProductResult } from "@/actions/search-products";

export const getUseSearchProductsQueryKey = (query: string) =>
  ["search-products", query] as const;

export const useSearchProducts = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: getUseSearchProductsQueryKey(query),
    queryFn: () => searchProducts(query),
    enabled: enabled && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
