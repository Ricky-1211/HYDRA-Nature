import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { careerService } from '../../services/careerService';

interface Career {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  applicationsCount?: number;
}

interface Application {
  _id: string;
  applicantName: string;
  email: string;
  phone: string;
  status: string;
  appliedAt: string;
  resumeUrl?: string;
}

const DEPARTMENTS = ['Engineering', 'Marketing', 'Design', 'Operations', 'Sales', 'HR', 'Finance'];
const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship'];

const emptyForm = { title: '', department: 'Engineering', location: '', type: 'full-time', description: '', requirements: '', isActive: true };

const AdminCareersPage: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<'jobs' | 'applications'>('jobs');

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const res = await careerService.getCareers();
      setCareers(res.data?.careers || res.careers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (careerId?: string) => {
    try {
      const res = await careerService.getApplications(careerId);
      setApplications(res.data?.applications || res.applications || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchCareers(); }, []);
  useEffect(() => {
    if (tab === 'applications') fetchApplications(selectedCareer?._id);
  }, [tab, selectedCareer]);

  const openCreate = () => { setEditingCareer(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (c: Career) => {
    setEditingCareer(c);
    setForm({ title: c.title, department: c.department, location: c.location, type: c.type, description: '', requirements: '', isActive: c.isActive });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = { ...form, requirements: form.requirements.split('\n').filter(Boolean) };
      if (editingCareer) {
        await careerService.updateCareer(editingCareer._id, payload as any);
        toast.success('Job updated!');
      } else {
        await careerService.createCareer(payload as any);
        toast.success('Job created!');
      }
      setShowForm(false);
      fetchCareers();
    } catch (err: any) {
      toast.error(err.message || 'Error saving job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job listing?')) return;
    try {
      await careerService.deleteCareer(id);
      toast.success('Job deleted');
      setCareers(prev => prev.filter(c => c._id !== id));
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const handleAppStatus = async (appId: string, status: string) => {
    try {
      await careerService.updateApplicationStatus(appId, status);
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
      toast.success('Status updated');
    } catch (err: any) {
      toast.error(err.message || 'Error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-hydra-dark">Career Management</h1>
          <p className="text-hydra-muted text-sm mt-1">Manage job listings and applications</p>
        </div>
        {tab === 'jobs' && (
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Job
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-hydra-cream p-1 rounded-xl w-fit">
        {(['jobs', 'applications'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-white text-hydra-dark shadow-sm' : 'text-hydra-muted hover:text-hydra-dark'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-playfair font-bold text-hydra-dark text-lg">
                {editingCareer ? 'Edit Job' : 'New Job Listing'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-hydra-muted hover:text-hydra-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-hydra-dark mb-1">Job Title *</label>
                <input required type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hydra-dark" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-hydra-dark mb-1">Department</label>
                  <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hydra-dark">
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-hydra-dark mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hydra-dark">
                    {JOB_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-hydra-dark mb-1">Location</label>
                <input type="text" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hydra-dark"
                  placeholder="e.g. Bhubaneswar, Odisha" />
              </div>
              {!editingCareer && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-hydra-dark mb-1">Description *</label>
                    <textarea required value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hydra-dark resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-hydra-dark mb-1">Requirements (one per line)</label>
                    <textarea value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))}
                      rows={4} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hydra-dark resize-none"
                      placeholder="3+ years experience&#10;React knowledge&#10;…" />
                  </div>
                </>
              )}
              <div className="flex items-center gap-3">
                <input type="checkbox" id="active" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-hydra-dark" />
                <label htmlFor="active" className="text-sm text-hydra-dark">Active listing</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 btn-primary text-sm">
                  {submitting ? 'Saving…' : editingCareer ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jobs Tab */}
      {tab === 'jobs' && (
        loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-hydra-dark border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {careers.map(career => (
              <div key={career._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-hydra-dark text-sm">{career.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${career.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {career.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="text-xs text-hydra-muted space-y-1">
                  <p>📁 {career.department}</p>
                  <p>📍 {career.location}</p>
                  <p className="capitalize">⏱ {career.type}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setSelectedCareer(career); setTab('applications'); }}
                    className="flex-1 text-xs border border-gray-200 rounded-xl py-1.5 hover:bg-gray-50 transition-colors text-hydra-muted">
                    View Apps
                  </button>
                  <button onClick={() => openEdit(career)}
                    className="flex-1 text-xs border border-hydra-dark text-hydra-dark rounded-xl py-1.5 hover:bg-hydra-dark hover:text-white transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(career._id)}
                    className="px-3 text-xs border border-red-200 text-red-500 rounded-xl py-1.5 hover:bg-red-50 transition-colors">
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Applications Tab */}
      {tab === 'applications' && (
        <div className="space-y-4">
          {selectedCareer && (
            <div className="flex items-center gap-3 bg-hydra-cream rounded-xl px-4 py-2">
              <span className="text-sm text-hydra-muted">Filtered by:</span>
              <span className="font-medium text-hydra-dark text-sm">{selectedCareer.title}</span>
              <button onClick={() => { setSelectedCareer(null); fetchApplications(); }} className="ml-auto text-xs text-hydra-muted hover:text-hydra-dark">Clear filter</button>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-hydra-muted text-sm">No applications found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-hydra-cream">
                    <tr>
                      {['Applicant', 'Email', 'Phone', 'Applied', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-hydra-muted uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {applications.map(app => (
                      <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-hydra-dark">{app.applicantName}</td>
                        <td className="px-4 py-3 text-sm text-hydra-muted">{app.email}</td>
                        <td className="px-4 py-3 text-sm text-hydra-muted">{app.phone}</td>
                        <td className="px-4 py-3 text-xs text-hydra-muted">{new Date(app.appliedAt).toLocaleDateString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>{app.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => handleAppStatus(app._id, 'accepted')} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">Accept</button>
                            <button onClick={() => handleAppStatus(app._id, 'rejected')} className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCareersPage;
