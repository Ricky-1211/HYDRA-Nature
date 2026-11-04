import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { orderService } from '../services/orderService';
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
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-40 bg-gray-200 rounded-3xl" />
        <div className="h-40 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF8F5] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#EDE8E1] py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-[#13382B]">
            Order History & Tracking
          </h1>
          <Link
            to="/shop"
            className="text-xs font-semibold text-[#13382B] hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EDE8E1]">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-[#13382B]">No Past Orders Yet</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              You haven't placed any orders with Hydra yet. Discover our pure botanical formulations.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-block px-6 py-2.5 bg-[#13382B] text-white rounded-full text-xs font-semibold hover:bg-[#1E4D3B]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE8E1] shadow-sm space-y-5"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 text-xs">
                  <div>
                    <span className="text-gray-400">Order Number:</span>
                    <strong className="text-gray-900 ml-1.5 font-mono text-sm">
                      {order.orderNumber}
                    </strong>
                    <span className="text-gray-400 ml-3">Placed on:</span>
                    <span className="text-gray-700 ml-1 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <Link
                      to={`/orders/${order._id}`}
                      className="px-4 py-1.5 bg-[#FAF8F5] hover:bg-[#13382B] text-[#13382B] hover:text-white rounded-full text-xs font-semibold transition-colors flex items-center gap-1 border border-[#EDE8E1]"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Ordered Items Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-2xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-[#EDE8E1]"
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-500">
                          Qty: {item.quantity} • {item.size || '50ml'}
                        </p>
                        <p className="text-xs font-serif font-bold text-[#13382B] mt-0.5">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Total & Address Preview */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 gap-2">
                  <p>
                    Delivery to:{' '}
                    <strong>
                      {order.shippingAddress.fullName}, {order.shippingAddress.city} (
                      {order.shippingAddress.postalCode})
                    </strong>
                  </p>
                  <p className="font-serif text-sm font-bold text-[#13382B]">
                    Paid Total: ₹{order.total.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
