import { api } from './api';

export const newsletterService = {
  subscribe: async (email: string) => {
    const res = await api.post('/newsletter/subscribe', { email });
    return res.data;
  },

  getAll: async () => {
    const res = await api.get('/newsletter');
    return res.data.data;
  },
};
