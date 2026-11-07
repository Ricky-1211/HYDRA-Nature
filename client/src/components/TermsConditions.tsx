import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertCircle, ShieldCheck, Scale, Info } from 'lucide-react';

export const TermsConditions: React.FC = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#F0ECE4] to-[#FAF8F5] border-b border-[#EDE8E1] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-[#C5A880]" />
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-medium">Legal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#13382B] leading-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-gray-500 mt-3">Last updated: November 2026 · Effective: 1 November 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-gray-700 text-sm leading-relaxed">

        <p>
          Welcome to <strong className="text-[#13382B]">Hydra Skincare</strong>. These Terms &amp; Conditions govern
          your use of our website <span className="font-medium text-[#13382B]">www.hydraskincare.in</span> (the
          "Platform") and the purchase of products from us. By accessing or using our Platform, you agree to be bound
          by these Terms. If you do not agree, please discontinue use immediately.
        </p>

        {/* Section 1 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-[#C5A880]" /> 1. Acceptance of Terms
          </h2>
          <p className="mb-3">
            By creating an account, browsing the Platform, or placing an order, you confirm that:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>You are at least <strong>18 years of age</strong>, or are accessing the Platform under the supervision of a parent or legal guardian who agrees to these Terms.</li>
            <li>You are legally capable of entering into a binding contract under the Indian Contract Act, 1872.</li>
            <li>The information you provide is accurate, complete, and kept up to date.</li>
            <li>You have read and understood our <Link to="/privacy" className="text-[#13382B] underline">Privacy Policy</Link>, which forms part of these Terms by reference.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">2. Account Responsibility</h2>
          <p className="mb-3">
            When you register an account on Hydra Skincare:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You agree to notify us immediately at <a href="mailto:support@hydraskincare.in" className="text-[#13382B] underline">support@hydraskincare.in</a> if you suspect any unauthorised use of your account.</li>
            <li>Hydra Skincare shall not be liable for any loss arising from unauthorised use of your account caused by your failure to safeguard your credentials.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or abuse promotional offers.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">3. Products &amp; Descriptions</h2>
          <div className="bg-white border border-[#EDE8E1] rounded-xl p-5 space-y-3">
            <p>
              We make every effort to display product colours, textures, and packaging accurately. However, actual
              appearance may vary slightly due to screen calibration differences.
            </p>
            <p>
              Product descriptions, ingredient lists, and usage instructions are provided for informational purposes.
              They do not constitute medical advice. If you have a skin condition, allergy, or are pregnant, consult a
              dermatologist before use.
            </p>
            <p>
              We reserve the right to modify, discontinue, or reformulate products at any time without prior notice,
              consistent with our commitment to continuous improvement and ingredient transparency.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">4. Pricing &amp; Availability</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>All prices are displayed in Indian Rupees (INR) and are inclusive of applicable GST unless stated otherwise.</li>
            <li>Prices are subject to change without prior notice. The price at the time of order confirmation is the final price for that transaction.</li>
            <li>Promotional prices, discounts, and coupon codes cannot be combined unless explicitly stated.</li>
            <li>Product availability is subject to stock levels. We reserve the right to limit quantities or cancel orders if inventory is unavailable.</li>
            <li>In the event of a pricing error, we will notify you and offer you the option to proceed at the correct price or cancel your order for a full refund.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">5. Order Placement &amp; Cancellation</h2>
          <p className="mb-3">
            Placing an order constitutes an offer to purchase. The contract is formed when we send you an order
            confirmation email. We reserve the right to decline or cancel any order for the following reasons:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Product out of stock or discontinued</li>
            <li>Pricing or description errors identified after order placement</li>
            <li>Suspected fraudulent transaction or misuse of promotional offers</li>
            <li>Delivery address is in a region not serviced by our logistics partners</li>
          </ul>
          <p className="mt-3">
            You may cancel an order within <strong>24 hours of placement</strong> by contacting our support team,
            provided the order has not yet been dispatched. Once dispatched, please refer to our{' '}
            <Link to="/returns" className="text-[#13382B] underline">Return &amp; Refund Policy</Link>.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C5A880]" /> 6. Intellectual Property
          </h2>
          <p>
            All content on this Platform — including but not limited to the Hydra Skincare logo, product photography,
            formulation names, website design, copy, blog posts, and proprietary ingredient blends — is the exclusive
            intellectual property of Hydra Skincare Pvt. Ltd. and is protected under Indian copyright, trademark, and
            design laws.
          </p>
          <p className="mt-3">
            You may not reproduce, distribute, modify, create derivative works from, or commercially exploit any
            content from this Platform without our express written permission. Violation may result in legal action.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">7. User Conduct</h2>
          <p className="mb-3">You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Post false, defamatory, or misleading product reviews</li>
            <li>Attempt to access areas of the Platform not intended for public access</li>
            <li>Use automated bots, scrapers, or scripts to access or extract data</li>
            <li>Transmit spam, viruses, or any harmful code through the Platform</li>
            <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity</li>
            <li>Engage in bulk purchasing for resale purposes without authorised distributor status</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#C5A880]" /> 8. Limitation of Liability
          </h2>
          <div className="bg-[#F0ECE4] border border-[#EDE8E1] rounded-xl p-5 space-y-3">
            <p>
              To the maximum extent permitted by applicable law, Hydra Skincare, its directors, employees, and
              suppliers shall not be liable for:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Indirect, incidental, or consequential damages arising from product use</li>
              <li>Allergic reactions where the customer has not conducted a recommended patch test</li>
              <li>Loss of data, revenue, or goodwill arising from use or inability to use our Platform</li>
              <li>Delays or failures caused by third-party logistics providers</li>
            </ul>
            <p>
              Our total liability for any claim arising from these Terms shall not exceed the value of the specific
              order giving rise to the claim. Nothing in these Terms limits liability for death or personal injury
              caused by our negligence, or for fraud or fraudulent misrepresentation.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">9. Disclaimer of Warranties</h2>
          <p>
            Our products are formulated and dermatologically tested for general suitability. However, skin reactions
            are individual and may vary. We do not warrant that products are suitable for every individual's specific
            skin condition. We recommend performing a patch test 24 hours before full application.
          </p>
          <p className="mt-3">
            The Platform is provided "as is" without warranties of any kind, express or implied, including warranties
            of merchantability, fitness for a particular purpose, or non-infringement.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#C5A880]" /> 10. Governing Law &amp; Dispute Resolution
          </h2>
          <p className="mb-3">
            These Terms are governed by and construed in accordance with the laws of India, including the:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Indian Contract Act, 1872</li>
            <li>Consumer Protection Act, 2019</li>
            <li>Information Technology Act, 2000</li>
            <li>Digital Personal Data Protection Act, 2023</li>
          </ul>
          <p className="mt-3">
            Any disputes arising from these Terms shall first be attempted to be resolved amicably within 30 days.
            If unresolved, disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.
            You may also seek resolution through the National Consumer Helpline (1800-11-4000) or the Consumer Forum
            under the Consumer Protection Act.
          </p>
        </section>

        {/* Section 11 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">11. Changes to These Terms</h2>
          <p>
            We may revise these Terms at any time. The revised version will be posted on this page with an updated
            effective date. For material changes, we will notify registered customers via email at least 7 days in
            advance. Your continued use of the Platform after changes take effect constitutes your acceptance.
          </p>
        </section>

        {/* Section 12 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">12. Contact Us</h2>
          <div className="bg-white border border-[#EDE8E1] rounded-xl p-6 space-y-2">
            <p><strong className="text-[#13382B]">Hydra Skincare Pvt. Ltd.</strong></p>
            <p>Email: <a href="mailto:support@hydraskincare.in" className="text-[#13382B] underline">support@hydraskincare.in</a></p>
            <p>Address: 42 Green Canopy Business Park, Whitefield, Bengaluru — 560066, Karnataka, India</p>
            <p>Customer Support Hours: Monday – Saturday, 9:00 AM – 6:00 PM IST</p>
          </div>
        </section>

        {/* Footer nav */}
        <div className="border-t border-[#EDE8E1] pt-8 flex flex-wrap gap-4 text-xs text-gray-500">
          <Link to="/privacy" className="hover:text-[#13382B] transition-colors">Privacy Policy</Link>
          <Link to="/shipping" className="hover:text-[#13382B] transition-colors">Shipping Policy</Link>
          <Link to="/returns" className="hover:text-[#13382B] transition-colors">Return &amp; Refund Policy</Link>
        </div>
      </div>
    </div>
  );
};
