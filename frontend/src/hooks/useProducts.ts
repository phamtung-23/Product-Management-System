import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products';
import type { Product, PaginatedResponse } from '../api/products';

export function useProducts(page: number, limit: number) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: ['products', page, limit],
    queryFn: () => getProducts(page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
