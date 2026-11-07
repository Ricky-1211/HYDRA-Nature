import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, CheckCircle, XCircle, CreditCard, AlertTriangle, Phone } from 'lucide-react';

export const ReturnPolicy: React.FC = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#F0ECE4] to-[#FAF8F5] border-b border-[#EDE8E1] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <RotateCcw className="w-6 h-6 text-[#C5A880]" />
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-medium">Legal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#13382B] leading-tight">
            Return &amp; Refund Policy
          </h1>
          <p className="text-sm text-gray-500 mt-3">Last updated: November 2026 · Effective: 1 November 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-gray-700 text-sm leading-relaxed">

        <p>
          At <strong className="text-[#13382B]">Hydra Skincare</strong>, your satisfaction is our highest priority. If
          for any reason you are not completely happy with your purchase, this policy explains how to initiate a return,
          exchange, or refund.
        </p>

        {/* Quick summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <RotateCcw className="w-5 h-5" />, title: '14-Day Returns', desc: 'From date of delivery' },
            { icon: <CreditCard className="w-5 h-5" />, title: '5–7 Day Refunds', desc: 'After return received' },
            { icon: <CheckCircle className="w-5 h-5" />, title: 'Free Exchange', desc: 'On damaged / defective items' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white border border-[#EDE8E1] rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-[#F0ECE4] flex items-center justify-center text-[#13382B] mx-auto mb-3">
                {icon}
              </div>
              <h3 className="font-serif font-semibold text-[#13382B] text-sm mb-1">{title}</h3>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        {/* Section 1 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#C5A880]" /> 1. Return Eligibility
          </h2>
          <p className="mb-3">
            We accept returns within <strong>14 calendar days</strong> of the delivery date, subject to the following
            conditions:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-[#EDE8E1] rounded-xl p-5">
              <h3 className="font-semibold text-green-700 flex items-center gap-2 mb-3 text-xs uppercase tracking-wide">
                <CheckCircle className="w-4 h-4" /> Eligible for Return
              </h3>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Product is <strong>unopened and sealed</strong> in original packaging</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Product received in <strong>damaged or defective</strong> condition</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> <strong>Wrong product</strong> delivered — different from what you ordered</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Product is within its <strong>expiry date</strong> at time of return</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> All <strong>original tags, labels, and batch stickers</strong> are intact</li>
              </ul>
            </div>
            <div className="bg-white border border-[#EDE8E1] rounded-xl p-5">
              <h3 className="font-semibold text-red-600 flex items-center gap-2 mb-3 text-xs uppercase tracking-wide">
                <XCircle className="w-4 h-4" /> Not Eligible for Return
              </h3>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> <strong>Opened or used</strong> products (including broken seals)</li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> Products returned <strong>after 14 days</strong> from delivery</li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> <strong>Personalised or custom-blended</strong> formulations</li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> Items purchased during <strong>clearance, final-sale</strong> events</li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> Products with <strong>missing labels, tampering, or odour</strong></li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span> Adverse reactions (please do a patch test before full application)</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-xs bg-[#F0ECE4] rounded-lg p-3">
            Due to the intimate nature of skincare and hygiene products, we strictly follow these guidelines to ensure
            product integrity and safety for all customers.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">2. How to Initiate a Return</h2>
          <div className="space-y-3">
            {[
              ['Step 1 — Contact Us', 'Email support@hydraskincare.in or WhatsApp +91 80 1234 5678 within 14 days of delivery. Include your order number, reason for return, and clear photographs of the product and packaging.'],
              ['Step 2 — Approval', 'Our team will review your request within 2 business days and send you a Return Merchandise Authorization (RMA) number along with the return address.'],
              ['Step 3 — Pack & Ship', 'Securely pack the product in its original packaging. Write the RMA number on the outer box. For defective/wrong items, we arrange a free reverse pickup. For change-of-mind returns, the customer arranges and pays for return shipping.'],
              ['Step 4 — Inspection', 'Once received, our quality team inspects the item within 1–2 business days. You will be notified of the outcome via email.'],
              ['Step 5 — Refund or Exchange', 'Upon approval, your refund is processed within 5–7 business days, or your replacement is dispatched within 2 business days.'],
            ].map(([title, desc], i) => (
              <div key={i} className="bg-white border border-[#EDE8E1] rounded-xl p-5 flex gap-4">
                <div className="w-7 h-7 rounded-full bg-[#13382B] text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-[#13382B] mb-1">{title}</p>
                  <p className="text-xs text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#C5A880]" /> 3. Refund Timeline &amp; Methods
          </h2>
          <p className="mb-3">
            Approved refunds are credited back to the original payment method:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-[#EDE8E1] rounded-xl overflow-hidden">
              <thead className="bg-[#F0ECE4] text-[#13382B]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Payment Method</th>
                  <th className="px-4 py-3 text-left font-semibold">Refund Timeline</th>
                  <th className="px-4 py-3 text-left font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE8E1]">
                {[
                  ['Credit / Debit Card', '5–7 business days', 'Processed via Razorpay to your bank'],
                  ['UPI / Net Banking', '3–5 business days', 'Directly to your UPI-linked bank account'],
                  ['Wallets (Paytm, PhonePe)', '2–3 business days', 'Credited to the same wallet'],
                  ['Cash on Delivery (COD)', '5–7 business days', 'Refunded via NEFT/IMPS — provide bank details'],
                  ['Hydra Store Credit', 'Instant', 'Credited to your Hydra account for future orders'],
                ].map(([method, timeline, notes]) => (
                  <tr key={method} className="bg-white hover:bg-[#FAF8F5]">
                    <td className="px-4 py-3 font-medium text-[#13382B]">{method}</td>
                    <td className="px-4 py-3 text-gray-600">{timeline}</td>
                    <td className="px-4 py-3 text-gray-500 text-[11px]">{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            * Shipping charges (original + return) are non-refundable unless the return is due to our error (wrong or
            defective item).
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">4. Exchange Policy</h2>
          <p className="mb-3">
            We offer <strong>free exchanges</strong> for the following situations:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Wrong product or shade delivered</li>
            <li>Product arrived damaged, broken, or leaking</li>
            <li>Manufacturing defect identified within 7 days of delivery</li>
          </ul>
          <p className="mt-3">
            For <strong>voluntary exchanges</strong> (e.g., different size or variant), the product must be unopened
            and you must bear return shipping charges (₹79). Exchange shipping to you is free for orders above ₹999.
            Stock availability determines whether an exact exchange can be fulfilled.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#C5A880]" /> 5. Damaged or Defective Items
          </h2>
          <div className="bg-[#F0ECE4] border border-[#EDE8E1] rounded-xl p-5">
            <p className="mb-3">
              If your order arrives with broken packaging, spillage, or a manufacturing defect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Do not discard the outer packaging — it is needed for verification</li>
              <li>Photograph the damage clearly (outer box, inner packaging, and product)</li>
              <li>Report to us within <strong>48 hours of delivery</strong> at <a href="mailto:support@hydraskincare.in" className="text-[#13382B] underline">support@hydraskincare.in</a></li>
              <li>We will arrange a free reverse pickup and ship a replacement within 2–3 business days</li>
              <li>If a replacement is unavailable, a full refund including shipping is issued</li>
            </ul>
          </div>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">6. Order Cancellations</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Orders can be cancelled within <strong>24 hours of placement</strong> if not yet dispatched — full refund issued.</li>
            <li>Once an order is in "Dispatched" status, it cannot be cancelled. Please wait for delivery and initiate a return.</li>
            <li>Subscription or bundle orders cancelled after 24 hours are subject to a 5% processing fee.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#C5A880]" /> 7. Contact Us
          </h2>
          <div className="bg-white border border-[#EDE8E1] rounded-xl p-6 space-y-2">
            <p><strong className="text-[#13382B]">Hydra Skincare — Customer Delight Team</strong></p>
            <p>Email: <a href="mailto:support@hydraskincare.in" className="text-[#13382B] underline">support@hydraskincare.in</a></p>
            <p>Phone: +91 80 1234 5678 (Mon – Sat, 9:00 AM – 6:00 PM IST)</p>
            <p>WhatsApp: <a href="https://wa.me/918012345678" className="text-[#13382B] underline">+91 80 1234 5678</a></p>
          </div>
        </section>

        {/* Footer nav */}
        <div className="border-t border-[#EDE8E1] pt-8 flex flex-wrap gap-4 text-xs text-gray-500">
          <Link to="/privacy" className="hover:text-[#13382B] transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#13382B] transition-colors">Terms &amp; Conditions</Link>
          <Link to="/shipping" className="hover:text-[#13382B] transition-colors">Shipping Policy</Link>
        </div>
      </div>
    </div>
  );
};
