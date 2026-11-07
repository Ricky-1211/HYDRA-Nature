import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Users,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  X,
  ChevronDown,
} from 'lucide-react';
import { careerService } from '../../services/careerService';
import { getImageUrl } from '../../utils/imageUrl';

interface Career {
  _id: string;
  title: string;
  slug?: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Remote' | 'Hybrid';
  experience?: string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  isActive: boolean;
  createdAt: string;
}

interface Application {
  _id: string;
  career: string | { _id: string; title: string; department?: string; location?: string };
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  portfolioUrl?: string;
  resumeUrl: string;
  coverLetter?: string;
  status: 'Received' | 'Under Review' | 'Shortlisted' | 'Accepted' | 'Hired' | 'Rejected';
  createdAt: string;
}

const DEPARTMENTS = [
  'Formulation & R&D',
  'Engineering & Tech',
  'Product & Design',
  'Marketing & Brand',
  'Operations & Supply Chain',
  'Customer Delight',
  'Finance & HR',
];

const JOB_TYPES: Array<'Full-time' | 'Part-time' | 'Remote' | 'Hybrid'> = [
  'Full-time',
  'Part-time',
  'Remote',
  'Hybrid',
];

const STATUS_OPTIONS: Array<Application['status']> = [
  'Received',
  'Under Review',
  'Shortlisted',
  'Accepted',
  'Hired',
  'Rejected',
];

const emptyForm = {
  title: '',
  department: DEPARTMENTS[0],
  location: 'Bhubaneswar, India / Hybrid',
  type: 'Full-time' as 'Full-time' | 'Part-time' | 'Remote' | 'Hybrid',
  experience: '2-4 Years',
  description: '',
  requirements: '',
  responsibilities: '',
  benefits: '',
  isActive: true,
};

