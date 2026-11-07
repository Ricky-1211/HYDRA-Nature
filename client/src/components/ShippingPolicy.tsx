import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Clock, MapPin, Package, AlertTriangle, Phone } from 'lucide-react';

export const ShippingPolicy: React.FC = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#F0ECE4] to-[#FAF8F5] border-b border-[#EDE8E1] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-6 h-6 text-[#C5A880]" />
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-medium">Legal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#13382B] leading-tight">
            Shipping Policy
          </h1>
          <p className="text-sm text-gray-500 mt-3">Last updated: November 2026 · Effective: 1 November 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-gray-700 text-sm leading-relaxed">

        <p>
          At <strong className="text-[#13382B]">Hydra Skincare</strong>, we understand that receiving your skincare
          essentials promptly is as important as the products themselves. This policy outlines our shipping timelines,
          charges, and processes so you know exactly what to expect.
        </p>

        {/* Shipping options summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <Truck className="w-5 h-5" />, title: 'Standard Delivery', time: '5–7 Business Days', cost: 'Free above ₹999' },
            { icon: <Clock className="w-5 h-5" />, title: 'Express Delivery', time: '2–3 Business Days', cost: '₹149 flat' },
            { icon: <Package className="w-5 h-5" />, title: 'Same-Day Delivery', time: 'Order before 12 PM', cost: 'Bengaluru only · ₹99' },
          ].map(({ icon, title, time, cost }) => (
            <div key={title} className="bg-white border border-[#EDE8E1] rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-[#F0ECE4] flex items-center justify-center text-[#13382B] mx-auto mb-3">
                {icon}
              </div>
              <h3 className="font-serif font-semibold text-[#13382B] text-sm mb-1">{title}</h3>
              <p className="text-xs font-medium text-gray-700">{time}</p>
              <p className="text-xs text-[#C5A880] mt-1">{cost}</p>
            </div>
          ))}
        </div>

        {/* Section 1 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#C5A880]" /> 1. Order Processing Time
          </h2>
          <p className="mb-3">
            All orders are carefully quality-checked, packed, and handed over to our logistics partner within:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li><strong>Standard orders:</strong> 1–2 business days (Monday – Saturday, excluding public holidays)</li>
            <li><strong>Orders placed before 12:00 PM IST:</strong> Processed same day if placed on a working day</li>
            <li><strong>Orders placed after 12:00 PM IST or on Sundays / holidays:</strong> Processed the next working day</li>
          </ul>
          <p className="mt-3 text-xs bg-[#F0ECE4] rounded-lg p-3">
            During sale periods, new launches, or festive seasons, processing may take up to 3 business days. We will
            notify you if there is an unusual delay.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">2. Shipping Charges &amp; Free Shipping</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-[#EDE8E1] rounded-xl overflow-hidden">
              <thead className="bg-[#F0ECE4] text-[#13382B]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Order Value</th>
                  <th className="px-4 py-3 text-left font-semibold">Standard Delivery</th>
                  <th className="px-4 py-3 text-left font-semibold">Express Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE8E1]">
                {[
                  ['Below ₹499', '₹79', '₹149'],
                  ['₹499 – ₹998', '₹49', '₹149'],
                  ['₹999 and above', 'FREE', '₹149'],
                ].map(([value, standard, express]) => (
                  <tr key={value} className="bg-white hover:bg-[#FAF8F5]">
                    <td className="px-4 py-3 font-medium text-[#13382B]">{value}</td>
                    <td className="px-4 py-3 text-gray-600">{standard}</td>
                    <td className="px-4 py-3 text-gray-600">{express}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            * Shipping charges are calculated on the net order value after discounts. COD orders carry an additional
            handling fee of ₹30.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#C5A880]" /> 3. Delivery Coverage
          </h2>
          <p className="mb-3">
            We currently ship to <strong>26,000+ pin codes across India</strong> through our logistics network
            including Delhivery, Bluedart, and Shiprocket.
          </p>
          <div className="space-y-3">
            <div className="bg-white border border-[#EDE8E1] rounded-xl p-4">
              <h3 className="font-semibold text-[#13382B] mb-2 text-xs uppercase tracking-wide">Metro Cities</h3>
              <p className="text-xs text-gray-600">
                Bengaluru, Mumbai, Delhi NCR, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad — delivery in 2–4 business days (standard).
              </p>
            </div>
            <div className="bg-white border border-[#EDE8E1] rounded-xl p-4">
              <h3 className="font-semibold text-[#13382B] mb-2 text-xs uppercase tracking-wide">Tier II &amp; III Cities</h3>
              <p className="text-xs text-gray-600">
                Jaipur, Lucknow, Coimbatore, Kochi, Indore, Chandigarh, etc. — delivery in 4–6 business days.
              </p>
            </div>
            <div className="bg-white border border-[#EDE8E1] rounded-xl p-4">
              <h3 className="font-semibold text-[#13382B] mb-2 text-xs uppercase tracking-wide">Remote &amp; J&amp;K / NE States</h3>
              <p className="text-xs text-gray-600">
                Delivery in 7–10 business days. A remote area surcharge of ₹50–₹100 may apply and will be shown at checkout.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">4. Order Tracking</h2>
          <p className="mb-3">
            Once your order is dispatched, you will receive:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>An email and SMS with your <strong>AWB / tracking number</strong> and logistics partner details</li>
            <li>A link to track your package on our website under <strong>My Orders</strong></li>
            <li>Delivery status updates at key milestones: Dispatched, In Transit, Out for Delivery, Delivered</li>
          </ul>
          <p className="mt-3">
            If the tracking link shows no update for more than 48 hours after dispatch, please contact us at{' '}
            <a href="mailto:support@hydraskincare.in" className="text-[#13382B] underline">support@hydraskincare.in</a>.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#C5A880]" /> 5. Failed Delivery &amp; Reattempts
          </h2>
          <p className="mb-3">
            Our logistics partner will make up to <strong>3 delivery attempts</strong>. If delivery fails:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>After the first failed attempt, the courier will notify you via SMS/call to schedule redelivery.</li>
            <li>If all 3 attempts fail and the package is returned to our warehouse, we will contact you to reship.</li>
            <li>Reshipping charges of ₹79 (standard) will apply for a second dispatch.</li>
            <li>For prepaid orders returned due to wrong address or repeated non-availability, refunds are issued after deducting ₹79 reverse logistics cost.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">6. Damaged in Transit</h2>
          <p>
            If your order arrives damaged, please <strong>photograph the outer packaging and product</strong> before
            opening further, and contact us within <strong>48 hours of delivery</strong> at{' '}
            <a href="mailto:support@hydraskincare.in" className="text-[#13382B] underline">support@hydraskincare.in</a>{' '}
            with your order number and photos. We will arrange a replacement or full refund at no additional cost.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">7. International Shipping</h2>
          <div className="bg-[#F0ECE4] border border-[#EDE8E1] rounded-xl p-5">
            <p>
              We currently ship to <strong>UAE, USA, UK, Canada, Singapore, and Australia</strong> via DHL Express.
              International orders are subject to:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-3 text-gray-600">
              <li>Delivery in 7–14 business days depending on destination</li>
              <li>Shipping charges from ₹1,499 (calculated at checkout based on weight and destination)</li>
              <li>Customs duties, import taxes, and VAT — borne by the customer and governed by destination country laws</li>
              <li>Certain products may be restricted due to ingredient regulations in specific countries</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              For international returns or exchange queries, contact us before placing your order.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#C5A880]" /> 8. Contact &amp; Support
          </h2>
          <div className="bg-white border border-[#EDE8E1] rounded-xl p-6 space-y-2">
            <p><strong className="text-[#13382B]">Shipping Support — Hydra Skincare</strong></p>
            <p>Email: <a href="mailto:support@hydraskincare.in" className="text-[#13382B] underline">support@hydraskincare.in</a></p>
            <p>Phone: +91 80 1234 5678 (Mon – Sat, 9:00 AM – 6:00 PM IST)</p>
            <p>WhatsApp: <a href="https://wa.me/918012345678" className="text-[#13382B] underline">+91 80 1234 5678</a></p>
          </div>
        </section>

        {/* Footer nav */}
        <div className="border-t border-[#EDE8E1] pt-8 flex flex-wrap gap-4 text-xs text-gray-500">
          <Link to="/privacy" className="hover:text-[#13382B] transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#13382B] transition-colors">Terms &amp; Conditions</Link>
          <Link to="/returns" className="hover:text-[#13382B] transition-colors">Return &amp; Refund Policy</Link>
        </div>
      </div>
    </div>
  );
};
