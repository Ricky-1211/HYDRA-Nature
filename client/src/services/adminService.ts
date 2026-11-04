import { api } from './api';
import { User, Order, Product } from '../types';

export interface DashboardAnalytics {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    lowStockCount: number;
    pendingApplications: number;
    newInquiries: number;
  };
  lowStockProducts: {
    _id: string;
    name: string;
    stock: number;
    price: number;
    category: string;
  }[];
  recentOrders: Order[];
  monthlySales: {
    month: string;
    revenue: number;
    orders: number;
  }[];
}

export const adminService = {
  getAnalytics: async (): Promise<DashboardAnalytics> => {
    const res = await api.get('/admin/analytics');
    return res.data.data;
  },

  getCustomers: async (): Promise<any> => {
    const res = await api.get('/admin/customers');
    return res.data;
  },

  getOrders: async (params?: Record<string, any>): Promise<any> => {
    const res = await api.get('/orders', { params });
    return res.data;
  },

  getSubscribers: async (): Promise<any> => {
    const res = await api.get('/newsletter');
    return res.data;
  },

  getReviews: async (): Promise<any> => {
    const res = await api.get('/reviews/admin');
    return res.data;
  },

  deleteReview: async (id: string): Promise<any> => {
    const res = await api.delete(`/reviews/${id}`);
    return res.data;
  },

  getLowStockProducts: async (): Promise<any> => {
    const res = await api.get('/products?sort=stock&limit=50');
    return res.data;
  },

  updateProductStock: async (id: string, stock: number): Promise<any> => {
    const res = await api.patch(`/products/${id}/stock`, { stock });
    return res.data;
  },
};
