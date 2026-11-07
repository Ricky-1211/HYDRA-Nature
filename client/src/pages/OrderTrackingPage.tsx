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
  Download,
  ExternalLink,
  ShoppingBag,
  PackagePlus,
  CalendarClock,
  PackageCheck,
  Navigation,
  Gift,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { downloadOrderInvoicePdf } from '../utils/invoiceGenerator';
import { Order } from '../types';

interface FlipkartStep {
  step: number;
  status: string;
  title: string;
  action: string;
  icon: React.FC<{ className?: string }>;
}

const FLIPKART_STEPS: FlipkartStep[] = [
  { step: 1, status: 'ORDER_PLACED', title: 'Order Placed', action: 'Customer places order', icon: ShoppingBag },
  { step: 2, status: 'ORDER_CONFIRMED', title: 'Order Confirmed', action: 'Backend confirms order', icon: CheckCircle2 },
  { step: 3, status: 'SHIPROCKET_CREATED', title: 'Shiprocket Created', action: 'Create shipment in Shiprocket', icon: PackagePlus },
  { step: 4, status: 'PICKUP_SCHEDULED', title: 'Pickup Scheduled', action: 'Schedule courier pickup', icon: CalendarClock },
  { step: 5, status: 'PICKED_UP', title: 'Picked Up', action: 'Courier collects parcel', icon: PackageCheck },
  { step: 6, status: 'IN_TRANSIT', title: 'In Transit', action: 'Parcel is travelling', icon: Truck },
  { step: 7, status: 'OUT_FOR_DELIVERY', title: 'Out For Delivery', action: 'Parcel is out for delivery', icon: Navigation },
  { step: 8, status: 'DELIVERED', title: 'Delivered', action: 'Customer receives order', icon: Gift },
];

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
      <div className="max-w-5xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-56 bg-gray-200 rounded-3xl" />
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

  // Calculate current active step index in the 8-step pipeline
  const getStepIndex = (status: string) => {
    const s = status ? status.toUpperCase() : '';
    if (s === 'PENDING') return 0;
    if (s === 'PROCESSING') return 1;
    if (s === 'SHIPPED') return 5;
    if (s === 'DELIVERED') return 7;
    const idx = FLIPKART_STEPS.findIndex((st) => st.status === s);
    return idx !== -1 ? idx : 0;
  };

  const currentStepIndex = getStepIndex(order.status);
  const isDelivered = order.status && order.status.toUpperCase() === 'DELIVERED';

  // Helper to find log message or timestamp for a step if recorded in tracking history
  const getHistoryForStep = (stepStatus: string) => {
    if (!order.trackingHistory) return null;
    return order.trackingHistory.find(
      (h) => h.status.toUpperCase() === stepStatus || h.status.toUpperCase().includes(stepStatus)
    );
  };

  return (
    <div className="w-full bg-[#FAF8F5] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#EDE8E1] py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/orders"
            className="text-xs text-gray-500 hover:text-[#13382B] flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            {isDelivered ? (
              <button
                type="button"
                onClick={() => downloadOrderInvoicePdf(order)}
                className="px-3.5 py-1.5 bg-[#EAF1EB] hover:bg-[#d8e8dc] text-[#2E6B48] rounded-full text-xs font-semibold flex items-center gap-1.5 border border-[#B8DAC2] transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-[#2E6B48]" />
                <span>Download Tax Invoice (PDF)</span>
              </button>
            ) : (
              <span className="text-[11px] text-gray-400 font-medium bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#EDE8E1]">
                Invoice available upon delivery
              </span>
            )}
            <span className="text-xs font-mono font-bold text-[#13382B] hidden sm:inline bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
              #{order.orderNumber}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Flipkart-Style Main Tracking Carte */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE8E1] shadow-sm space-y-6">
          {/* Top Info Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#2E6B48] font-bold bg-[#EAF1EB] px-2.5 py-0.5 rounded-full">
                Order Tracking
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#13382B] mt-1.5">
                Current Status: {FLIPKART_STEPS[currentStepIndex]?.title || order.status}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Order #{order.orderNumber} • Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            {order.shiprocket?.awbCode && (
              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#EDE8E1] text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-gray-700 font-semibold">
                  <Truck className="w-4 h-4 text-[#2E6B48]" />
                  <span>{order.shiprocket.courierName || 'Priority Air Express'}</span>
                </div>
                <p className="font-mono text-[11px] text-gray-500">
                  AWB: <strong>{order.shiprocket.awbCode}</strong>
                </p>
                {order.shiprocket.trackingUrl && (
                  <a
                    href={order.shiprocket.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#2E6B48] font-semibold hover:underline flex items-center gap-1 pt-0.5"
                  >
                    <span>Live Courier Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Flipkart Stepper Timeline (Horizontal on md+, Vertical on Mobile) */}
          <div className="py-2">
            {/* Desktop Horizontal Connected Stepper */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Connecting Line Behind Circles */}
                <div className="absolute top-4 left-6 right-6 h-1 bg-gray-200 -z-0">
                  <div
                    className="h-full bg-[#2E6B48] transition-all duration-500"
                    style={{
                      width: `${(currentStepIndex / (FLIPKART_STEPS.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {/* Steps Nodes */}
                <div className="grid grid-cols-8 gap-1 relative z-10">
                  {FLIPKART_STEPS.map((st, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    const IconComp = st.icon;

                    return (
                      <div key={st.step} className="flex flex-col items-center text-center px-1">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCompleted
                              ? 'bg-[#2E6B48] text-white shadow-md'
                              : isCurrent
                              ? 'bg-[#13382B] text-white ring-4 ring-[#2E6B48]/20 shadow-lg scale-110'
                              : 'bg-white border-2 border-gray-300 text-gray-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : (
                            <IconComp className="w-4 h-4" />
                          )}
                        </div>

                        <span
                          className={`text-[10px] font-bold mt-2.5 leading-tight ${
                            isCurrent
                              ? 'text-[#13382B]'
                              : isCompleted
                              ? 'text-[#2E6B48]'
                              : 'text-gray-400'
                          }`}
                        >
                          {st.title}
                        </span>

                        <span className="text-[9px] text-gray-400 mt-0.5 line-clamp-2">
                          {st.action}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile / Tablet Vertical Stepper */}
            <div className="block lg:hidden space-y-4">
              {FLIPKART_STEPS.map((st, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const IconComp = st.icon;
                const history = getHistoryForStep(st.status);

                return (
                  <div key={st.step} className="flex items-start gap-3.5 relative">
                    {/* Vertical connecting line */}
                    {idx < FLIPKART_STEPS.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-px ${
                          idx < currentStepIndex ? 'bg-[#2E6B48]' : 'bg-gray-200'
                        }`}
                      />
                    )}

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 relative z-10 ${
                        isCompleted
                          ? 'bg-[#2E6B48] text-white shadow-sm'
                          : isCurrent
                          ? 'bg-[#13382B] text-white ring-4 ring-[#2E6B48]/20 shadow-md'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : <IconComp className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-xs font-bold ${
                            isCurrent ? 'text-[#13382B]' : isCompleted ? 'text-[#2E6B48]' : 'text-gray-400'
                          }`}
                        >
                          Step {st.step}: {st.title}
                        </p>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isCurrent
                              ? 'bg-amber-100 text-amber-800'
                              : isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {isCurrent ? 'Active' : isCompleted ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5">{st.action}</p>
                      {history && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(history.timestamp).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Flipkart Tracking Grid Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE8E1] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#13382B]">
                Tracking Milestone Grid
              </h3>
              <p className="text-xs text-gray-500">
                Detailed 8-stage verification pipeline for consignment #{order.orderNumber}
              </p>
            </div>
            <span className="text-xs font-bold text-[#2E6B48] bg-[#EAF1EB] px-3 py-1 rounded-full border border-[#B8DAC2]">
              Stage {currentStepIndex + 1} of 8
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-gray-200 text-gray-600 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="px-3.5 py-3">Step</th>
                  <th className="px-3.5 py-3">Order Status</th>
                  <th className="px-3.5 py-3">Action Description</th>
                  <th className="px-3.5 py-3">Fulfillment State</th>
                  <th className="px-3.5 py-3">Timestamp / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {FLIPKART_STEPS.map((st, idx) => {
                  const isCompleted = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const history = getHistoryForStep(st.status);

                  return (
                    <tr
                      key={st.step}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-[#F7FAF8] font-semibold'
                          : isCompleted
                          ? 'bg-white hover:bg-gray-50/70'
                          : 'bg-white opacity-60'
                      }`}
                    >
                      <td className="px-3.5 py-3 font-mono text-gray-500 font-bold">
                        {st.step}
                      </td>

                      <td className="px-3.5 py-3">
                        <span
                          className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                            isCurrent
                              ? 'bg-[#13382B] text-white'
                              : isCompleted
                              ? 'bg-[#EAF1EB] text-[#2E6B48]'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>

                      <td className="px-3.5 py-3 text-gray-700">
                        {st.action}
                      </td>

                      <td className="px-3.5 py-3">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Completed</span>
                          </span>
                        ) : isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            <span>In Progress</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-400">Upcoming</span>
                        )}
                      </td>

                      <td className="px-3.5 py-3 text-[11px] text-gray-500">
                        {history ? (
                          <span>{new Date(history.timestamp).toLocaleString('en-IN')}</span>
                        ) : isCompleted || isCurrent ? (
                          <span>Verified in system</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Two Column Breakdown: Shipping Destination & Payment Breakdown */}
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
              <p>{order.shippingAddress.country || 'India'}</p>
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
                <span>Payment Method</span>
                <span className="font-semibold text-gray-800">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay Gateway'}
                </span>
              </div>
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
                <span className="text-emerald-700 font-bold">FREE (All Purchases)</span>
              </div>
              <div className="flex justify-between">
                <span>GST (Inclusive)</span>
                <span className="text-emerald-700 font-semibold">Included in Price (₹0)</span>
              </div>
              <div className="flex justify-between font-serif text-sm font-bold text-[#13382B] pt-2 border-t border-gray-100">
                <span>Total {order.paymentMethod === 'cod' ? 'Due on Delivery' : 'Paid'}</span>
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

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 p-3 bg-[#FAF8F5] rounded-2xl border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-[#EDE8E1]"
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

export default OrderTrackingPage;
