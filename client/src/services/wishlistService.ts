import { api } from './api';
import { Product } from '../types';

export const wishlistService = {
  getWishlist: async (): Promise<Product[]> => {
    const res = await api.get('/wishlist');
    return res.data.data;
  },

  addToWishlist: async (productId: string): Promise<Product[]> => {
    const res = await api.post('/wishlist', { productId });
    return res.data.data;
  },

  removeFromWishlist: async (productId: string): Promise<Product[]> => {
    const res = await api.delete(`/wishlist/${productId}`);
    return res.data.data;
  },
};
