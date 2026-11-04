import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-48 bg-gray-200 rounded-3xl" />
        <div className="h-64 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="font-serif text-2xl font-bold text-[#13382B]">Order Not Found</h2>
        <Link
          to="/orders"
          className="mt-4 inline-block px-6 py-2.5 bg-[#13382B] text-white rounded-full text-xs font-semibold"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  const steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 1;

  return (
    <div className="w-full bg-[#FAF8F5] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#EDE8E1] py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/orders"
            className="text-xs text-gray-500 hover:text-[#13382B] flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </Link>
          <span className="text-xs font-bold text-[#13382B]">
            Tracking #{order.trackingNumber || `HYD-${order.orderNumber}`}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Order Status Banner */}
        <div className="bg-[#13382B] text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold">
              Real-Time Tracking Status
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">
              Order {order.status}
            </h1>
            <p className="text-xs sm:text-sm text-[#CCDED2] max-w-md">
              Order #{order.orderNumber} placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              .
            </p>
          </div>

          {/* Stepper Timeline */}
          <div className="relative z-10 mt-10 pt-6 border-t border-[#23503E]">
            <div className="grid grid-cols-4 gap-2 text-center">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-[#C5A880] text-[#13382B] shadow-md'
                          : 'bg-[#23503E] text-gray-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] mt-2 font-medium ${
                        isCurrent
                          ? 'text-[#C5A880] font-bold'
                          : isCompleted
                          ? 'text-white'
                          : 'text-[#688E7D]'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tracking Logs & Events */}
        {order.trackingHistory && order.trackingHistory.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE8E1] shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#13382B] border-b border-gray-100 pb-3">
              Shipment Activity Timeline
            </h3>

            <div className="space-y-4 pl-2 border-l-2 border-[#13382B]/20 ml-3">
              {order.trackingHistory.map((history, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute -left-[19px] top-1 w-3.5 h-3.5 rounded-full bg-[#13382B] border-2 border-white" />
                  <p className="text-xs font-bold text-gray-900">{history.status}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{history.message}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(history.timestamp).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two Column Breakdown: Shipping Address & Invoice Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE8E1] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#13382B] font-bold text-sm">
              <MapPin className="w-4 h-4 text-[#2E6B48]" />
              <h3 className="font-serif">Delivery Destination</h3>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="pt-2 text-gray-800 font-semibold">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-3xl p-6 border border-[#EDE8E1] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#13382B] font-bold text-sm">
              <CreditCard className="w-4 h-4 text-[#2E6B48]" />
              <h3 className="font-serif">Payment & Invoice Breakdown</h3>
            </div>
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Voucher Discount</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Courier Shipping</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-serif text-sm font-bold text-[#13382B] pt-2 border-t border-gray-100">
                <span>Total Paid</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE8E1] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#13382B] border-b border-gray-100 pb-3">
            Included Formulations ({order.items.length})
          </h3>

          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 p-3 bg-[#FAF8F5] rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-[#EDE8E1]"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-500">
                      Quantity: {item.quantity} • Volume: {item.size || '50ml'}
                    </p>
                  </div>
                </div>

                <p className="font-serif text-sm font-bold text-[#13382B]">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
