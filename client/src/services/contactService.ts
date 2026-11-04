import { api } from './api';
import { ContactMessage } from '../types';

export const contactService = {
  send: async (data: { name: string; email: string; phone?: string; subject: string; message: string }) => {
    const res = await api.post('/contact', data);
    return res.data;
  },

  getContacts: async (): Promise<any> => {
    const res = await api.get('/contact');
    return res.data;
  },

  // legacy alias
  getAll: async (): Promise<ContactMessage[]> => {
    const res = await api.get('/contact');
    return res.data.data;
  },

  updateContactStatus: async (id: string, status: string) => {
    const res = await api.put(`/contact/${id}/status`, { status });
    return res.data;
  },

  // legacy alias
  updateStatus: async (id: string, status: string) => {
    const res = await api.put(`/contact/${id}/status`, { status });
    return res.data;
  },
};
