import api from './axios';

export interface Product {
  id: string;
  name: string; // This will be the localized version from the backend
  price: number;
  category: string; // This will be the localized version from the backend
  subcategory: string; // This will be the localized version from the backend
  likes: number;
  likedBy: string[];
}

// Full multilingual product definition matching the backend schema
export interface MultilingualProduct {
  _id: string;
  name: {
    en: string;
    vi: string;
    [key: string]: string;
  };
  price: number;
  category: {
    en: string;
    vi: string;
    [key: string]: string;
  };
  subcategory: {
    en: string;
    vi: string;
    [key: string]: string;
  };
  likes: number;
  likedBy: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

// Get products with pagination
export const getProducts = async (page = 1, limit = 10): Promise<PaginatedResponse<Product>> => {
  const { data } = await api.get(`/products?page=${page}&limit=${limit}`);
  // Support both old and new backend response formats
  if (data.products && data.pagination) {
    return {
      data: data.products,
      page: data.pagination.currentPage,
      limit: data.pagination.itemsPerPage,
      totalPages: data.pagination.totalPages,
      totalResults: data.pagination.totalItems,
    };
  }
  // fallback for old format
  return data;
};

// Search products
export const searchProducts = async (query: string, page = 1, limit = 10): Promise<PaginatedResponse<Product>> => {
  const { data } = await api.get(`/products/search?q=${query}&page=${page}&limit=${limit}`);
  if (data.products && data.pagination) {
    return {
      data: data.products,
      page: data.pagination.currentPage,
      limit: data.pagination.itemsPerPage,
      totalPages: data.pagination.totalPages,
      totalResults: data.pagination.totalItems,
    };
  }
  return data;
};

// Create a new product (protected route)
export const createProduct = async (product: {
  name: { en: string; vi: string };
  price: number;
  category: { en: string; vi: string };
  subcategory: { en: string; vi: string };
}): Promise<Product> => {
  const multilingualProduct = {
    name: product.name,
    price: product.price,
    category: product.category,
    subcategory: product.subcategory
  };
  const { data } = await api.post('/products', multilingualProduct);
  return data.product || data; // Handle both response formats
};

// Response type for API calls that return a product
export interface ProductResponse {
  product?: Product;
  message?: string;
  language?: string;
}

// Like or unlike a product (protected route)
export const toggleLikeProduct = async (productId: string): Promise<Product> => {
  const { data } = await api.post<ProductResponse>(`/products/${productId}/like`);
  return data.product || data as unknown as Product; // Handle both response formats
};
