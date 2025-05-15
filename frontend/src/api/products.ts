import api from './axios';

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  subcategory: string;
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
  return data;
};

// Search products
export const searchProducts = async (query: string, page = 1, limit = 10): Promise<PaginatedResponse<Product>> => {
  const { data } = await api.get(`/products/search?q=${query}&page=${page}&limit=${limit}`);
  return data;
};

// Create a new product (protected route)
export const createProduct = async (product: Omit<Product, '_id' | 'likes' | 'likedBy'>): Promise<Product> => {
  const { data } = await api.post('/products', product);
  return data;
};

// Like or unlike a product (protected route)
export const toggleLikeProduct = async (productId: string): Promise<Product> => {
  const { data } = await api.post(`/products/${productId}/like`);
  return data;
};
