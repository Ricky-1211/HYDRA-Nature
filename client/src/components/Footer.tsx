import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Instagram,
  Youtube,
  Linkedin,
  Truck,
  ShieldCheck,
  Headphones,
  BadgeCheck,
  Phone,
  Mail,
  Smartphone,
  Landmark,
  Banknote,
  QrCode,
} from 'lucide-react';

import { newsletterService } from '../services/newsletterService';

/*
  Aqua-teal palette (taken from the blurred mesh reference image)
  deep   #0A6A76  base shadow teal
  mid    #0E8C99  main teal
  bright #22B8C2  turquoise glow
  light  #8EDDDD  soft aqua highlight
  mist   #E3F3F2  near-white highlight
  ink    #053F49  darkest teal (overlay + text on light buttons)

  Text on this background:
  primary    white
  secondary  #D5F3F1  (body copy, links)
  muted      #BFEDEA  (small print)
  accent     #FDE8B5  (warm sand accent, keeps the Hydra gold feel)
*/

const trustItems = [
  { icon: Truck, title: 'Shipping across', subtitle: 'India' },
  { icon: ShieldCheck, title: '100% secure', subtitle: 'Checkout' },
  { icon: Headphones, title: 'Dedicated', subtitle: 'Customer support' },
  { icon: BadgeCheck, title: 'Genuine', subtitle: 'Verified reviews' },
];

