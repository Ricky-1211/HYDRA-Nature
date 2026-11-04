import React, { useState } from 'react';
import { Phone, Mail, MapPin, ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { contactService } from '../services/contactService';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await contactService.send({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'General Skincare Inquiry',
        message: formData.message,
      });

      setSuccessMessage(res.message || 'Thank you! Your inquiry has been sent to our skincare experts.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: 'Are Hydra formulations suitable for extremely sensitive skin?',
      a: 'Yes. All our products are formulated strictly without parabens, synthetic fragrances, phthalates, or harsh sulfates. They undergo dermatological patch testing on sensitive skin panels before release.',
    },
    {
      q: 'How long does express shipping take across India?',
      a: 'Orders placed before 2 PM IST are dispatched on the same business day. Delivery takes 2-4 business days for major metro cities and 4-6 days for non-metro destinations.',
    },
    {
      q: 'Can I use Hydra Glow Serum with Hydra Sunscreen Gel together?',
      a: 'Absolutely! In fact, we recommend layering the Hydra Glow Serum onto clean skin first, followed by Hydra Nourish Cream, and finishing with Hydra Sunscreen Gel as your daily daytime shield.',
    },
    {
      q: 'What is your return policy?',
      a: 'We offer an unconditional 14-day return and exchange policy if an item arrives damaged or causes an adverse dermal reaction. Contact us with your order number to initiate a return.',
    },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] pb-24">
      {/* 1. CONTACT MAIN SECTION (Pixel-matched from reference Image 1) */}
      <section className="py-14 sm:py-20 relative overflow-hidden">
        {/* Droplet Background Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#EAF1EB] rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#EDE8E1] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Business Info */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#3F6352]">
                  Get In Touch
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#13382B] mt-1">
                  We'd love to hear from you. Let's connect!
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                  Have questions about our botanical formulations, skin compatibility, or an
                  existing order? Our dermatological consultants are here to guide you.
                </p>
              </div>

              {/* Coordinates Cards */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE8E1]">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF1EB] text-[#13382B] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase font-semibold">Phone Support</p>
                    <p className="text-xs sm:text-sm font-bold text-[#13382B]">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE8E1]">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF1EB] text-[#13382B] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase font-semibold">Customer Care</p>
                    <p className="text-xs sm:text-sm font-bold text-[#13382B]">hello@hydra.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EDE8E1]">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF1EB] text-[#13382B] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase font-semibold">Headquarters & Labs</p>
                    <p className="text-xs sm:text-sm font-bold text-[#13382B]">Bhubaneswar, Odisha, India</p>
                  </div>
                </div>
              </div>

              {/* Response Time Guarantee */}
              <div className="p-4 rounded-xl bg-[#EAF1EB] text-xs text-[#2E6B48] flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Our advisors reply within 24 business hours.</span>
              </div>
            </div>

            {/* Right Column: Working Contact Form */}
            <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-10 rounded-2xl border border-[#EDE8E1] flex flex-col justify-between">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sneha Patel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-white border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sneha@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-white border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-white border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Subject / Concern *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Skincare routine recommendation for dry skin"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-white border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please write your questions or feedback..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-white border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                  />
                </div>

                {successMessage && (
                  <div className="p-3 bg-[#EAF1EB] text-[#2E6B48] rounded-xl text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}
                {errorMessage && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#13382B] text-white rounded-full text-xs font-bold tracking-wider hover:bg-[#1E4D3B] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  <span>{loading ? 'SENDING INQUIRY...' : 'SEND MESSAGE'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <h2 className="font-serif text-2xl font-bold text-[#13382B] text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#EDE8E1] overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-serif text-sm font-bold text-[#13382B]">{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 pt-2 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
