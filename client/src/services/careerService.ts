import { api } from './api';
import { Career, JobApplication } from '../types';

export const careerService = {
  getAll: async (params?: { department?: string; all?: boolean }): Promise<Career[]> => {
    const res = await api.get('/careers', { params });
    return res.data?.data || res.data || [];
  },

  getCareers: async (params?: Record<string, any>): Promise<any> => {
    const res = await api.get('/careers', { params });
    return res.data;
  },

  getBySlug: async (slug: string): Promise<Career> => {
    const res = await api.get(`/careers/${slug}`);
    return res.data?.data || res.data;
  },

  uploadResume: async (
    file: File
  ): Promise<{
    success: boolean;
    resumeUrl: string;
    relativeUrl: string;
    filename: string;
    originalName: string;
    size: number;
  }> => {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await api.post('/careers/upload-resume', formData);
    return res.data;
  },

  apply: async (data: {
    careerId: string;
    jobTitle: string;
    fullName: string;
    email: string;
    phone: string;
    resumeUrl: string;
    portfolioUrl?: string;
    coverLetter?: string;
  }) => {
    const res = await api.post('/careers/apply', data);
    return res.data;
  },

  createCareer: async (data: Partial<Career>): Promise<any> => {
    const res = await api.post('/careers', data);
    return res.data;
  },

  create: async (data: Partial<Career>) => {
    const res = await api.post('/careers', data);
    return res.data;
  },

  updateCareer: async (id: string, data: Partial<Career>): Promise<any> => {
    const res = await api.put(`/careers/${id}`, data);
    return res.data;
  },

  update: async (id: string, data: Partial<Career>) => {
    const res = await api.put(`/careers/${id}`, data);
    return res.data;
  },

  deleteCareer: async (id: string): Promise<any> => {
    const res = await api.delete(`/careers/${id}`);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/careers/${id}`);
    return res.data;
  },

  getApplications: async (careerId?: string): Promise<any> => {
    const url = careerId
      ? `/careers/admin/applications?careerId=${careerId}`
      : '/careers/admin/applications';
    const res = await api.get(url);
    return res.data;
  },

  updateApplicationStatus: async (id: string, status: string) => {
    const res = await api.put(`/careers/admin/applications/${id}`, { status });
    return res.data;
  },

  deleteApplication: async (id: string) => {
    const res = await api.delete(`/careers/admin/applications/${id}`);
    return res.data;
  },
};
