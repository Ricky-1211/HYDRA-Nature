import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Download,
  CreditCard,
  Banknote,
  MapPin,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { downloadOrderInvoicePdf } from '../utils/invoiceGenerator';
import { Order } from '../types';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    const s = status ? status.toUpperCase() : '';
    switch (s) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'OUT_FOR_DELIVERY':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'IN_TRANSIT':
      case 'PICKED_UP':
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PICKUP_SCHEDULED':
      case 'SHIPROCKET_CREATED':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'ORDER_CONFIRMED':
      case 'PROCESSING':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'ORDER_PLACED':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    if (!status) return 'Order Placed';
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-32 bg-gray-200 rounded-2xl" />
        <div className="h-32 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF8F5] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-[#EDE8E1] py-3.5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl font-bold text-[#13382B]">
              Order History & Tracking
            </h1>
            <p className="text-[11px] text-gray-500">Track shipments and download tax invoices</p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-[#13382B] hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-[#EDE8E1] shadow-sm">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
            <h3 className="font-serif text-lg font-bold text-[#13382B]">No Past Orders Yet</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              You haven't placed any orders with Hydra yet. Discover our pure botanical formulations.
            </p>
            <Link
              to="/shop"
              className="mt-5 inline-block px-5 py-2 bg-[#13382B] text-white rounded-full text-xs font-semibold hover:bg-[#1E4D3B]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isDelivered = order.status && order.status.toUpperCase() === 'DELIVERED';

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE8E1] shadow-sm hover:shadow-md transition-shadow space-y-3.5"
                >
                  {/* Compact Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-100 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gray-400">Order</span>
                      <strong className="text-gray-900 font-mono text-xs">
                        #{order.orderNumber}
                      </strong>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {formatStatus(order.status)}
                      </span>

                      {/* Invoice button ONLY shown when status is Delivered */}
                      {isDelivered && (
                        <button
                          type="button"
                          onClick={() => downloadOrderInvoicePdf(order)}
                          className="px-3 py-1 bg-[#EAF1EB] hover:bg-[#d8e8dc] text-[#2E6B48] rounded-full text-xs font-semibold transition-colors flex items-center gap-1 border border-[#B8DAC2] shadow-sm"
                          title="Download Tax Invoice"
                        >
                          <Download className="w-3 h-3 text-[#2E6B48]" />
                          <span>Invoice (PDF)</span>
                        </button>
                      )}

                      <Link
                        to={`/orders/${order._id}`}
                        className="px-3.5 py-1 bg-[#13382B] hover:bg-[#1E4D3B] text-white rounded-full text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Truck className="w-3 h-3" />
                        <span>Track</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Compact Shiprocket Courier Bar if available */}
                  {order.shiprocket?.awbCode && (
                    <div className="bg-[#FAF8F5] rounded-xl px-3 py-1.5 border border-[#EDE8E1] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Truck className="w-3.5 h-3.5 text-[#2E6B48]" />
                        <span className="font-semibold">{order.shiprocket.courierName || 'Priority Courier'}</span>
                        <span className="text-gray-400">•</span>
                        <span className="font-mono text-gray-600">AWB: {order.shiprocket.awbCode}</span>
                      </div>
                      {order.shiprocket.etd && (
                        <span className="text-[#2E6B48] font-medium text-[10px]">
                          Est: {order.shiprocket.etd}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Compact Items Row */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-colors border border-gray-100"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-contain rounded-lg bg-white p-0.5 border border-[#EDE8E1] flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                            <p className="text-[10px] text-gray-500">
                              Qty: {item.quantity} • {item.size || '50ml'}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs font-serif font-bold text-[#13382B] flex-shrink-0">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Compact Bottom Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 gap-2">
                    <p className="truncate text-[11px]">
                      To: <strong className="text-gray-800">{order.shippingAddress.fullName}</strong> ({order.shippingAddress.city}, {order.shippingAddress.postalCode})
                    </p>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      {order.paymentMethod === 'cod' ? (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.paymentStatus === 'completed'
                            ? 'bg-[#EAF1EB] text-[#2E6B48]'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          Cash on Delivery ({order.paymentStatus === 'completed' ? 'Collected' : 'Pay on Delivery'})
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#2E6B48] font-bold bg-[#EAF1EB] px-2 py-0.5 rounded-full">
                          Razorpay Paid
                        </span>
                      )}
                      <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                        Free Shipping
                      </span>
                      <p className="font-serif text-sm font-bold text-[#13382B]">
                        ₹{order.total.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
