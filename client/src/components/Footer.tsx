import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Instagram, Youtube, Linkedin } from 'lucide-react';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/20">
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

        {/* Bottom Bar: Copyright & Policies */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#BFEDEA] gap-4">
          <p>© 2026 HYDRA24n. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
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