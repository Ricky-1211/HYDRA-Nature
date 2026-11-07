import { api } from './api';
import { CartItem, Address, Order } from '../types';

export const orderService = {
  createRazorpayOrder: async (items: CartItem[], couponCode?: string) => {
    const res = await api.post('/orders/razorpay', { items, couponCode });
    return res.data;
  },

  verifyPayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    items: CartItem[];
    shippingAddress: Address;
    couponCode?: string;
  }): Promise<{ success: boolean; data: Order; message: string }> => {
    const res = await api.post('/orders/verify-payment', data);
    return res.data;
  },

  createCODOrder: async (data: {
    items: CartItem[];
    shippingAddress: Address;
    couponCode?: string;
  }): Promise<{ success: boolean; data: Order; message: string }> => {
    const res = await api.post('/orders/cod', data);
    return res.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const res = await api.get('/orders/my-orders');
    return res.data.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const res = await api.get(`/orders/${id}`);
    return res.data.data;
  },

  getAllOrders: async (params?: { status?: string; page?: number; limit?: number }) => {
    const res = await api.get('/orders', { params });
    return res.data;
  },

  updateOrderStatus: async (id: string, data: { status: string; trackingNumber?: string; note?: string }) => {
    const res = await api.put(`/orders/${id}/status`, data);
    return res.data;
  },

  getShiprocketTracking: async (id: string) => {
    const res = await api.get(`/orders/${id}/shiprocket/track`);
    return res.data.data;
  },

  createShiprocketOrder: async (id: string) => {
    const res = await api.post(`/orders/${id}/shiprocket/create`);
    return res.data;
  },

  getInvoiceUrl: (id: string, autoPrint = false) => {
    const base = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${base}/orders/${id}/invoice${autoPrint ? '?print=true' : ''}`;
  },
};
