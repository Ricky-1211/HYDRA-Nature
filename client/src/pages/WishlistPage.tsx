import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { useAppDispatch, useAppSelector } from '../store';
import { clearWishlist } from '../store/wishlistSlice';

export const WishlistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.wishlist);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-[#FAF0F0] text-[#B91C1C] flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#13382B]">Your Wishlist is Empty</h2>
        <p className="text-xs text-gray-500 mt-2">
          Save your favorite botanical serums, creams, and sets by clicking the heart icon on any
          product.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-[#13382B] text-white rounded-full text-xs font-semibold hover:bg-[#1E4D3B] transition-colors shadow-md"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF8F5] pb-24">
      <div className="border-b border-[#EDE8E1] bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#13382B]">
            My Saved Wishlist ({items.length})
          </h1>
          <button
            onClick={() => dispatch(clearWishlist())}
            className="text-xs text-red-600 hover:underline"
          >
            Clear Wishlist
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
