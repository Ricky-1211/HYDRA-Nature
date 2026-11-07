import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Check,
  Star,
  Droplets,
  Clock,
  ShieldCheck,
  Sparkles,
  Image as ImageIcon,
  Search,
  Leaf,
} from 'lucide-react';
import {
  NaturalIngredientsIcon,
  LabTestedIcon,
  SafeFormulaIcon,
  FreeShippingIcon,
  CategoryIcon,
} from '../components/common/BotanicalIcons';
import { HomeHeroCarousel, NIGHT_INGREDIENTS, NIGHT_RITUAL } from '../components/HomeHeroCarousel';
import { productService } from '../services/productService';
import { newsletterService } from '../services/newsletterService';
import { useAppDispatch, useAppSelector } from '../store';
import { addToCart } from '../store/cartSlice';
import { toggleWishlistItem } from '../store/wishlistSlice';
import { Product } from '../types';
import { getImageUrl } from '../utils/imageUrl';

// Night cream spotlight content
const NIGHT_BENEFITS = [
  { icon: Sparkles, title: 'Boosts collagen', text: 'Supports firmer, bouncier skin.' },
  { icon: Clock, title: 'Softens fine lines', text: 'Visibly smoother over time.' },
  { icon: Droplets, title: 'Refines texture', text: 'Wake up to an even, rested glow.' },
];

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const [products, setProducts] = useState<Product[]>([]);
  const [topPicksLoading, setTopPicksLoading] = useState(true);
  const [topPicksError, setTopPicksError] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterIsError, setNewsletterIsError] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        const res = await productService.getAll({ featured: true, limit: 4, sort: 'newest' });
        const fetched = res.data?.products || res.products || res.data || [];
        setProducts(
          Array.isArray(fetched)
            ? fetched.filter((product: Product) => product.isFeatured && product.isActive !== false).slice(0, 4)
            : []
        );
      } catch (err) {
        console.error('Failed to load homepage top picks:', err);
        setTopPicksError(true);
      } finally {
        setTopPicksLoading(false);
      }
    };
    fetchTopPicks();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, item: Product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        productId: item._id,
        product: item,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        image: getImageUrl(item.images?.[0]),
        size: item.size || '50ml',
        quantity: 1,
      })
    );
    setAddedIds((prev) => ({ ...prev, [item._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item._id]: false }));
    }, 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent, item: Product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlistItem(item));
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterLoading(true);
    setNewsletterMessage('');
    try {
      const res = await newsletterService.subscribe(newsletterEmail.trim());
      setNewsletterIsError(false);
      setNewsletterMessage(res?.message || 'Welcome to the Hydra Family!');
      setNewsletterEmail('');
    } catch (err: any) {
      setNewsletterIsError(true);
      setNewsletterMessage(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  const categories = [
    { name: 'Face Care', path: '/shop?category=Face Care' },
    { name: 'Body Care', path: '/shop?category=Body Care' },
    { name: 'Hair Care', path: '/shop?category=Hair Care' },
    { name: 'Skincare Sets', path: '/shop?category=Skincare Sets' },
    { name: 'Natural Care', path: '/shop?category=Natural Care' },
    { name: 'Organic Range', path: '/shop?category=Organic Range' },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] text-[#13382B] selection:bg-[#13382B] selection:text-white">
      <HomeHeroCarousel />

      {/* ------------------------------------------------------------------
          2. VALUE PROPOSITIONS BAR — thin luxury credential band
         ------------------------------------------------------------------ */}
      <section className="border-y border-[#EDE8E1] bg-white">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center divide-y divide-[#EDE8E1] sm:divide-y-0 sm:divide-x">
            <div className="flex w-1/2 items-center justify-center gap-2 px-3 py-3.5 sm:w-auto sm:px-6">
              <NaturalIngredientsIcon className="h-4 w-4 flex-shrink-0 text-[#13382B]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#13382B] sm:text-[11px]">
                100% Natural
              </span>
            </div>
            <div className="flex w-1/2 items-center justify-center gap-2 px-3 py-3.5 sm:w-auto sm:px-6">
              <LabTestedIcon className="h-4 w-4 flex-shrink-0 text-[#13382B]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#13382B] sm:text-[11px]">
                Dermatologically Tested
              </span>
            </div>
            <div className="flex w-1/2 items-center justify-center gap-2 px-3 py-3.5 sm:w-auto sm:px-6">
              <SafeFormulaIcon className="h-4 w-4 flex-shrink-0 text-[#13382B]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#13382B] sm:text-[11px]">
                Safe & Effective
              </span>
            </div>
            <div className="flex w-1/2 items-center justify-center gap-2 px-3 py-3.5 sm:w-auto sm:px-6">
              <FreeShippingIcon className="h-4 w-4 flex-shrink-0 text-[#13382B]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#13382B] sm:text-[11px]">
                Free Shipping India
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          THE HYDRA DIFFERENCE - BRAND STORY
         ------------------------------------------------------------------ */}
      <section className="bg-[#FAF8F5] py-10 sm:py-14 lg:py-20">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-[28px] bg-[#0B0B0A] shadow-[0_30px_80px_-30px_rgba(19,56,43,0.55)] ring-1 ring-black/5 lg:min-h-[620px]">
            {/* Image: full-bleed on desktop (subject sits on the right, dark negative space behind the copy) */}
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
              <img
                src="/images/home/care_model.png"
                alt="Woman enjoying a gentle skincare ritual"
                className="absolute inset-0 h-full w-full object-cover object-[78%_center] lg:object-right"
                loading="lazy"
              />
              {/* Mobile: fade image into the copy below */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B0B0A] to-transparent lg:hidden"
                aria-hidden="true"
              />
              {/* Desktop: keep the copy side rich and readable */}
              <div
                className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#0B0B0A] via-[#0B0B0A]/70 via-35% to-transparent to-60% lg:block"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -left-32 top-1/2 hidden h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-[#13382B]/60 blur-[120px] lg:block"
                aria-hidden="true"
              />

            
            </div>

            {/* Copy */}
            <div className="relative z-10 flex flex-col justify-center px-6 pb-10 pt-2 text-[#FAF8F5] sm:px-10 sm:pb-12 lg:min-h-[620px] lg:max-w-[560px] lg:px-14 lg:py-16">
              <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D8C6A7] sm:text-xs">
                <span className="h-px w-8 bg-[#C5A880]" aria-hidden="true" />
                The Hydra Difference
              </p>

              <h2 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-[52px]">
                Skincare, made simple.{' '}
                <span className="bg-gradient-to-r from-[#E9D9BC] to-[#C5A880] bg-clip-text italic text-transparent">
                  Rooted in nature.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/75 sm:text-base">
                Powered by Nature, Perfected by Science. We bring considered botanical ingredients and
                thoughtful formulation together for rituals that feel beautifully uncomplicated.
              </p>

              <ul className="mt-8 grid gap-3">
                {[
                  { icon: Leaf, title: 'Nature-led ingredients', text: 'Botanical ingredients chosen with care.' },
                  {
                    icon: ShieldCheck,
                    title: 'Thoughtfully tested',
                    text: 'Considered formulas, made with your daily routine in mind.',
                  },
                  {
                    icon: Sparkles,
                    title: 'Everyday essentials',
                    text: 'A simpler approach to the care you reach for every day.',
                  },
                ].map(({ icon: Icon, title, text }) => (
                  <li
                    key={title}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition-colors hover:border-[#C5A880]/40 hover:bg-white/[0.07]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C5A880]/15 text-[#D8C6A7] ring-1 ring-[#C5A880]/30">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{title}</h3>
                      <p className="mt-1 text-xs leading-5 text-white/60">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                to="/about"
                className="group mt-9 inline-flex w-fit items-center gap-3 rounded-full bg-[#C5A880] px-6 py-3 text-sm font-semibold text-[#13382B] transition-all hover:bg-[#D8C6A7] hover:shadow-[0_10px_30px_-10px_rgba(197,168,128,0.8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8C6A7]"
              >
                Meet the Hydra difference
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      

      {/* ------------------------------------------------------------------
          3. OUR TOP PICKS
         ------------------------------------------------------------------ */}
      <section className="py-14 sm:py-20 bg-[#FAF8F5]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#6B8075] mb-2">
              <span className="w-8 h-px bg-[#C9BEB0]" />
              <span>OUR TOP PICKS</span>
              <span className="w-8 h-px bg-[#C9BEB0]" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-medium text-[#13382B] tracking-tight">
              Skincare Solutions for Every You
            </h2>

            <p className="text-xs sm:text-sm text-[#556B60] mt-2 font-sans">
              Discover our most loved products for healthy, glowing skin.
            </p>
          </div>

          {topPicksLoading && <p className="mb-6 text-center text-sm text-[#556B60]">Loading featured products…</p>}
          {!topPicksLoading && topPicksError && (
            <p className="mb-6 text-center text-sm text-[#8B3A32]" role="alert">
              Featured products could not be loaded. Please try again later.
            </p>
          )}
          {!topPicksLoading && !topPicksError && products.length === 0 && (
            <p className="mb-6 text-center text-sm text-[#556B60]">Our top picks will be here soon.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {products.map((product) => {
              const isInWishlist = wishlistItems.some((i) => i._id === product._id);
              const isAdded = !!addedIds[product._id];
              const hasDiscount = (product.originalPrice ?? 0) > product.price;
              const productBadge = product.isBestSeller ? 'Best Seller' : product.tag;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#EDE8E1] hover:border-[#C5A880]/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(19,56,43,0.10)] transition-all duration-300 flex flex-col group"
                >
                  {/* ── Image Block ── */}
                  <div className="relative overflow-hidden">
                    {/* Badge */}
                    {productBadge && (
                      <span
                        className={`absolute top-3 left-3 z-10 text-[10px] font-semibold px-2.5 py-0.5 rounded-full text-white ${
                          productBadge === 'Best Seller'
                            ? 'bg-[#8CA448]'
                            : productBadge === 'New'
                            ? 'bg-[#7A9A3B]'
                            : productBadge === 'Trending'
                            ? 'bg-[#D9822B]'
                            : 'bg-[#13382B]'
                        }`}
                      >
                        {productBadge}
                      </span>
                    )}

                    {/* Wishlist Heart */}
                    <button
                      onClick={(e) => handleToggleWishlist(e, product)}
                      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#EDE8E1] flex items-center justify-center text-[#708078] hover:text-[#B91C1C] hover:border-[#B91C1C]/30 transition-all shadow-sm"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                          isInWishlist ? 'fill-[#B91C1C] text-[#B91C1C]' : 'stroke-current'
                        }`}
                      />
                    </button>

                    {/* Product Image — edge-to-edge, perfectly square */}
                    <Link
                      to={`/shop/${product.slug || product._id}`}
                      className="relative block w-full overflow-hidden"
                      style={{ paddingBottom: '100%' /* 1:1 square via padding trick */ }}
                    >
                      {/* Neutral background + fallback icon — always rendered beneath the image */}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F2ED] to-[#EDE8E0] flex flex-col items-center justify-center gap-2 text-[#C5BEB5]">
                        <ImageIcon className="h-10 w-10" />
                        <span className="text-[11px]">Image unavailable</span>
                      </div>

                      {/* Actual product image — absolute fill so every card is identical size */}
                      {product.images?.[0] && (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}

                      {/* Quick-look zoom — fades in centered on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                        <span className="w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                          <Search className="w-4 h-4 text-[#13382B]" />
                        </span>
                      </div>

                      {/* ADD TO CART bar — slides up from the bottom edge on hover */}
                      <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto">
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          aria-label={`Add ${product.name} to cart`}
                          className={`w-full py-3.5 text-[11px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors ${
                            isAdded
                              ? 'bg-[#2E6B48] text-white'
                              : 'bg-[#8FB88A] hover:bg-[#13382B] text-white'
                          }`}
                        >
                          {isAdded ? (
                            <><Check className="w-3.5 h-3.5" /> Added</>
                          ) : (
                            <><ShoppingBag className="w-3.5 h-3.5" /> Add to Cart</>
                          )}
                        </button>
                      </div>
                    </Link>
                  </div>

                  {/* ── Info Block ── */}
                  <div className="px-4 py-4 flex flex-col flex-1">
                    <Link to={`/shop/${product.slug || product._id}`} className="block flex-1">
                      <h3 className="font-serif text-sm sm:text-base font-semibold text-[#13382B] group-hover:text-[#2D634C] transition-colors leading-snug">
                        {product.name}
                      </h3>
                      {product.subtitle && (
                        <p className="text-[11px] text-[#6E7F75] mt-0.5 font-sans line-clamp-1">{product.subtitle}</p>
                      )}
                    </Link>

                    {/* Price row */}
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9CAAA1]">MRP</span>
                      <span className="font-serif text-base font-bold text-[#13382B]">
                        ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-[#9CAAA1] line-through font-sans">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          4. NIGHT CREAM SPOTLIGHT — compact editorial teaser
         ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-[#FAF8F5] py-16 sm:py-24">
        {/* Soft ambient blob */}
        <div
          className="pointer-events-none absolute -bottom-32 -right-16 h-[460px] w-[460px] rounded-full bg-[#CFE0D2]/70 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Visual: arch frame + floating badge (left on desktop) */}
            <div className="order-first lg:order-first lg:col-span-5">
              <div className="relative mx-auto w-full max-w-[400px] px-4 sm:px-0">
                <div
                  className="absolute inset-0 translate-x-4 translate-y-4 rounded-[28px] border border-[#C5A880]/70"
                  aria-hidden="true"
                />

                <div className="relative overflow-hidden rounded-[28px] bg-transparent ring-1 ring-[#C5A880]/40">
                  <img
                    src="/images/home/RadianceFaceWash.png"
                    alt="Hydra 24h Ultra Radiance face wash in a gold-capped white jar"
                    className="block h-auto w-full max-w-full object-contain object-center"
                    loading="lazy"
                  />
                </div>

                <div className="absolute -left-1 top-[18%] flex items-center gap-2 rounded-full border border-white/70 bg-white/75 py-1.5 pl-2 pr-4 shadow-lg backdrop-blur-md sm:-left-8">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#C5A880] to-[#D9BE92] text-[#13382B]">
                    <Star className="h-3.5 w-3.5 fill-current" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#13382B]">Best Selling</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7 lg:pr-6">
            

              <h2 className="mt-4 font-serif text-[34px] font-medium leading-[1.1] tracking-tight text-[#13382B] sm:text-5xl lg:text-[54px]">
                Hydra 24h Ultra Radiance <span className="italic font-normal text-[#2D634C]">Face Wash</span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#4F655A] sm:text-base">
                A rich overnight treatment designed to rejuvenate and restore your skin while you sleep.
              </p>

              {/* Ingredients as a single elegant line */}
              <p className="mt-5 max-w-xl text-xs leading-6 text-[#5A6E63]">
                <span className="font-semibold text-[#13382B]">With:</span>{' '}
                {NIGHT_INGREDIENTS.join(' · ')}
              </p>

              {/* Benefits as a slim horizontal strip */}
              <div className="mt-7 grid grid-cols-1 gap-4 border-y border-[#13382B]/10 py-6 sm:grid-cols-3 sm:gap-6">
                {NIGHT_BENEFITS.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex flex-col items-start gap-2">
                    <Icon className="h-4 w-4 text-[#2D634C]" aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-[#13382B]">{title}</h3>
                    <p className="text-xs leading-5 text-[#5A6E63]">{text}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/shop?category=Face Care"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#13382B] px-8 py-3.5 text-xs font-semibold tracking-wide text-white shadow-lg transition-all hover:bg-[#1A4B3A] sm:text-sm"
                >
                  <span>Shop</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          5. CATEGORIES + TESTIMONIAL + NEWSLETTER — unified editorial band
         ------------------------------------------------------------------ */}
      <section className="border-y border-[#EDE8E1] bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          {/* Category strip — inline icons + labels */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pb-10 border-b border-[#EDE8E1]">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                className="group flex items-center gap-2 text-xs font-semibold text-[#13382B] transition-colors hover:text-[#2D634C]"
              >
                <CategoryIcon name={cat.name} className="h-7 w-7 sm:h-8 sm:w-8 text-[#2D634C]" />
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>

          {/* Testimonial + Newsletter side-by-side */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 sm:gap-8">
            {/* Left Card: What Our Customers Say */}
            <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#EDE8E1] shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[220px]">
              <div className="space-y-3 z-10 max-w-sm">
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#13382B]">What Our Customers Say</h3>
                <p className="text-xs sm:text-sm text-[#556B60] leading-relaxed">
                  “Hydra products have completely transformed my skin. Natural, effective and truly premium!”
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <img
                    src="/images/home/sneha_avatar.jpg"
                    alt="Sneha Patel"
                    className="w-10 h-10 rounded-full object-cover border border-[#C5A880]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80';
                    }}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#13382B]">Sneha Patel</h4>
                    <div className="flex items-center text-amber-500 gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 bottom-0 top-0 w-1/3 pointer-events-none flex items-center justify-end">
                <img
                  src="/images/home/testimonial_leaf.jpg"
                  alt="Botanical Leaves"
                  className="w-full h-full object-cover object-left opacity-90"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/home/testimonial_card.jpg';
                  }}
                />
              </div>
            </div>

            {/* Right Card: Join the Hydra Family */}
            <div className="bg-[#EFE9DF] rounded-3xl p-6 sm:p-8 border border-[#EDE8E1] shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[220px]">
              <div className="space-y-2 z-10 max-w-sm">
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#13382B]">Join the Hydra Family</h3>
                <p className="text-xs text-[#556B60]">Get exclusive offers, skincare tips and more.</p>

                <form onSubmit={handleNewsletterSubmit} className="pt-3">
                  <div className="flex items-center bg-white rounded-full border border-[#EDE8E1] p-1 shadow-sm">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1 min-w-0 bg-transparent px-4 py-2 text-xs text-[#13382B] placeholder-[#8E9E95] focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={newsletterLoading}
                      className="px-5 py-2 bg-[#13382B] text-white text-xs font-semibold rounded-full hover:bg-[#1E4D3B] transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-60"
                    >
                      <span>{newsletterLoading ? '...' : 'Subscribe'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  {newsletterMessage && (
                    <p
                      className={`text-[11px] mt-2 font-medium ${
                        newsletterIsError ? 'text-[#B91C1C]' : 'text-[#2D634C]'
                      }`}
                      role="status"
                    >
                      {newsletterMessage}
                    </p>
                  )}
                </form>
              </div>

              <div className="absolute right-3 bottom-0 top-0 w-28 pointer-events-none flex items-center justify-end">
                <img
                  src="/images/home/newsletter_bottle.jpg"
                  alt="Hydra Serum bottle"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/home/newsletter_card.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;