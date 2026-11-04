import { api } from './api';
import { Product } from '../types';

export interface ProductQueryParams {
  search?: string;
  category?: string;
  subcategory?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  bestseller?: boolean;
  all?: boolean;
  isActive?: boolean;
}

export const productService = {
  getAll: async (params?: ProductQueryParams) => {
    const res = await api.get('/products', { params });
    return res.data;
  },

  getByIdOrSlug: async (idOrSlug: string): Promise<{ product: Product; relatedProducts: Product[] }> => {
    const res = await api.get(`/products/${idOrSlug}`);
    return res.data.data;
  },

  getCategories: async (all?: boolean): Promise<{ name: string; count: number }[]> => {
    const res = await api.get('/products/categories', { params: { all } });
    return res.data.data;
  },

  getSubcategories: async (category?: string, all?: boolean): Promise<string[]> => {
    const res = await api.get('/products/subcategories', { params: { category, all } });
    return res.data.data;
  },

  create: async (data: Partial<Product>) => {
    const res = await api.post('/products', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Product>) => {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },

  updateStock: async (id: string, stock: number) => {
    const res = await api.put(`/products/${id}`, { stock });
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  uploadImage: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/products/upload', formData);
    return res.data;
  },

  uploadMultipleImages: async (files: File[]): Promise<{ imageUrls: string[] }> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    const res = await api.post('/products/upload-multiple', formData);
    return res.data;
  },
};
