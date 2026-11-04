import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, FlaskConical, Shield, HeartHandshake, Sparkles, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full bg-[#FAF8F5] pb-24">
      {/* 1. ABOUT HERO (Pixel-matched from reference Image 1) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#F1EBE3] via-[#F6F2EC] to-[#ECE5DC] border-b border-[#EDE8E1] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl space-y-4 text-center md:text-left">
            <span className="text-xs font-semibold tracking-widest text-[#3F6352] uppercase">
              Brand Philosophy & Ethos
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#13382B] leading-tight">
              About Hydra
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Our journey towards natural, effective and sustainable skincare. We believe in the
              power of nature and the science of skincare.
            </p>
            <div className="pt-2">
              <a
                href="#our-story"
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#13382B] text-white rounded-full text-xs font-semibold hover:bg-[#1E4D3B] transition-colors shadow-md"
              >
                <span>Our Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Laboratory Glassware with Botanical Leaves Image */}
          <div className="w-56 sm:w-72 h-44 sm:h-56 rounded-3xl overflow-hidden shadow-xl border-4 border-white flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80"
              alt="Hydra Botanical Laboratory"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. THE DUAL PILLARS: NATURE & SCIENCE */}
      <section id="our-story" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#3F6352]">
                Our Foundation
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#13382B] leading-tight">
                Where Botanical Wisdom Meets Molecular Precision
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Founded with a rebel spirit against toxic preservatives and artificial optical
                fillers, Hydra was born in 2021 from a simple yet revolutionary conviction:
                skincare should neither harm your body's endocrine system nor strip the planet's
                ecosystems.
              </p>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Our team of dermatological chemists and botanical ethnopharmacologists spent 3 years
                perfecting our cold-fermentation technique. By fermenting plant squalane, Kakadu
                plum, and edelweiss at low thermal thresholds, we preserve 99.4% of the cellular
                vitamins intact—resulting in formulations that absorb within seconds and hydrate for
                72 continuous hours.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#EDE8E1]">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#13382B]">100%</h3>
                  <p className="text-xs text-gray-500">Cruelty-Free & Vegan</p>
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#13382B]">72 Hours</h3>
                  <p className="text-xs text-gray-500">Continuous Hydration Lock</p>
                </div>
              </div>
            </div>

            {/* Collage of Ingredients and Lab Research */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&w=800&q=80"
                  alt="Scientific Formulation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#13382B] text-white p-6 rounded-2xl shadow-xl max-w-xs hidden sm:block">
                <p className="text-xs font-serif font-bold text-[#C5A880]">The Hydra Promise</p>
                <p className="text-[11px] text-[#CCDED2] mt-1">
                  Every batch tested in independent third-party dermatological laboratories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE VALUES */}
      <section className="py-16 bg-white border-y border-[#EDE8E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#3F6352]">
            OUR STANDARDS
          </span>
          <h2 className="font-serif text-3xl font-semibold text-[#13382B] mt-1 mb-12">
            The 4 Pillars of Hydra Formulations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#EDE8E1] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#EAF1EB] text-[#13382B] flex items-center justify-center mx-auto">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#13382B]">Bio-Active Botanicals</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Cold-pressed, wild-harvested botanicals sourced ethically from certified regenerative farms.
              </p>
            </div>

            <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#EDE8E1] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#EAF1EB] text-[#13382B] flex items-center justify-center mx-auto">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#13382B]">Molecular Efficacy</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Peer-reviewed cellular bioavailability with triple-weight hyaluronic peptides and ectoin.
              </p>
            </div>

            <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#EDE8E1] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#EAF1EB] text-[#13382B] flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#13382B]">Dermatologically Safe</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Zero parabens, phthalates, synthetic colorants, sulfates, or artificial musk.
              </p>
            </div>

            <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#EDE8E1] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#EAF1EB] text-[#13382B] flex items-center justify-center mx-auto">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#13382B]">100% Recyclable</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Packaged in pharmaceutical amber glass with FSC-certified post-consumer biodegradable boxes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOUNDER NOTE */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Award className="w-10 h-10 text-[#C5A880] mx-auto" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#13382B]">
            "True luxury is not an artificial fragrance or heavy marketing packaging. True luxury is
            knowing exactly what touches your skin every morning."
          </h2>
          <div>
            <p className="font-serif text-base font-semibold text-[#1A211D]">Dr. Evelyn Vance</p>
            <p className="text-xs text-[#708078]">Founder & Chief Formulation Chemist, Hydra Skincare</p>
          </div>
          <div className="pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#13382B] text-white rounded-full text-xs font-semibold hover:bg-[#1E4D3B] transition-colors"
            >
              <span>Explore the Complete Range</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
