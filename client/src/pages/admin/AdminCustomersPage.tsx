import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  ordersCount?: number;
  totalSpent?: number;
}

const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await adminService.getCustomers();
        setCustomers(res.data?.customers || res.customers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-hydra-dark">Customer Management</h1>
          <p className="text-hydra-muted text-sm mt-1">View and manage your customer base</p>
        </div>
        <span className="text-sm text-hydra-muted bg-hydra-cream px-3 py-1 rounded-full">
          {filtered.length} customers
        </span>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hydra-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hydra-dark"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-hydra-dark border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-hydra-muted">
            <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p>No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-hydra-cream">
                <tr>
                  {['Customer', 'Email', 'Phone', 'Role', 'Joined', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-hydra-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(customer => (
                  <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-hydra-dark flex items-center justify-center text-white text-sm font-semibold">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-hydra-dark text-sm">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-hydra-muted">{customer.email}</td>
                    <td className="px-4 py-3 text-sm text-hydra-muted">{customer.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        customer.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {customer.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-hydra-muted">
                      {new Date(customer.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        customer.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {customer.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomersPage;
