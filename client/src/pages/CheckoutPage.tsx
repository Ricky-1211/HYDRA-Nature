import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { clearCart } from '../store/cartSlice';
import { orderService } from '../services/orderService';
import { Address } from '../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items, subtotal, shippingFee, discount, couponCode, tax, total } = useAppSelector(
    (state) => state.cart
  );

  // Address Form State
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const [address, setAddress] = useState<Address>({
    fullName: defaultAddress?.fullName || user?.name || '',
    street: defaultAddress?.street || '',
    apartment: defaultAddress?.apartment || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || '',
    postalCode: defaultAddress?.postalCode || '',
    country: 'India',
    phone: defaultAddress?.phone || user?.phone || '',
  });

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <h2 className="font-serif text-2xl font-bold text-[#13382B]">No items to checkout</h2>
        <Link
          to="/shop"
          className="mt-4 inline-block px-6 py-2.5 bg-[#13382B] text-white rounded-full text-xs font-semibold"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Execute payment flow
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check auth
    if (!isAuthenticated) {
      navigate('/auth?redirect=/checkout');
      return;
    }

    if (!address.fullName || !address.street || !address.city || !address.state || !address.postalCode || !address.phone) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    setPaymentLoading(true);
    setErrorMessage('');

    try {
      // 1. Create Order on Server (generates Razorpay order or fallback test order)
      const orderInitRes = await orderService.createRazorpayOrder(items, couponCode || undefined);
      const { order, keyId } = orderInitRes.data;

      // 2. Open Razorpay Checkout modal if Razorpay is loaded and key is valid
      if (window.Razorpay && !order.isMock) {
        const options = {
          key: keyId,
          amount: order.amount,
          currency: 'INR',
          name: 'Hydra Skincare',
          description: 'Luxury Botanical Skincare Order',
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=120&q=80',
          order_id: order.id,
          handler: async function (response: any) {
            try {
              // 3. Verify Payment on Server and create verified Order
              const verifyRes = await orderService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items,
                shippingAddress: address,
                couponCode: couponCode || undefined,
              });

              dispatch(clearCart());
              navigate(`/orders/${verifyRes.data._id}?status=confirmed`);
            } catch (vErr: any) {
              setErrorMessage(vErr.message || 'Payment verification failed.');
              setPaymentLoading(false);
            }
          },
          prefill: {
            name: address.fullName,
            email: user?.email,
            contact: address.phone,
          },
          theme: {
            color: '#13382B',
          },
          modal: {
            ondismiss: function () {
              setPaymentLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (failRes: any) {
          setErrorMessage(failRes.error.description || 'Payment was unsuccessful. Please retry.');
          setPaymentLoading(false);
        });
        rzp.open();
      } else {
        // Safe Development / Sandbox Instant Verification Simulation
        // Allows testing full end-to-end order placement seamlessly
        const verifyRes = await orderService.verifyPayment({
          razorpay_order_id: order.id,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          razorpay_signature: 'mock_verified_signature',
          items,
          shippingAddress: address,
          couponCode: couponCode || undefined,
        });

        dispatch(clearCart());
        navigate(`/orders/${verifyRes.data._id}?status=confirmed`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initiate order. Please try again.');
      setPaymentLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] pb-24">
      {/* Checkout Header */}
      <div className="bg-white border-b border-[#EDE8E1] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl font-bold text-[#13382B]">
            Hydra Skincare
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-[#2E6B48] font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure 256-Bit SSL Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Already have a Hydra account? Sign in for saved addresses and loyalty perks.</span>
            </div>
            <Link
              to="/auth?redirect=/checkout"
              className="text-xs font-bold text-[#13382B] hover:underline"
            >
              Sign In →
            </Link>
          </div>
        )}

        <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Shipping Address & Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE8E1] shadow-sm space-y-5">
              <h2 className="font-serif text-xl font-bold text-[#13382B] border-b border-gray-100 pb-3">
                1. Shipping Address
              </h2>

              {/* Saved Address Selector if User has any */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-700">Choose from saved addresses:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {user.addresses.map((a, i) => (
                      <div
                        key={i}
                        onClick={() => setAddress(a)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          address.street === a.street && address.postalCode === a.postalCode
                            ? 'border-[#13382B] bg-[#EAF1EB]'
                            : 'border-[#EDE8E1] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <p className="font-bold text-gray-900">{a.fullName}</p>
                        <p className="text-gray-500 text-[11px] truncate">{a.street}, {a.city}</p>
                        <p className="text-gray-500 text-[11px]">{a.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient's Name"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House / Flat / Building No. & Street"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Apartment / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Suite, unit, floor, landmark"
                    value={address.apartment || ''}
                    onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bhubaneswar"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Odisha"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Postal PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 751024"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Contact Phone Number (For Courier Updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE8E1] shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#13382B] border-b border-gray-100 pb-3">
                2. Payment Method
              </h2>

              <div className="p-4 rounded-2xl border-2 border-[#13382B] bg-[#FAF8F5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#13382B] text-white flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#13382B]">Razorpay Official Gateway</p>
                    <p className="text-[11px] text-gray-500">
                      UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking
                    </p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-4 border-[#13382B] bg-white" />
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Instant Pay */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#EDE8E1] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#13382B] border-b border-gray-100 pb-3">
                Order Review ({items.length} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-contain bg-[#FAF8F5] rounded-lg p-1 border border-[#EDE8E1]"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-gray-500">
                          Qty: {item.quantity} • {item.size || '50ml'}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-[#13382B]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon ({couponCode})</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-base font-serif font-bold text-[#13382B] pt-3 border-t border-[#EDE8E1]">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={paymentLoading}
                className="w-full py-4 bg-[#13382B] text-white rounded-full text-xs font-bold tracking-wider hover:bg-[#1E4D3B] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#13382B]/20 disabled:opacity-50"
              >
                <span>{paymentLoading ? 'PROCESSING SECURE PAYMENT...' : `PAY ₹${total.toLocaleString('en-IN')} VIA RAZORPAY`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Orders dispatched within 24h via priority courier.</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
