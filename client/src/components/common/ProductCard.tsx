import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlistItem } from '../../store/wishlistSlice';
import { getImageUrl } from '../../utils/imageUrl';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((i) => i._id === product._id);
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addToCart({
        productId: product._id,
        product,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0] || '',
        size: product.size || '50ml',
        quantity: 1,
      })
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlistItem(product));
  };

  // Badge Color Style
  const getBadgeStyle = (tag?: string) => {
    switch (tag) {
      case 'Best Seller':
        return 'bg-[#987938] text-white';
      case 'New':
        return 'bg-[#2E6B48] text-white';
      case 'Trending':
        return 'bg-[#C26D2B] text-white';
      case 'Organic':
        return 'bg-[#4A7C59] text-white';
      default:
        return 'bg-[#13382B] text-white';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE8E1] hover:border-[#C5A880]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgba(19,56,43,0.08)] transition-all duration-300 flex flex-col justify-between">
      {/* Top Bar: Badge & Wishlist Heart */}
      <div className="relative w-full flex items-center justify-between z-10">
        {product.tag ? (
          <span
            className={`text-[11px] font-medium tracking-wide px-3 py-1 rounded-full shadow-sm ${getBadgeStyle(
              product.tag
            )}`}
          >
            {product.tag}
          </span>
        ) : (
          <span />
        )}

        <button
          onClick={handleToggleWishlist}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-[#EDE8E1] flex items-center justify-center text-[#687770] hover:text-[#B91C1C] hover:border-[#B91C1C]/30 transition-all shadow-sm"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isInWishlist ? 'fill-[#B91C1C] text-[#B91C1C]' : 'stroke-current'
            }`}
          />
        </button>
      </div>

      {/* Product Image Stage */}
      <Link
        to={`/shop/${product.slug || product._id}`}
        className="block my-3 overflow-hidden rounded-xl bg-gradient-to-b from-[#FAF8F5] to-[#F1ECE5]/60 p-4 aspect-square flex items-center justify-center relative group-hover:bg-[#FAF8F5]/90 transition-colors"
      >
        <img
          src={getImageUrl(product.images?.[0]) || FALLBACK_IMAGE}
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
          className="h-full w-full object-contain object-center drop-shadow-[0_10px_15px_rgba(19,56,43,0.12)] group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Product Details & Actions */}
      <div className="pt-2">
        <Link to={`/shop/${product.slug || product._id}`} className="block group-hover:text-[#13382B]">
          <h3 className="font-serif text-lg font-semibold text-[#1A211D] leading-snug line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-[#708078] font-sans mt-0.5 line-clamp-1">
            {product.subtitle || product.category}
          </p>
        </Link>

        {/* Price & Add to Cart Circle Button */}
        <div className="mt-3.5 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-bold text-[#13382B]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-[#8E9E95] line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all shadow-sm ${
              added
                ? 'bg-[#2E6B48]'
                : product.stock <= 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#13382B] hover:bg-[#1E4D3B] hover:scale-105 active:scale-95'
            }`}
            title={product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          >
            {added ? (
              <Check className="w-4 h-4 text-white animate-scale-in" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
