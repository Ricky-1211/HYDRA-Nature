import { api } from './api';
import { User } from '../types';

export const authService = {
  register: async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await api.post('/auth/register', data);
    if (res.data.token) {
      localStorage.setItem('hydra_token', res.data.token);
    }
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post('/auth/login', data);
    if (res.data.token) {
      localStorage.setItem('hydra_token', res.data.token);
    }
    return res.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('hydra_token');
    }
  },

  getMe: async (): Promise<{ user: User }> => {
    const res = await api.get('/auth/me');
    return res.data.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const res = await api.put('/auth/profile', data);
    return res.data.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const res = await api.put('/auth/change-password', data);
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (data: { token: string; password: string }) => {
    const res = await api.post('/auth/reset-password', data);
    return res.data;
  },
};
