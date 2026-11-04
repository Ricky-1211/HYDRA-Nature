import { api } from './api';
import { Coupon } from '../types';

export const couponService = {
  validate: async (code: string, subtotal: number) => {
    const res = await api.post('/coupons/validate', { code, subtotal });
    return res.data;
  },

  getAll: async (): Promise<any> => {
    const res = await api.get('/coupons');
    return res.data.data;
  },

  create: async (data: Partial<Coupon>) => {
    const res = await api.post('/coupons', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Coupon>) => {
    const res = await api.put(`/coupons/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/coupons/${id}`);
    return res.data;
  },
};
