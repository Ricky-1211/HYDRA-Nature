import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MapPin,
  CreditCard,
  User,
  RefreshCw,
  Search,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { downloadOrderInvoicePdf } from '../../utils/invoiceGenerator';
import { Order } from '../../types';

export const FLIPKART_STATUSES = [
  { key: 'ORDER_PLACED', step: 1, label: '1. ORDER_PLACED', desc: 'Customer places order' },
  { key: 'ORDER_CONFIRMED', step: 2, label: '2. ORDER_CONFIRMED', desc: 'Backend confirms order' },
  { key: 'SHIPROCKET_CREATED', step: 3, label: '3. SHIPROCKET_CREATED', desc: 'Create shipment in Shiprocket' },
  { key: 'PICKUP_SCHEDULED', step: 4, label: '4. PICKUP_SCHEDULED', desc: 'Schedule courier pickup' },
  { key: 'PICKED_UP', step: 5, label: '5. PICKED_UP', desc: 'Courier collects parcel' },
  { key: 'IN_TRANSIT', step: 6, label: '6. IN_TRANSIT', desc: 'Parcel is travelling' },
  { key: 'OUT_FOR_DELIVERY', step: 7, label: '7. OUT_FOR_DELIVERY', desc: 'Parcel is out for delivery' },
  { key: 'DELIVERED', step: 8, label: '8. DELIVERED', desc: 'Customer receives order' },
];

export const getStatusIndex = (status: string): number => {
  if (!status) return 0;
  const s = status.toUpperCase();
  if (s === 'PENDING') return 0;
  if (s === 'PROCESSING') return 1;
  if (s === 'SHIPPED') return 5;
  if (s === 'DELIVERED') return 7;
  const idx = FLIPKART_STATUSES.findIndex((st) => st.key === s);
  return idx !== -1 ? idx : 0;
};

