import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, ProductUpdatePayload } from '@/types/product';

const API_BASE = 'https://fakestoreapi.com';

// Fetch all products
const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

// Fetch single product
const fetchProduct = async (id: number): Promise<Product> => {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

// Update product
const updateProduct = async ({ id, data }: { id: number; data: ProductUpdatePayload }): Promise<Product> => {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  return response.json();
};

// Delete product
const deleteProduct = async (id: number): Promise<{ id: number }> => {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
  return { id };
};

// Fetch categories
const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE}/products/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

// React Query Hooks
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 0, // Consider data immediately stale
    refetchOnWindowFocus: 'always', // Always refresh on window focus
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  });
};

export const useProduct = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    staleTime: 0, // Consider data immediately stale
    refetchOnWindowFocus: 'always', // Always refresh on window focus
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    enabled: enabled && id > 0, // Only fetch if enabled and id is valid
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes - categories don't change often
    refetchOnWindowFocus: true, // Refresh on focus only when stale
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['products'] });
      await queryClient.cancelQueries({ queryKey: ['product', id] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData<Product[]>(['products']);
      const previousProduct = queryClient.getQueryData<Product>(['product', id]);

      // Optimistically update the cache
      if (previousProducts) {
        queryClient.setQueryData<Product[]>(['products'], (old) =>
          old?.map((product) =>
            product.id === id ? { ...product, ...data } : product
          )
        );
      }

      if (previousProduct) {
        queryClient.setQueryData<Product>(['product', id], (old) =>
          old ? { ...old, ...data } : old
        );
      }

      return { previousProducts, previousProduct };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      if (context?.previousProduct) {
        queryClient.setQueryData(['product', id], context.previousProduct);
      }
    },
    onSuccess: (data, { id }) => {
      // On success, keep the updated data in cache
      // Don't refetch - this ensures the changes persist in the UI
      // Until the user manually refreshes the page
      queryClient.setQueryData<Product[]>(['products'], (old) =>
        old?.map((product) =>
          product.id === id ? { ...product, ...data } : product
        )
      );
      
      queryClient.setQueryData<Product>(['product', id], (old) =>
        old ? { ...old, ...data } : old
      );
    },
    // Removed onSettled to prevent automatic refetch
    // This keeps the updated data in cache until user refreshes
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['products'] });
      await queryClient.cancelQueries({ queryKey: ['product', id] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData<Product[]>(['products']);

      // Optimistically remove from cache
      if (previousProducts) {
        queryClient.setQueryData<Product[]>(['products'], (old) =>
          old?.filter((product) => product.id !== id)
        );
      }

      // Remove the specific product from cache as well
      queryClient.removeQueries({ queryKey: ['product', id] });

      return { previousProducts };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
    },
    onSuccess: (data, id) => {
      // On success, keep the product removed from cache
      // Don't refetch - this ensures the product stays deleted in the UI
      // Until the user manually refreshes the page or reopens the app
      queryClient.setQueryData<Product[]>(['products'], (old) =>
        old?.filter((product) => product.id !== id)
      );
    },
    // Removed onSettled to prevent automatic refetch
    // This keeps the deleted product out of the UI until user refreshes
  });
};
