import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, UserCheck, Globe, Mail } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#F0ECE4] to-[#FAF8F5] border-b border-[#EDE8E1] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-[#C5A880]" />
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-medium">Legal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#13382B] leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mt-3">Last updated: November 2026 · Effective: 1 November 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10 text-gray-700 text-sm leading-relaxed">

        <p>
          Hydra Skincare ("<strong>Hydra</strong>", "we", "our", "us") is committed to protecting the personal
          information you share with us. This Privacy Policy explains what data we collect, how we use it, with
          whom we share it, and the rights you have over your information. By using our website{' '}
          <span className="font-medium text-[#13382B]">www.hydraskincare.in</span> and placing orders with us,
          you consent to the practices described here.
        </p>

        {/* Section 1 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#C5A880]" /> 1. Information We Collect
          </h2>
          <p className="mb-3">We collect information in the following ways:</p>
          <div className="space-y-4">
            <div className="bg-white border border-[#EDE8E1] rounded-xl p-5">
              <h3 className="font-semibold text-[#13382B] mb-2">a) Information You Provide Directly</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Full name, email address, mobile number</li>
                <li>Shipping and billing address (including pin code, city, state)</li>
                <li>Payment details (processed securely via Razorpay — we do not store card numbers)</li>
                <li>Account login credentials (email + hashed password)</li>
                <li>Product reviews, ratings, and customer support communications</li>
                <li>Newsletter subscription preference</li>
              </ul>
            </div>
            <div className="bg-white border border-[#EDE8E1] rounded-xl p-5">
              <h3 className="font-semibold text-[#13382B] mb-2">b) Information Collected Automatically</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>IP address, browser type, device type, and operating system</li>
                <li>Pages visited, time spent, referring URLs, and click patterns</li>
                <li>Cookie identifiers and session tokens</li>
                <li>Cart contents and wishlist activity</li>
              </ul>
            </div>
            <div className="bg-white border border-[#EDE8E1] rounded-xl p-5">
              <h3 className="font-semibold text-[#13382B] mb-2">c) Information from Third Parties</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Social login data if you sign in via Google or Facebook (name, email, profile photo)</li>
                <li>Delivery tracking updates from our logistics partners</li>
                <li>Fraud-screening signals from payment processors</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#C5A880]" /> 2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li><strong>Order fulfilment</strong> — processing, packaging, and delivering your purchases</li>
            <li><strong>Account management</strong> — creating and maintaining your Hydra account</li>
            <li><strong>Customer support</strong> — responding to queries, returns, and complaints</li>
            <li><strong>Personalisation</strong> — recommending products suited to your skin type and purchase history</li>
            <li><strong>Marketing communications</strong> — sending offers, new launches, and skincare tips (only with your opt-in consent)</li>
            <li><strong>Analytics &amp; improvement</strong> — understanding how customers use our website to improve UX</li>
            <li><strong>Legal compliance</strong> — fulfilling obligations under Indian law including GST invoicing</li>
            <li><strong>Fraud prevention</strong> — detecting and preventing unauthorised transactions</li>
          </ul>
          <p className="mt-3 text-xs text-gray-500 bg-[#F0ECE4] rounded-lg p-3">
            We will never sell your personal data to third parties for their own marketing purposes.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">3. Cookies &amp; Tracking</h2>
          <p className="mb-3">
            We use cookies and similar technologies to enhance your browsing experience. These include:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-[#EDE8E1] rounded-xl overflow-hidden">
              <thead className="bg-[#F0ECE4] text-[#13382B]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Cookie Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Purpose</th>
                  <th className="px-4 py-3 text-left font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE8E1]">
                {[
                  ['Essential', 'Login session, cart persistence', 'Session'],
                  ['Functional', 'Language preference, recently viewed', '30 days'],
                  ['Analytics', 'Google Analytics — page views, bounce rate', '2 years'],
                  ['Marketing', 'Meta Pixel, Google Ads — retargeting (opt-in)', '90 days'],
                ].map(([type, purpose, duration]) => (
                  <tr key={type} className="bg-white hover:bg-[#FAF8F5]">
                    <td className="px-4 py-3 font-medium text-[#13382B]">{type}</td>
                    <td className="px-4 py-3 text-gray-600">{purpose}</td>
                    <td className="px-4 py-3 text-gray-600">{duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            You can disable non-essential cookies via your browser settings or the cookie banner on your first
            visit. Disabling essential cookies may affect site functionality.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">4. Data Sharing &amp; Disclosure</h2>
          <p className="mb-3">
            We share your personal data only with trusted parties required to deliver our service:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li><strong>Payment Gateway — Razorpay:</strong> Processes card, UPI, net banking, and wallet payments under PCI-DSS compliance.</li>
            <li><strong>Logistics Partners — Delhivery, Bluedart, Shiprocket:</strong> Receive your name, address, and mobile for delivery and tracking.</li>
            <li><strong>Cloud Infrastructure — AWS / GCP:</strong> Our servers and databases are hosted in India-based regions.</li>
            <li><strong>Analytics — Google Analytics:</strong> Anonymised usage data to improve our website.</li>
            <li><strong>Legal Authorities:</strong> When required by law, court order, or to protect rights and safety.</li>
          </ul>
          <p className="mt-3">
            All third-party partners are bound by data processing agreements and are prohibited from using your data for their own purposes.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#C5A880]" /> 5. Your Rights
          </h2>
          <p className="mb-3">
            Under India's Digital Personal Data Protection Act, 2023 (DPDPA) and applicable regulations, you have
            the right to:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['Access', 'Request a copy of the personal data we hold about you'],
              ['Correction', 'Ask us to correct inaccurate or incomplete data'],
              ['Erasure', 'Request deletion of your data, subject to legal obligations'],
              ['Withdraw Consent', 'Opt out of marketing communications at any time'],
              ['Portability', 'Receive your data in a structured, machine-readable format'],
              ['Nomination', 'Nominate a person to exercise your data rights on your behalf'],
            ].map(([right, desc]) => (
              <div key={right} className="bg-white border border-[#EDE8E1] rounded-xl p-4">
                <p className="font-semibold text-[#13382B] text-xs mb-1">{right}</p>
                <p className="text-xs text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4">
            To exercise any right, email us at{' '}
            <a href="mailto:privacy@hydraskincare.in" className="text-[#13382B] font-medium underline">
              privacy@hydraskincare.in
            </a>
            . We will respond within 30 days.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">6. Data Retention</h2>
          <p>
            We retain your personal data for as long as your account is active or as needed to provide services.
            Order and transaction records are kept for 7 years as required by Indian tax law (GST). After account
            deletion, anonymised analytics data may be retained indefinitely.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#C5A880]" /> 7. Data Security
          </h2>
          <p>
            We implement industry-standard security measures including TLS/SSL encryption for data in transit,
            AES-256 encryption for sensitive data at rest, role-based access controls, and regular security audits.
            While we take all reasonable precautions, no internet transmission is 100% secure. If a data breach
            occurs affecting your rights, we will notify you within 72 hours as required by law.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">8. Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal
            information from children. If you believe a minor has provided us with personal data, please contact
            us immediately and we will delete it promptly.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or applicable
            law. Material changes will be communicated via email or a prominent notice on our website at least 7
            days before they take effect. Your continued use of our services after the effective date constitutes
            your acceptance of the revised policy.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="font-serif text-xl font-bold text-[#13382B] mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#C5A880]" /> 10. Contact Our Data Protection Officer
          </h2>
          <div className="bg-white border border-[#EDE8E1] rounded-xl p-6 space-y-2">
            <p><strong className="text-[#13382B]">Hydra Skincare — Data Protection Officer</strong></p>
            <p>Email: <a href="mailto:privacy@hydraskincare.in" className="text-[#13382B] underline">privacy@hydraskincare.in</a></p>
            <p>Address: Hydra Skincare Pvt. Ltd., 42 Green Canopy Business Park, Whitefield, Bengaluru — 560066, Karnataka, India</p>
            <p>Grievance Officer Response Time: within 30 calendar days</p>
          </div>
        </section>

        {/* Footer nav */}
        <div className="border-t border-[#EDE8E1] pt-8 flex flex-wrap gap-4 text-xs text-gray-500">
          <Link to="/terms" className="hover:text-[#13382B] transition-colors">Terms &amp; Conditions</Link>
          <Link to="/shipping" className="hover:text-[#13382B] transition-colors">Shipping Policy</Link>
          <Link to="/returns" className="hover:text-[#13382B] transition-colors">Return &amp; Refund Policy</Link>
        </div>
      </div>
    </div>
  );
};
