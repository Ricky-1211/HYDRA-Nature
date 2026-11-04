import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';

interface Order {
  _id: string;
  orderNumber: string;
  user: { name: string; email: string } | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: { name: string; quantity: number; price: number }[];
}

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminService.getOrders({ status: filter !== 'all' ? filter : undefined });
      setOrders(res.data?.orders || res.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-hydra-dark">Order Management</h1>
          <p className="text-hydra-muted text-sm mt-1">Track and manage all customer orders</p>
        </div>
        <span className="text-sm text-hydra-muted bg-hydra-cream px-3 py-1 rounded-full">
          {filtered.length} orders
        </span>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...STATUS_OPTIONS].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              filter === s
                ? 'bg-hydra-dark text-white'
                : 'bg-white text-hydra-muted border border-gray-200 hover:border-hydra-dark'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Orders Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-hydra-dark border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-hydra-muted">
              <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-hydra-cream">
                  <tr>
                    {['Order', 'Customer', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-hydra-muted uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(order => (
                    <tr
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedOrder?._id === order._id ? 'bg-green-50' : ''}`}
                    >
                      <td className="px-4 py-3 text-sm font-mono font-semibold text-hydra-dark">
                        #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-hydra-dark">{order.user?.name || 'Guest'}</div>
                        <div className="text-xs text-hydra-muted">{order.user?.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-hydra-dark">
                        ₹{order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-hydra-muted">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={e => { e.stopPropagation(); handleStatusUpdate(order._id, e.target.value); }}
                          disabled={updatingId === order._id}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-hydra-dark"
                          onClick={e => e.stopPropagation()}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s} className="capitalize">{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Detail Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {selectedOrder ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-playfair font-bold text-hydra-dark text-lg">
                  Order #{selectedOrder.orderNumber || selectedOrder._id.slice(-6).toUpperCase()}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-hydra-muted">
                  <span>Customer</span>
                  <span className="text-hydra-dark font-medium">{selectedOrder.user?.name || 'Guest'}</span>
                </div>
                <div className="flex justify-between text-hydra-muted">
                  <span>Email</span>
                  <span className="text-hydra-dark">{selectedOrder.user?.email || '—'}</span>
                </div>
                <div className="flex justify-between text-hydra-muted">
                  <span>Payment</span>
                  <span className="text-hydra-dark capitalize">{selectedOrder.paymentStatus}</span>
                </div>
                <div className="flex justify-between text-hydra-muted">
                  <span>Date</span>
                  <span className="text-hydra-dark">{new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
              <hr className="border-gray-100" />
              <div>
                <h4 className="font-semibold text-hydra-dark mb-3 text-sm">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-hydra-muted">{item.name} × {item.quantity}</span>
                      <span className="text-hydra-dark font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between font-semibold text-hydra-dark">
                <span>Total</span>
                <span>₹{selectedOrder.totalAmount?.toLocaleString()}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-hydra-dark mb-1">Update Status</label>
                <select
                  value={selectedOrder.status}
                  onChange={e => handleStatusUpdate(selectedOrder._id, e.target.value)}
                  disabled={updatingId === selectedOrder._id}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hydra-dark"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-hydra-muted text-sm">
              <svg className="w-10 h-10 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
              </svg>
              <p>Click an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