export const AdminCareersPage: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [selectedCareerFilter, setSelectedCareerFilter] = useState<string>('all');
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [viewingApp, setViewingApp] = useState<Application | null>(null);

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<'jobs' | 'applications'>('jobs');

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const res = await careerService.getCareers({ all: true });
      const items = res.data?.data || res.data || res.careers || [];
      setCareers(Array.isArray(items) ? items : []);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load career listings');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (careerId?: string) => {
    try {
      setLoading(true);
      const filterId = careerId && careerId !== 'all' ? careerId : undefined;
      const res = await careerService.getApplications(filterId);
      const items = res.data?.data || res.data || res.applications || [];
      setApplications(Array.isArray(items) ? items : []);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  useEffect(() => {
    if (tab === 'applications') {
      fetchApplications(selectedCareerFilter);
    }
  }, [tab, selectedCareerFilter]);

  const openCreate = () => {
    setEditingCareer(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (c: Career) => {
    setEditingCareer(c);
    setForm({
      title: c.title || '',
      department: c.department || DEPARTMENTS[0],
      location: c.location || 'Bhubaneswar, India / Hybrid',
      type: c.type || 'Full-time',
      experience: c.experience || '2-4 Years',
      description: c.description || '',
      requirements: Array.isArray(c.requirements) ? c.requirements.join('\n') : '',
      responsibilities: Array.isArray(c.responsibilities) ? c.responsibilities.join('\n') : '',
      benefits: Array.isArray(c.benefits) ? c.benefits.join('\n') : '',
      isActive: c.isActive !== false,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Job title and description are required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: form.title.trim(),
        department: form.department,
        location: form.location.trim(),
        type: form.type,
        experience: form.experience.trim(),
        description: form.description.trim(),
        requirements: form.requirements
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean),
        responsibilities: form.responsibilities
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean),
        benefits: form.benefits
          .split('\n')
          .map((b) => b.trim())
          .filter(Boolean),
        isActive: form.isActive,
      };

      if (editingCareer) {
        await careerService.updateCareer(editingCareer._id, payload as any);
        toast.success('Job listing updated successfully!');
      } else {
        await careerService.createCareer(payload as any);
        toast.success('New job listing published!');
      }
      setShowForm(false);
      fetchCareers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Error saving job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job listing?')) return;
    try {
      await careerService.deleteCareer(id);
      toast.success('Job listing deleted');
      setCareers((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Delete failed');
    }
  };

  const handleAppStatus = async (appId: string, status: Application['status']) => {
    try {
      await careerService.updateApplicationStatus(appId, status);
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status } : a))
      );
      if (viewingApp?._id === appId) {
        setViewingApp((prev) => (prev ? { ...prev, status } : null));
      }
      toast.success(`Application marked as ${status}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Status update failed');
    }
  };

  const handleDeleteApp = async (appId: string) => {
    if (!confirm('Delete this application record?')) return;
    try {
      await careerService.deleteApplication(appId);
      toast.success('Application removed');
      setApplications((prev) => prev.filter((a) => a._id !== appId));
      if (viewingApp?._id === appId) setViewingApp(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Delete failed');
    }
  };

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.fullName?.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
      app.jobTitle?.toLowerCase().includes(appSearchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'Received':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Shortlisted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Accepted':
      case 'Hired':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#13382B]">
            Career &amp; Talent Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create job postings, manage openings, and review candidate applications with attached resumes.
          </p>
        </div>
        {tab === 'jobs' && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#13382B] text-white rounded-xl text-xs font-semibold hover:bg-[#1E4D3B] transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Opening</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#EDE8E1] p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setTab('jobs')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
            tab === 'jobs'
              ? 'bg-[#13382B] text-white shadow-sm'
              : 'text-gray-600 hover:text-[#13382B]'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Job Openings ({careers.length})</span>
        </button>

        <button
          onClick={() => setTab('applications')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
            tab === 'applications'
              ? 'bg-[#13382B] text-white shadow-sm'
              : 'text-gray-600 hover:text-[#13382B]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Applications ({applications.length})</span>
        </button>
      </div>

      {/* ─── JOBS TAB ─── */}
      {tab === 'jobs' && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-56 bg-white rounded-2xl border border-gray-100 animate-pulse" />
              ))}
            </div>
          ) : careers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-gray-800">No Job Openings Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Create your first job listing to have it immediately visible on the client-facing Careers page.
              </p>
              <button
                onClick={openCreate}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2 bg-[#13382B] text-white rounded-xl text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Job</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {careers.map((career) => (
                <div
                  key={career._id}
                  className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF1EB] text-[#2E6B48]">
                        {career.department}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          career.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                      >
                        {career.isActive ? 'Active & Live' : 'Draft / Inactive'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-base font-bold text-[#13382B] leading-snug">
                        {career.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span>📍 {career.location}</span>
                        <span>•</span>
                        <span>⏱ {career.type}</span>
                      </p>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {career.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCareerFilter(career._id);
                        setTab('applications');
                      }}
                      className="flex-1 py-2 text-xs border border-gray-200 hover:border-[#13382B] rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5 text-[#13382B]" />
                      <span>View Apps</span>
                    </button>

                    <button
                      onClick={() => openEdit(career)}
                      className="p-2 border border-gray-200 hover:border-[#13382B] text-gray-700 hover:text-[#13382B] rounded-xl hover:bg-gray-50 transition-colors"
                      title="Edit job opening"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(career._id)}
                      className="p-2 border border-red-200 hover:border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                      title="Delete job opening"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ─── APPLICATIONS TAB ─── */}
      {tab === 'applications' && (
        <div className="space-y-4">
          {/* Controls Bar: Search & Filter */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidate name, email, or role..."
                value={appSearchQuery}
                onChange={(e) => setAppSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#13382B]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">Filter by Opening:</span>
              <select
                value={selectedCareerFilter}
                onChange={(e) => setSelectedCareerFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#13382B] bg-white"
              >
                <option value="all">All Positions ({applications.length})</option>
                {careers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>

              {selectedCareerFilter !== 'all' && (
                <button
                  onClick={() => setSelectedCareerFilter('all')}
                  className="text-xs text-red-500 hover:underline px-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-gray-500">Loading applications...</div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Users className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="font-serif text-sm font-bold text-gray-700">No applications found</p>
                <p className="text-xs text-gray-400">
                  When applicants apply on the Careers page with their resume, their profile will display right here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF8F5] border-b border-gray-100 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Candidate</th>
                      <th className="px-5 py-3.5">Position Applied</th>
                      <th className="px-5 py-3.5">Contact Info</th>
                      <th className="px-5 py-3.5">Resume / CV</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredApplications.map((app) => {
                      const fullResumeUrl = getImageUrl(app.resumeUrl);
                      const isLocalUploaded = app.resumeUrl?.includes('/uploads/resumes');

                      return (
                        <tr key={app._id} className="hover:bg-gray-50/80 transition-colors">
                          {/* Candidate Name & Date */}
                          <td className="px-5 py-4">
                            <div className="font-semibold text-[#13382B]">{app.fullName}</div>
                            <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(app.createdAt).toLocaleDateString('en-IN')}</span>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-5 py-4">
                            <div className="font-medium text-gray-800">
                              {typeof app.career === 'object' && app.career !== null
                                ? (app.career as any).title || app.jobTitle
                                : app.jobTitle}
                            </div>
                            {typeof app.career === 'object' && (app.career as any)?.department && (
                              <span className="text-[10px] text-[#2E6B48] font-medium">
                                {(app.career as any).department}
                              </span>
                            )}
                          </td>

                          {/* Contact */}
                          <td className="px-5 py-4 space-y-0.5 text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <a href={`mailto:${app.email}`} className="hover:underline">
                                {app.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span>{app.phone}</span>
                            </div>
                          </td>

                          {/* Resume Link & Preview */}
                          <td className="px-5 py-4">
                            {app.resumeUrl ? (
                              <a
                                href={fullResumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#EDE8E1] hover:border-[#13382B] text-[#13382B] text-xs font-semibold hover:bg-white transition-all shadow-2xs group"
                              >
                                <FileText className="w-3.5 h-3.5 text-[#2E6B48]" />
                                <span>{isLocalUploaded ? 'View Attached Resume' : 'Open Resume Link'}</span>
                                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#13382B]" />
                              </a>
                            ) : (
                              <span className="text-gray-400 italic">No resume</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <div className="relative inline-block">
                              <select
                                value={app.status}
                                onChange={(e) =>
                                  handleAppStatus(app._id, e.target.value as Application['status'])
                                }
                                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(
                                  app.status
                                )}`}
                              >
                                {STATUS_OPTIONS.map((st) => (
                                  <option key={st} value={st} className="bg-white text-gray-800">
                                    {st}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="px-5 py-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => setViewingApp(app)}
                                className="p-1.5 text-gray-600 hover:text-[#13382B] rounded-lg hover:bg-gray-100 transition-colors"
                                title="View details and cover letter"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteApp(app._id)}
                                className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete application"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── MODAL: CREATE / EDIT JOB OPENING ─── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl my-8 border border-[#EDE8E1] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#FAF8F5]">
              <div>
                <span className="text-[10px] font-bold text-[#2E6B48] uppercase tracking-wider">
                  {editingCareer ? 'Update Opening' : 'New Position'}
                </span>
                <h2 className="font-serif font-bold text-[#13382B] text-xl mt-0.5">
                  {editingCareer ? `Edit: ${editingCareer.title}` : 'Post New Job Opening'}
                </h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#13382B] mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Senior Formulation Scientist / Full Stack Engineer"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#13382B]"
                />
              </div>

              {/* Department & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#13382B] mb-1">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#13382B] bg-white"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#13382B] mb-1">Work Type</label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        type: e.target.value as 'Full-time' | 'Part-time' | 'Remote' | 'Hybrid',
                      }))
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#13382B] bg-white"
                  >
                    {JOB_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#13382B] mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#13382B]"
                    placeholder="e.g. Bhubaneswar, India / Hybrid"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#13382B] mb-1">
                    Experience Required
                  </label>
                  <input
                    type="text"
                    value={form.experience}
                    onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#13382B]"
                    placeholder="e.g. 2-4 Years / Senior Level"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#13382B] mb-1">
                  Role Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#13382B] resize-none"
                  placeholder="Outline the mission of the role, daily work, and team synergy..."
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-xs font-semibold text-[#13382B] mb-1">
                  Key Requirements (One per line)
                </label>
                <textarea
                  rows={3}
                  value={form.requirements}
                  onChange={(e) => setForm((p) => ({ ...p, requirements: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#13382B] resize-none"
                  placeholder="Degree in Chemistry or related field&#10;3+ years in formulation research&#10;Deep familiarity with botanical actives"
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-xs font-semibold text-[#13382B] mb-1">
                  Responsibilities (One per line)
                </label>
                <textarea
                  rows={3}
                  value={form.responsibilities}
                  onChange={(e) => setForm((p) => ({ ...p, responsibilities: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#13382B] resize-none"
                  placeholder="Design stability testing pipelines&#10;Coordinate with clinical test laboratories"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="activeJob"
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-[#13382B] rounded cursor-pointer"
                />
                <label htmlFor="activeJob" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Active &amp; published (Immediately visible on Careers page)
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 rounded-xl py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#13382B] hover:bg-[#1E4D3B] text-white rounded-xl py-2.5 text-xs font-semibold transition-colors disabled:opacity-50 shadow-md"
                >
                  {submitting ? 'Saving...' : editingCareer ? 'Update Opening' : 'Publish Opening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: VIEW APPLICATION DETAILS ─── */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 border border-[#EDE8E1] relative">
            <button
              onClick={() => setViewingApp(null)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-bold text-[#2E6B48] uppercase tracking-wider">
                Candidate Profile
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#13382B] mt-1">
                {viewingApp.fullName}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Applied for <span className="font-semibold text-gray-800">{viewingApp.jobTitle}</span> on{' '}
                {new Date(viewingApp.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EDE8E1]">
                <div>
                  <span className="text-gray-400 block text-[10px]">Email</span>
                  <a
                    href={`mailto:${viewingApp.email}`}
                    className="font-medium text-[#13382B] hover:underline"
                  >
                    {viewingApp.email}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Phone</span>
                  <a href={`tel:${viewingApp.phone}`} className="font-medium text-[#13382B]">
                    {viewingApp.phone}
                  </a>
                </div>
              </div>

              {viewingApp.portfolioUrl && (
                <div>
                  <span className="text-gray-400 block text-[10px] mb-1">Portfolio / Profile Link</span>
                  <a
                    href={viewingApp.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2E6B48] hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>{viewingApp.portfolioUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Resume File */}
              <div>
                <span className="text-gray-400 block text-[10px] mb-1">Attached Resume</span>
                <a
                  href={getImageUrl(viewingApp.resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#13382B] text-white font-semibold hover:bg-[#1E4D3B] transition-colors shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open &amp; Review Resume Document</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Cover Letter */}
              {viewingApp.coverLetter && (
                <div>
                  <span className="text-gray-400 block text-[10px] mb-1">Cover Note</span>
                  <div className="bg-[#FAF8F5] border border-[#EDE8E1] rounded-2xl p-4 text-gray-700 leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto">
                    {viewingApp.coverLetter}
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div className="pt-2">
                <span className="text-gray-400 block text-[10px] mb-1">Current Status</span>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_OPTIONS.map((st) => (
                    <button
                      key={st}
                      onClick={() => handleAppStatus(viewingApp._id, st)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                        viewingApp.status === st
                          ? 'bg-[#13382B] text-white border-[#13382B]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setViewingApp(null)}
                className="px-5 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCareersPage;
