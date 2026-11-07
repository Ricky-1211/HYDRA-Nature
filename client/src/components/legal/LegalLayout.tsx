import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ChevronRight, CalendarDays, Building2, Mail, MessageCircle, ArrowUp, Printer, ListOrdered,
  Shield, FileText, Truck, RotateCcw,
} from 'lucide-react';

export const CARE_EMAIL = 'care@hydra24n.com';
export const CARE_PHONE = '+91 81179 69889';
export const WHATSAPP_URL = 'https://wa.me/918117969889';
export const COMPANY = 'Zulynz Beauty Global Private Limited';
export const ADDRESS = 'Ghatikia, Kalinga Nagar, Bhubaneswar, Khorda, Odisha – 751029';

export interface LegalSection {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface LegalHighlight {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface LegalLayoutProps {
  icon: React.ReactNode;
  title: string;
  intro?: React.ReactNode;
  updated: string;
  highlights?: LegalHighlight[];
  sections: LegalSection[];
}

const POLICIES = [
  { to: '/terms', label: 'Terms & Conditions', icon: FileText },
  { to: '/privacy', label: 'Privacy Policy', icon: Shield },
  { to: '/shipping', label: 'Shipping Policy', icon: Truck },
  { to: '/returns', label: 'Return & Refund', icon: RotateCcw },
];

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const LegalLayout: React.FC<LegalLayoutProps> = ({ icon, title, intro, updated, highlights, sections }) => {
  const { pathname } = useLocation();
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Highlight the section currently in view in the sidebar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-170px 0px -65% 0px' }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === activeId));
  const progress = ((activeIndex + 1) / sections.length) * 100;

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#F1EBE3] via-[#F6F2EC] to-[#ECE5DC] border-b border-[#EDE8E1]">
        <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#C5A880]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-[#3F6352]/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-12 sm:pb-20">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-8 print:hidden" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#13382B] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Legal</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#13382B] font-medium">{title}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#13382B] text-[#C5A880] flex items-center justify-center shadow-luxury flex-shrink-0 [&>svg]:w-7 [&>svg]:h-7">
              {icon}
            </div>
            <div className="space-y-3">
              <span className="text-xs font-semibold tracking-widest text-[#3F6352] uppercase">
                HYDRA24n Professional Beauty · Legal
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#13382B] leading-tight">{title}</h1>
            </div>
          </div>

          {intro && <p className="mt-6 max-w-3xl text-sm sm:text-base text-gray-600 leading-relaxed">{intro}</p>}

          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 bg-white/80 border border-[#EDE8E1] rounded-full px-3 py-1.5 text-gray-600">
              <CalendarDays className="w-3.5 h-3.5 text-[#C5A880]" /> Last updated: {updated}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/80 border border-[#EDE8E1] rounded-full px-3 py-1.5 text-gray-600">
              <Building2 className="w-3.5 h-3.5 text-[#C5A880]" /> {COMPANY}
            </span>
          </div>
        </div>
      </section>

      {/* Policy switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-10 print:hidden">
        <div className="bg-white border border-[#EDE8E1] rounded-2xl shadow-luxury p-1.5 flex gap-1 overflow-x-auto">
          {POLICIES.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 min-w-max inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive ? 'bg-[#13382B] text-white shadow-md' : 'text-gray-600 hover:bg-[#FAF8F5] hover:text-[#13382B]'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Highlights */}
      {highlights && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {highlights.map(({ icon: hIcon, title: hTitle, desc }) => (
              <div key={hTitle} className="bg-white border border-[#EDE8E1] rounded-2xl p-5 flex items-center gap-4 shadow-luxury">
                <div className="w-11 h-11 rounded-full bg-[#EAF1EB] text-[#13382B] flex items-center justify-center flex-shrink-0 [&>svg]:w-5 [&>svg]:h-5">
                  {hIcon}
                </div>
                <div>
                  <p className="font-serif font-semibold text-[#13382B]">{hTitle}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8 lg:gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block print:hidden">
          <div className="sticky top-36 space-y-5">
            <div className="bg-white border border-[#EDE8E1] rounded-2xl p-5">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold text-[#3F6352] mb-3">
                <ListOrdered className="w-3.5 h-3.5" /> On this page
              </p>
              <div className="h-1 bg-[#F0ECE4] rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-[#C5A880] transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <ol className="space-y-0.5 max-h-[calc(100vh-24rem)] overflow-y-auto pr-1">
                {sections.map(({ id, title: sTitle }, i) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollToId(id)}
                      className={`w-full text-left flex gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                        activeId === id
                          ? 'bg-[#EAF1EB] text-[#13382B] font-semibold'
                          : 'text-gray-500 hover:text-[#13382B] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <span className={activeId === id ? 'text-[#C5A880]' : 'text-gray-400'}>{i + 1}.</span>
                      <span>{sTitle}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-[#13382B] rounded-2xl p-5 text-white">
              <p className="font-serif text-lg mb-1">Need help?</p>
              <p className="text-xs text-white/70 mb-4">Our care team is happy to assist with any questions.</p>
              <div className="space-y-2 text-xs">
                <a href={`mailto:${CARE_EMAIL}`} className="flex items-center gap-2 hover:text-[#C5A880] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#C5A880]" /> {CARE_EMAIL}
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#C5A880] transition-colors">
                  <MessageCircle className="w-3.5 h-3.5 text-[#C5A880]" /> {CARE_PHONE}
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 space-y-6">
          {/* Mobile table of contents */}
          <details className="lg:hidden bg-white border border-[#EDE8E1] rounded-2xl print:hidden group">
            <summary className="flex items-center justify-between cursor-pointer list-none px-5 py-4 text-sm font-semibold text-[#13382B]">
              <span className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-[#C5A880]" /> Jump to section
              </span>
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
            </summary>
            <ol className="px-3 pb-3 space-y-0.5">
              {sections.map(({ id, title: sTitle }, i) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToId(id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-[#FAF8F5] hover:text-[#13382B]"
                  >
                    <span className="text-[#C5A880] mr-1.5">{i + 1}.</span>
                    {sTitle}
                  </button>
                </li>
              ))}
            </ol>
          </details>

          {sections.map(({ id, title: sTitle, icon: sIcon, content }, i) => (
            <section
              key={id}
              id={id}
              className="scroll-mt-36 bg-white border border-[#EDE8E1] rounded-2xl p-6 sm:p-8 hover:shadow-luxury transition-shadow"
            >
              <div className="flex items-start gap-4 mb-5">
                <span className="w-9 h-9 rounded-full bg-[#F0ECE4] text-[#13382B] font-serif font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#13382B] leading-snug pt-0.5 flex-1">
                  {sTitle}
                </h2>
                {sIcon && <span className="hidden sm:block text-[#C5A880] [&>svg]:w-5 [&>svg]:h-5 pt-1.5">{sIcon}</span>}
              </div>
              <div className="text-sm text-gray-700 leading-relaxed space-y-4 sm:pl-[3.25rem]">{content}</div>
            </section>
          ))}

          {/* Contact band */}
          <div className="relative overflow-hidden bg-[#13382B] rounded-2xl p-8 sm:p-10 text-white">
            <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#C5A880]/20 blur-2xl" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="font-serif text-2xl mb-1">Questions about this policy?</p>
                <p className="text-sm text-white/70">Write to us or message us on WhatsApp — we're here to help.</p>
              </div>
              <div className="flex flex-wrap gap-3 print:hidden">
                <a
                  href={`mailto:${CARE_EMAIL}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A880] text-[#13382B] rounded-full text-xs font-semibold hover:bg-[#E8DFD0] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" /> Email us
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/30 rounded-full text-xs font-semibold hover:bg-white/10 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/30 rounded-full text-xs font-semibold hover:bg-white/10 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-30 w-11 h-11 rounded-full bg-[#13382B] text-white shadow-luxury-hover flex items-center justify-center transition-all print:hidden ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  );
};

/* ---------- Content building blocks ---------- */

export const Callout: React.FC<{ children: React.ReactNode; tone?: 'gold' | 'sage' }> = ({ children, tone = 'gold' }) => (
  <div
    className={`rounded-xl p-4 border-l-4 text-sm ${
      tone === 'gold' ? 'bg-[#FBF7F0] border-[#C5A880]' : 'bg-[#EAF1EB] border-[#3F6352]'
    }`}
  >
    {children}
  </div>
);

export const CheckList: React.FC<{ items: React.ReactNode[]; variant?: 'yes' | 'no' }> = ({ items, variant = 'yes' }) => (
  <ul className="space-y-2.5">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3">
        <span
          className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
            variant === 'yes' ? 'bg-[#EAF1EB] text-[#3F6352]' : 'bg-red-50 text-red-500'
          }`}
        >
          {variant === 'yes' ? '✓' : '✕'}
        </span>
        <span className="text-gray-600">{item}</span>
      </li>
    ))}
  </ul>
);

export const BulletList: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3 text-gray-600">
        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C5A880] flex-shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export const Panel: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-[#FAF8F5] border border-[#EDE8E1] rounded-xl p-5">
    {title && <p className="text-[11px] uppercase tracking-widest font-semibold text-[#3F6352] mb-3">{title}</p>}
    {children}
  </div>
);

export const Clause: React.FC<{ n: string; title?: string; children: React.ReactNode }> = ({ n, title, children }) => (
  <div className="flex gap-4">
    <span className="text-xs font-semibold text-[#A68962] bg-[#FBF7F0] border border-[#EDE8E1] rounded-md px-2 py-0.5 h-fit flex-shrink-0 min-w-[2.75rem] text-center">
      {n}
    </span>
    <div className="flex-1">
      {title && <strong className="text-[#13382B]">{title}. </strong>}
      {children}
    </div>
  </div>
);

export const InfoTable: React.FC<{ rows: [React.ReactNode, React.ReactNode][]; head?: [string, string] }> = ({ rows, head }) => (
  <div className="overflow-x-auto rounded-xl border border-[#EDE8E1]">
    <table className="w-full text-xs">
      {head && (
        <thead className="bg-[#F0ECE4] text-[#13382B]">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">{head[0]}</th>
            <th className="px-4 py-3 text-left font-semibold">{head[1]}</th>
          </tr>
        </thead>
      )}
      <tbody className="divide-y divide-[#EDE8E1]">
        {rows.map(([label, value], i) => (
          <tr key={i} className="bg-white hover:bg-[#FAF8F5]">
            <td className={`px-4 py-3 font-semibold text-[#13382B] ${head ? '' : 'bg-[#FAF8F5] w-1/3'}`}>{label}</td>
            <td className="px-4 py-3 text-gray-600">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const EmailLink: React.FC<{ email?: string }> = ({ email = CARE_EMAIL }) => (
  <a href={`mailto:${email}`} className="text-[#13382B] font-medium underline decoration-[#C5A880] underline-offset-2 hover:text-[#3F6352]">
    {email}
  </a>
);

export const PhoneLink: React.FC = () => (
  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-[#13382B] font-medium underline decoration-[#C5A880] underline-offset-2 hover:text-[#3F6352]">
    {CARE_PHONE}
  </a>
);

export const ContactCard: React.FC<{ showAddress?: boolean; subtitle?: string }> = ({ showAddress = true, subtitle }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <div className="sm:col-span-2 bg-[#FAF8F5] border border-[#EDE8E1] rounded-xl p-5">
      <p className="font-serif font-semibold text-[#13382B]">{COMPANY}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      {showAddress && <p className="text-xs text-gray-600 mt-1">{ADDRESS}</p>}
    </div>
    <a href={`mailto:${CARE_EMAIL}`} className="flex items-center gap-3 bg-white border border-[#EDE8E1] rounded-xl p-4 hover:border-[#C5A880] transition-colors">
      <Mail className="w-4 h-4 text-[#C5A880]" />
      <span>
        <span className="block text-[11px] text-gray-400 uppercase tracking-wide">Email</span>
        <span className="text-[#13382B] font-medium">{CARE_EMAIL}</span>
      </span>
    </a>
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white border border-[#EDE8E1] rounded-xl p-4 hover:border-[#C5A880] transition-colors">
      <MessageCircle className="w-4 h-4 text-[#C5A880]" />
      <span>
        <span className="block text-[11px] text-gray-400 uppercase tracking-wide">Phone / WhatsApp</span>
        <span className="text-[#13382B] font-medium">{CARE_PHONE}</span>
      </span>
    </a>
    <a href="https://www.hydra24n.com" className="sm:col-span-2 text-xs text-gray-500 hover:text-[#13382B]">
      www.hydra24n.com
    </a>
  </div>
);
