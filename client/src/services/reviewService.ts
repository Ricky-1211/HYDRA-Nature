import { api } from './api';
import { Review } from '../types';

export const reviewService = {
  getByProduct: async (productId: string): Promise<Review[]> => {
    const res = await api.get(`/reviews/${productId}`);
    return res.data.data;
  },

  create: async (productId: string, data: { rating: number; title: string; comment: string }) => {
    const res = await api.post(`/reviews/${productId}`, data);
    return res.data;
  },

  delete: async (reviewId: string) => {
    const res = await api.delete(`/reviews/${reviewId}`);
    return res.data;
  },
};
