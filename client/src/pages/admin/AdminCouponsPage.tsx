import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { couponService } from '../../services/couponService';

interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

const emptyForm = {
  code: '',
  discountType: 'percentage' as const,
  discountValue: 10,
  minOrderAmount: 0,
  maxUses: 100,
  isActive: true,
  expiresAt: '',
};

const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await couponService.getAll();
      setCoupons(Array.isArray(res) ? res : res.coupons || res.data?.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = { ...form, code: form.code.toUpperCase().trim() };
      await couponService.create(payload);
      toast.success('Coupon created!');
      setShowForm(false);
      setForm(emptyForm);
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Error creating coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (coupon: Coupon) => {
    try {
      await couponService.update(coupon._id, { isActive: !coupon.isActive });
      setCoupons(prev => prev.map(c => c._id === coupon._id ? { ...c, isActive: !coupon.isActive } : c));
      toast.success(`Coupon ${coupon.isActive ? 'deactivated' : 'activated'}`);
    } catch (err: any) {
      toast.error('Failed to update coupon');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await couponService.delete(id);
      toast.success('Coupon deleted');
      setCoupons(prev => prev.filter(c => c._id !== id));
    } catch (err: any) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-hydra-dark">Coupon Management</h1>
          <p className="text-hydra-muted text-sm mt-1">Create and manage discount codes</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Coupon
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-playfair font-bold text-hydra-dark text-lg">Create Coupon</h2>
              <button onClick={() => setShowForm(false)} className="text-hydra-muted hover:text-hydra-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-hydra-dark mb-1">Coupon Code *</label>
                <input required type="text" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-hydra-dark"
                  placeholder="e.g. HYDRA20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-hydra-dark mb-1">Type</label>
                  <select value={form.discountType} onChange={e => setForm(p => ({ ...p, discountType: e.target.value as any }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hydra-dark">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-hydra-dark mb-1">
                    Value {form.discountType === 'percentage' ? '(%)' : '(₹)'} *
                  </label>
                  <input required type="number" min={1} value={form.discountValue}
                    onChange={e => setForm(p => ({ ...p, discountValue: +e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hydra-dark" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-hydra-dark mb-1">Min Order (₹)</label>
                  <input type="number" min={0} value={form.minOrderAmount}
                    onChange={e => setForm(p => ({ ...p, minOrderAmount: +e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hydra-dark" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-hydra-dark mb-1">Max Uses</label>
                  <input type="number" min={1} value={form.maxUses}
                    onChange={e => setForm(p => ({ ...p, maxUses: +e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hydra-dark" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-hydra-dark mb-1">Expiry Date</label>
                <input type="date" value={form.expiresAt} onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hydra-dark" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isActive" checked={form.isActive}
                  onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-hydra-dark" />
                <label htmlFor="isActive" className="text-sm text-hydra-dark">Active immediately</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 btn-primary text-sm">
                  {submitting ? 'Creating…' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupons Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-hydra-dark border-t-transparent rounded-full animate-spin" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 text-hydra-muted">
          <p className="mb-4">No coupons yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm">Create First Coupon</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map(coupon => (
            <div key={coupon._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Dotted coupon border effect */}
              <div className={`p-5 border-b-2 border-dashed ${coupon.isActive ? 'border-hydra-dark/20 bg-hydra-cream' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono font-bold text-lg tracking-wider ${coupon.isActive ? 'text-hydra-dark' : 'text-gray-400'}`}>
                    {coupon.code}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-2xl font-playfair font-bold text-hydra-dark">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                </p>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-xs text-hydra-muted">
                  <span>Min order</span>
                  <span>₹{coupon.minOrderAmount || 0}</span>
                </div>
                <div className="flex justify-between text-xs text-hydra-muted">
                  <span>Uses</span>
                  <span>{coupon.usedCount} / {coupon.maxUses || '∞'}</span>
                </div>
                {coupon.expiresAt && (
                  <div className="flex justify-between text-xs text-hydra-muted">
                    <span>Expires</span>
                    <span>{new Date(coupon.expiresAt).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button onClick={() => handleToggle(coupon)}
                    className={`flex-1 text-xs rounded-xl py-1.5 font-medium transition-colors border ${
                      coupon.isActive
                        ? 'border-yellow-200 text-yellow-700 hover:bg-yellow-50'
                        : 'border-green-200 text-green-700 hover:bg-green-50'
                    }`}>
                    {coupon.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleDelete(coupon._id)}
                    className="flex-1 text-xs border border-red-200 text-red-500 rounded-xl py-1.5 font-medium hover:bg-red-50 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCouponsPage;