const statusColor: Record<string, string> = {
  ORDER_PLACED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  ORDER_CONFIRMED: 'bg-teal-100 text-teal-800 border-teal-200',
  SHIPROCKET_CREATED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  PICKUP_SCHEDULED: 'bg-purple-100 text-purple-800 border-purple-200',
  PICKED_UP: 'bg-blue-100 text-blue-800 border-blue-200',
  IN_TRANSIT: 'bg-sky-100 text-sky-800 border-sky-200',
  OUT_FOR_DELIVERY: 'bg-amber-100 text-amber-800 border-amber-200',
  DELIVERED: 'bg-green-100 text-green-800 border-green-200',
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Processing: 'bg-teal-100 text-teal-800 border-teal-200',
  Shipped: 'bg-blue-100 text-blue-800 border-blue-200',
  Delivered: 'bg-green-100 text-green-800 border-green-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [shiprocketLoading, setShiprocketLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminService.getOrders({
        status: filter !== 'All' ? filter : undefined,
      });
      const orderList = res.data?.orders || res.data || res.orders || [];
      setOrders(orderList);

      // Keep selected order in sync
      if (selectedOrder) {
        const found = orderList.find((o: Order) => o._id === selectedOrder._id);
        if (found) setSelectedOrder(found);
      } else if (orderList.length > 0) {
        setSelectedOrder(orderList[0]);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  // Strict Forward-Only Status Update Handler
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const currentOrder = orders.find((o) => o._id === orderId) || selectedOrder;
    if (!currentOrder) return;

    // Delivered is permanently locked
    if (currentOrder.status?.toUpperCase() === 'DELIVERED') {
      setActionNotice({
        type: 'error',
        text: 'This order is already DELIVERED and completed. Status is permanently locked from further updates.',
      });
      return;
    }

    // Forward progression check
    if (newStatus !== 'Cancelled') {
      const currentIdx = getStatusIndex(currentOrder.status);
      const newIdx = getStatusIndex(newStatus);

      if (newIdx <= currentIdx) {
        setActionNotice({
          type: 'error',
          text: `Forward-only progression: Order is currently at Stage ${currentIdx + 1} (${currentOrder.status}). You can only advance forward to subsequent steps.`,
        });
        return;
      }
    }

    try {
      setUpdatingId(orderId);
      setActionNotice(null);
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus as any } : o))
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
      setActionNotice({
        type: 'success',
        text: `Order status advanced to "${newStatus}". Previous stages are now locked.`,
      });
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to update order status',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateShiprocketShipment = async (orderId: string) => {
    try {
      setShiprocketLoading(true);
      setActionNotice(null);
      const res = await orderService.createShiprocketOrder(orderId);
      const updatedOrder = res.data;

      setOrders((prev) => prev.map((o) => (o._id === orderId ? updatedOrder : o)));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(updatedOrder);
      }
      setActionNotice({
        type: 'success',
        text: `Shiprocket consignment generated! Status advanced to SHIPROCKET_CREATED. AWB: ${
          updatedOrder.shiprocket?.awbCode || updatedOrder.trackingNumber
        }`,
      });
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to dispatch via Shiprocket',
      });
    } finally {
      setShiprocketLoading(false);
    }
  };

  // Filtered orders with search query
  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      filter === 'All' ||
      o.status?.toUpperCase() === filter.toUpperCase() ||
      (filter === 'DELIVERED' && o.status?.toUpperCase() === 'DELIVERED');

    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesFilter;

    const custName = typeof o.user === 'object' ? o.user?.name : '';
    const custEmail = typeof o.user === 'object' ? o.user?.email : '';
    const matchesQuery =
      o.orderNumber.toLowerCase().includes(query) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(query) ||
      custName?.toLowerCase().includes(query) ||
      custEmail?.toLowerCase().includes(query) ||
      (o.shiprocket?.awbCode && o.shiprocket.awbCode.toLowerCase().includes(query));

    return matchesFilter && matchesQuery;
  });

  const selectedCurrentIndex = selectedOrder ? getStatusIndex(selectedOrder.status) : 0;
  const isSelectedDelivered = selectedOrder?.status?.toUpperCase() === 'DELIVERED';

  return (
    <div className="space-y-6">
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#13382B]">
            Orders & Shipment Logistics
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            8-Step Flipkart Forward-Only Pipeline: Razorpay / Cash on Pay & Shiprocket Dispatch
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="px-3.5 py-1.5 bg-white text-gray-700 hover:text-[#13382B] rounded-full text-xs font-semibold border border-gray-200 hover:border-gray-300 flex items-center gap-1.5 shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <span className="text-xs font-bold text-[#13382B] bg-[#EAF1EB] px-3 py-1.5 rounded-full border border-[#B8DAC2]">
            {filteredOrders.length} Orders
          </span>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-medium flex items-center justify-between shadow-sm ${
            actionNotice.type === 'success'
              ? 'bg-[#EAF1EB] text-[#2E6B48] border border-[#B8DAC2]'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          <span>{actionNotice.text}</span>
          <button
            onClick={() => setActionNotice(null)}
            className="text-xs opacity-60 hover:opacity-100 ml-2 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search Bar & Status Filter */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order #, Customer, AWB, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-full focus:outline-none focus:border-[#13382B] bg-white shadow-sm"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex gap-1.5 flex-wrap overflow-x-auto pb-1 max-w-full">
          {['All', ...FLIPKART_STATUSES.map((s) => s.key)].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                filter.toUpperCase() === s.toUpperCase()
                  ? 'bg-[#13382B] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#13382B]'
              }`}
            >
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Orders Table (Left 7) */}
        <div className="xl:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-72">
              <div className="w-8 h-8 border-4 border-[#13382B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-72 text-gray-400 text-xs">
              <Package className="w-12 h-12 mb-2 opacity-30 text-gray-500" />
              <p className="font-semibold text-gray-600">No orders found</p>
              <p className="text-gray-400 text-[11px] mt-0.5">Try clearing filters or search criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#FAF8F5] border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                      Order / Date
                    </th>
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                      Stage / Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredOrders.map((order) => {
                    const isSelected = selectedOrder?._id === order._id;
                    const customerName =
                      typeof order.user === 'object' && order.user?.name
                        ? order.user.name
                        : order.shippingAddress?.fullName || 'Customer';

                    const stageNumber = getStatusIndex(order.status) + 1;

                    return (
                      <tr
                        key={order._id}
                        onClick={() => setSelectedOrder(order)}
                        className={`hover:bg-[#FAF8F5] cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#F4F8F5] ring-1 ring-inset ring-[#13382B]/30' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <p className="font-mono font-bold text-[#13382B] text-xs">
                            #{order.orderNumber}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900 truncate max-w-[130px]">
                            {customerName}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate max-w-[130px]">
                            {order.shippingAddress?.city}
                          </p>
                        </td>

                        <td className="px-4 py-3 font-semibold text-gray-900">
                          ₹{order.total.toLocaleString('en-IN')}
                          <span className="block text-[10px] text-gray-500 font-normal">
                            {order.paymentMethod === 'cod'
                              ? order.paymentStatus === 'completed'
                                ? 'COD (Collected)'
                                : 'COD (Pending)'
                              : 'Razorpay Paid'}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border block w-fit truncate max-w-[160px] ${
                              statusColor[order.status] || 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            Step {stageNumber}: {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Order Detail Panel (Right 5) */}
        <div className="xl:col-span-5 bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 space-y-5">
          {selectedOrder ? (
            <div className="space-y-5 text-xs">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                    Order Details
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#13382B]">
                    #{selectedOrder.orderNumber}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => downloadOrderInvoicePdf(selectedOrder)}
                  className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#13382B] text-[#13382B] hover:text-white rounded-full text-xs font-semibold flex items-center gap-1.5 border border-[#EDE8E1] transition-all"
                  title="Generate Official PDF Tax Invoice"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Invoice PDF</span>
                </button>
              </div>

              {/* Strict Forward-Only Status Updater */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EDE8E1] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-800 text-xs">Order Fulfillment Pipeline:</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#EDE8E1] text-[#13382B]">
                    Stage {selectedCurrentIndex + 1} of 8
                  </span>
                </div>

                {isSelectedDelivered ? (
                  <div className="p-3 bg-[#EAF1EB] text-[#2E6B48] rounded-xl border border-[#B8DAC2] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2E6B48]" />
                      <span className="font-bold text-xs">DELIVERED (Customer received order)</span>
                    </div>
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-[#B8DAC2] flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#2E6B48]" />
                      <span>Locked</span>
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                      disabled={updatingId === selectedOrder._id}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#13382B] shadow-sm"
                    >
                      {FLIPKART_STATUSES.map((st, idx) => {
                        const isPast = idx < selectedCurrentIndex;
                        const isCurrent = idx === selectedCurrentIndex;

                        return (
                          <option
                            key={st.key}
                            value={st.key}
                            disabled={isPast || isCurrent}
                            className={
                              isPast
                                ? 'text-gray-400 bg-gray-100 font-normal'
                                : isCurrent
                                ? 'font-bold bg-[#EAF1EB] text-[#2E6B48]'
                                : 'text-gray-900 font-semibold'
                            }
                          >
                            {st.label} — {st.desc}{' '}
                            {isPast
                              ? '(Locked - Passed)'
                              : isCurrent
                              ? '(Current Stage)'
                              : '→ Advance Forward'}
                          </option>
                        );
                      })}
                    </select>

                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-0.5">
                      <Lock className="w-3 h-3 text-amber-600 flex-shrink-0" />
                      <span>
                        <strong>Locked rule:</strong> Status can only advance forward. Previous stages are locked.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Shiprocket Section */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                    <Truck className="w-4 h-4 text-indigo-700" />
                    <span>Shiprocket Logistics (Stage 3)</span>
                  </div>
                  {selectedOrder.shiprocket?.trackingUrl && (
                    <a
                      href={selectedOrder.shiprocket.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-indigo-700 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Track Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Courier:</span>
                    <strong className="text-gray-900">
                      {selectedOrder.shiprocket?.courierName || 'Pending Assignment'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">AWB Code:</span>
                    <strong className="font-mono text-gray-900">
                      {selectedOrder.shiprocket?.awbCode || selectedOrder.trackingNumber || 'Not generated'}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCreateShiprocketShipment(selectedOrder._id)}
                  disabled={shiprocketLoading || isSelectedDelivered}
                  className="w-full py-2 bg-indigo-700 text-white rounded-lg text-xs font-semibold hover:bg-indigo-800 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>
                    {shiprocketLoading
                      ? 'Generating Shipment...'
                      : selectedOrder.shiprocket?.awbCode
                      ? 'Re-sync Shiprocket Shipment'
                      : 'Dispatch & Generate Shiprocket AWB'}
                  </span>
                </button>
              </div>

              {/* Customer Info & Shipping Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-700 font-bold text-[11px]">
                    <User className="w-3.5 h-3.5 text-[#2E6B48]" />
                    <span>Customer Details</span>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {typeof selectedOrder.user === 'object'
                      ? selectedOrder.user?.name
                      : selectedOrder.shippingAddress?.fullName}
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    {typeof selectedOrder.user === 'object' ? selectedOrder.user?.email : '—'}
                  </p>
                  <p className="text-gray-600 font-mono text-[11px]">
                    Ph: {selectedOrder.shippingAddress?.phone}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-700 font-bold text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-[#2E6B48]" />
                    <span>Shipping Destination</span>
                  </div>
                  <p className="text-gray-700 leading-snug">
                    {selectedOrder.shippingAddress?.street}
                    {selectedOrder.shippingAddress?.apartment
                      ? `, ${selectedOrder.shippingAddress.apartment}`
                      : ''}
                  </p>
                  <p className="text-gray-600 font-medium">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{' '}
                    {selectedOrder.shippingAddress?.postalCode}
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#2E6B48]" />
                  <div>
                    <p className="font-bold text-gray-900">
                      {selectedOrder.paymentMethod === 'cod'
                        ? 'Cash on Delivery (Cash on Pay)'
                        : 'Razorpay Payment'}
                    </p>
                    <p className="text-[10px] font-mono text-gray-500">
                      {selectedOrder.paymentMethod === 'cod'
                        ? 'Payable to courier upon delivery'
                        : `ID: ${selectedOrder.paymentDetails?.razorpayPaymentId || 'Verified Online'}`}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    selectedOrder.paymentStatus === 'completed'
                      ? 'bg-[#EAF1EB] text-[#2E6B48]'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedOrder.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2 pt-1 border-t border-gray-100">
                <h4 className="font-bold text-gray-800 text-xs">
                  Ordered Formulations ({selectedOrder.items?.length || 0})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#FAF8F5] border border-gray-100"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-contain bg-white rounded-lg p-0.5 border border-gray-200"
                        />
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-gray-400">
                            Qty: {item.quantity} • {item.size || '50ml'}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({selectedOrder.couponCode || 'PROMO'})</span>
                    <span>-₹{selectedOrder.discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-700 font-bold">FREE (All Purchases)</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (Inclusive)</span>
                  <span className="text-emerald-700 font-semibold">Included in Price (₹0)</span>
                </div>
                <div className="flex justify-between text-sm font-serif font-bold text-[#13382B] pt-2 border-t border-gray-200">
                  <span>Total Amount {selectedOrder.paymentMethod === 'cod' ? 'Payable' : 'Paid'}</span>
                  <span>₹{selectedOrder.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-gray-400 text-xs text-center">
              <Package className="w-10 h-10 mb-2 opacity-30" />
              <p className="font-semibold text-gray-600">Select an order</p>
              <p className="text-gray-400 text-[11px] mt-0.5">
                Click any order in the list to view its complete details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