const paymentMethods = [
  { icon: Smartphone, label: 'UPI', gradient: 'from-[#FF7A1A] via-[#F59E0B] to-[#16A34A]' },
  { icon: Landmark, label: 'Net Banking', gradient: 'from-[#2563EB] to-[#6D28D9]' },
  { icon: Banknote, label: 'Cash on Delivery', gradient: 'from-[#10B981] to-[#059669]' },
  { icon: QrCode, label: 'Scan & Pay QR', gradient: 'from-[#EC4899] to-[#8B5CF6]' },
];

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;

    setStatus('loading');
    setMessage('');
    try {
      const res = await newsletterService.subscribe(email.trim());
      setStatus('success');
      setMessage(res?.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Subscription failed. Please try again.');
    }
  };

  const linkClass = 'text-[#D5F3F1] hover:text-white transition-colors';
  const socialClass =
    'w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white hover:bg-white/30 hover:border-white/40 transition-colors';

  return (
    <footer className="relative isolate overflow-hidden text-white pt-16 pb-10">
      {/* ---------- Background: blurred aqua mesh ---------- */}
      <div
        className="absolute inset-0 -z-30"
        style={{ background: 'linear-gradient(135deg, #0f969c 0%, #0f969c 48%, #0f969c 100%)' }}
        aria-hidden="true"
      />
      {/* Light blobs (kept soft + away from the text columns) */}
      <div
        className="absolute -top-24 left-[38%] -z-20 h-[320px] w-[420px] rounded-full bg-[#8EDDDD]/35 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute top-[30%] -right-20 -z-20 h-[320px] w-[360px] rounded-full bg-[#22B8C2]/45 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-28 -left-16 -z-20 h-[300px] w-[380px] rounded-full bg-[#22B8C2]/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 left-[45%] -z-20 h-[220px] w-[360px] rounded-full bg-[#E3F3F2]/25 blur-3xl"
        aria-hidden="true"
      />
      {/* Contrast overlay: guarantees white text stays readable over the light blobs */}
      <div className="absolute inset-0 -z-10 bg-[#053F49]/35" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ---------- Trust strip ---------- */}
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pb-12">
          {trustItems.map(({ icon: Icon, title, subtitle }) => (
            <li
              key={title}
              className="group flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-4 shadow-[0_8px_30px_-12px_rgba(5,63,73,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 hover:border-white/35"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FDE8B5] to-[#F6C977] text-[#053F49] shadow-md transition-transform duration-300 group-hover:scale-105">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold text-white">{title}</span>
                <span className="block text-[11px] text-[#D5F3F1]">{subtitle}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/20">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex flex-shrink-0 items-center" aria-label="Hydra home">
                        <img
                          src="/images/home/Logo.png"
                          alt="Hydra Professional Beauty"
                          className="h-auto w-24 object-contain [filter:brightness(0)_saturate(100%)_invert(17%)_sepia(20%)_saturate(1200%)_hue-rotate(102deg)_brightness(85%)_contrast(95%)] sm:w-28 lg:w-32"
                        />
                      </Link>
            <p className="text-xs text-[#D5F3F1] leading-relaxed max-w-sm">
              We believe in the power of nature and the science of skincare. Pure ingredients. Advanced science.
              Healthier, more radiant you. Handcrafted with sustainably sourced botanicals in our certified clean
              labs.
            </p>
            <div className="pt-2 text-xs text-[#FDE8B5] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FDE8B5] inline-block animate-pulse" aria-hidden="true" />
              <span>Dermatologist Approved & Certified Cruelty-Free</span>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="lg:col-span-2 space-y-3" aria-label="Quick links">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className={linkClass}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className={linkClass}>
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className={linkClass}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className={linkClass}>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className={linkClass}>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/career" className={linkClass}>
                  Career
                </Link>
              </li>
            </ul>
          </nav>

          {/* Our Promise */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide">Our Promise</h4>
            <ul className="space-y-2 text-xs text-[#D5F3F1]">
              {[
                '100% Natural Ingredients',
                'Dermatologically Tested',
                'Cruelty-Free & Vegan Friendly',
                'Sustainable Recyclable Packaging',
                'Paraben & Sulfate-Free Guarantee',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FDE8B5] flex-shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us & Newsletter */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide">Connect With Us</h4>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={socialClass} aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className={socialClass} aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={socialClass} aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className={`${socialClass} text-xs font-bold`}
                aria-label="X"
              >
                𝕏
              </a>
            </div>

            {/* Newsletter Input */}
            <form onSubmit={handleSubscribe} className="space-y-2">
              <label htmlFor="footer-newsletter" className="sr-only">
                Email address
              </label>
              <div className="relative flex items-center">
                <input
                  id="footer-newsletter"
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/15 backdrop-blur-sm text-white placeholder-white/70 text-xs px-4 py-2.5 rounded-full border border-white/30 focus:outline-none focus:border-[#FDE8B5] focus:bg-white/20 pr-12"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="absolute right-1 w-8 h-8 rounded-full bg-white text-[#053F49] flex items-center justify-center hover:bg-[#FDE8B5] transition-colors disabled:opacity-60"
                  aria-label="Submit newsletter subscription"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div aria-live="polite">
                {status === 'success' && (
                  <p className="text-[11px] text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#BFF3D8]" />
                    <span>{message}</span>
                  </p>
                )}
                {status === 'error' && <p className="text-[11px] text-[#FFD1D1]">{message}</p>}
              </div>
            </form>
          </div>
        </div>

        {/* ---------- Customer care + Payments ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 border-b border-white/20">
          <div className="lg:col-span-5 space-y-4">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide">Customer Care</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="tel:+918117969889"
                className="group flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 transition-all hover:bg-white/15 hover:border-white/35"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#0E8C99] shadow-md transition-transform group-hover:scale-105">
                  <Phone className="h-4 w-4" />
                </span>
                <span className="leading-tight min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-[#BFEDEA]">Mobile</span>
                  <span className="block text-sm font-semibold text-white">+91 81179 69889</span>
                </span>
              </a>
              <a
                href="mailto:care@hydra24n.com"
                className="group flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 transition-all hover:bg-white/15 hover:border-white/35"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#0E8C99] shadow-md transition-transform group-hover:scale-105">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="leading-tight min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-[#BFEDEA]">Email</span>
                  <span className="block text-sm font-semibold text-white truncate">care@hydra24n.com</span>
                </span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-serif text-sm font-semibold text-white tracking-wide">We Accept</h4>
              <span className="flex items-center gap-1.5 text-[11px] text-[#D5F3F1]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#BFF3D8]" />
                100% secure payments
              </span>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {paymentMethods.map(({ icon: Icon, label, gradient }) => (
                <li
                  key={label}
                  className="group flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-[0_8px_24px_-12px_rgba(5,63,73,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-10px_rgba(5,63,73,0.8)]"
                >
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-sm`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.2} />
                  </span>
                  <span className="text-[11px] font-semibold leading-tight text-[#053F49]">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#BFEDEA] gap-4">
          <p>© 2026 HYDRA24n. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px]">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span aria-hidden="true">•</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <span aria-hidden="true">•</span>
            <Link to="/shipping" className="hover:text-white transition-colors">
              Shipping Policy
            </Link>
            <span aria-hidden="true">•</span>
            <Link to="/returns" className="hover:text-white transition-colors">
              Return &amp; Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};