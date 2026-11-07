import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const NIGHT_INGREDIENTS = ['Retinol', 'Peptides', 'Ceramide', 'Ylang Ylang Oil'];

export const NIGHT_RITUAL = [
  { step: '01', text: 'Cleanse and pat dry.' },
  { step: '02', text: 'Apply a pea-sized amount.' },
  { step: '03', text: 'Start 2–3 nights a week.' },
];

const SLIDES = [
  {
    label: 'skincare',
    src: '/images/home/Hydra Skincare banner 3.png',
    alt: 'Hydra Day Cream banner with a botanical and water-inspired setting',
  },
  {
    label: 'Ingredients',
    src: '/images/home/skincare%20banner%202.png',
    alt: 'Hydra night care ingredients',
  },
  {
    label: 'Benefits',
    src: '/images/home/skincare%20banner.png',
    alt: 'Evening skincare routine with Hydra night care',
  },
  {
    label: 'Day cream',
    src: '/images/home/Hydra%20Skincare%20Banner.png',
    alt: 'Hydra Day Cream banner with a botanical and water-inspired setting',
  },
];

const TOTAL = SLIDES.length;
const AUTOPLAY_MS = 7000;
const SWIPE_PX = 50;

/**
 * Fixed banner aspect ratio.
 * 16:9 on desktop, 4:5 on mobile — the frame never changes size,
 * and images always object-cover into it so nothing looks "off".
 */
const FRAME_ASPECT_MOBILE = 'aspect-[4/5]';
const FRAME_ASPECT_DESKTOP = 'sm:aspect-[16/9]';
const FRAME_MAX_HEIGHT = 'max-h-[calc(100vh-4rem)]';

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#13382B]';

const STYLES = `
@keyframes hhc-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes hhc-fill { from { transform: scaleX(0) } to { transform: scaleX(1) } }
.hhc-slide { animation: hhc-fade .5s ease-out both }
.hhc-fill { transform-origin: left; animation: hhc-fill ${AUTOPLAY_MS}ms linear both }
@media (prefers-reduced-motion: reduce) {
  .hhc-slide { animation: none }
  .hhc-fill { animation: none; transform: scaleX(1) }
}
`;

export const HomeHeroCarousel: React.FC = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = (index: number) => setActive((index + TOTAL) % TOTAL);

  useEffect(() => {
    if (paused) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setTimeout(() => setActive((s) => (s + 1) % TOTAL), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, paused]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(active - 1);
    if (e.key === 'ArrowRight') go(active + 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(delta) > SWIPE_PX) go(active + (delta < 0 ? 1 : -1));
  };

  const slide = SLIDES[active];

  return (
    <section className="border-b border-[#EDE8E1] bg-[#F5EFE6]">
      <style>{STYLES}</style>
      <div
        className="relative w-full overflow-hidden bg-[#FAF8F5]"
        role="region"
        aria-roledescription="carousel"
        aria-label="Hydra skincare highlights"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ---------- FIXED-SIZE FRAME (never grows/shrinks per slide) ---------- */}
        <div
          className={`relative w-full ${FRAME_ASPECT_MOBILE} ${FRAME_ASPECT_DESKTOP} ${FRAME_MAX_HEIGHT}`}
        >
          <div
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${active + 1} of ${TOTAL}`}
            aria-live={paused ? 'polite' : 'off'}
            className="absolute inset-0"
          >
            <div key={active} className="hhc-slide h-full w-full">
              {active === 0 && <h1 className="sr-only">Hydra Day Cream: Nourish. Protect. Glow.</h1>}
              <Link
                to="/shop"
                aria-label="Explore the Hydra skincare collection"
                className="block h-full w-full focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-[#13382B]"
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  /* object-cover keeps the frame identical for every slide */
                  className="h-full w-full object-cover object-center"
                  loading={active === 0 ? 'eager' : 'lazy'}
                  {...(active === 0 ? { fetchpriority: 'high' } : {})}
                  draggable={false}
                />
              </Link>
            </div>
          </div>
        </div>

        {/* ---------- CONTROLS (unchanged) ---------- */}
        <div className="flex justify-center bg-[#FAF8F5] py-3 lg:absolute lg:bottom-6 lg:right-8 lg:z-20 lg:bg-transparent lg:py-0">
          <div className="flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-2 py-1.5 shadow-lg backdrop-blur-xl">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous slide"
              className={`flex h-9 w-9 items-center justify-center rounded-full text-[#13382B] transition-colors hover:bg-[#E9EFEA] ${focusRing}`}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-1.5" role="group" aria-label="Choose a carousel slide">
              {SLIDES.map(({ label }, index) => {
                const isActive = active === index;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => go(index)}
                    aria-label={`Show slide ${index + 1}: ${label}`}
                    aria-current={isActive ? 'true' : undefined}
                    title={label}
                    className={`group flex h-9 items-center ${focusRing}`}
                  >
                    <span
                      className={`relative block h-1.5 overflow-hidden rounded-full bg-[#13382B]/15 transition-all duration-300 group-hover:bg-[#13382B]/30 ${
                        isActive ? 'w-10' : 'w-5'
                      }`}
                      aria-hidden="true"
                    >
                      {isActive && (
                        <span
                          key={active}
                          className="hhc-fill absolute inset-0 rounded-full bg-[#13382B]"
                          style={{ animationPlayState: paused ? 'paused' : 'running' }}
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next slide"
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-[#13382B] text-white transition-colors hover:bg-[#1A4B3A] ${focusRing}`}
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};