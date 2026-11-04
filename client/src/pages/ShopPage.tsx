import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, X, Check, ChevronDown, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { productService, ProductQueryParams } from '../services/productService';
import { Product } from '../types';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>(['All']);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters from URL or state
  const currentCategory = searchParams.get('category') || 'All Products';
  const currentSubcategory = searchParams.get('subcategory') || 'All';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'popular';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Fetch dynamic categories
  useEffect(() => {
    productService
      .getCategories()
      .then((cats) => {
        if (Array.isArray(cats) && cats.length > 0) {
          setCategories(cats);
        } else {
          // Default fallbacks if database just initialized
          setCategories([
            { name: 'Face Care', count: 0 },
            { name: 'Body Care', count: 0 },
            { name: 'Hair Care', count: 0 },
            { name: 'Skincare Sets', count: 0 },
            { name: 'Natural Care', count: 0 },
            { name: 'Organic Range', count: 0 },
          ]);
        }
      })
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Fetch dynamic subcategories for currently selected category
  useEffect(() => {
    const catQuery = currentCategory !== 'All Products' ? currentCategory : undefined;
    productService
      .getSubcategories(catQuery)
      .then((subs) => {
        if (Array.isArray(subs) && subs.length > 0) {
          setSubcategories(['All', ...subs]);
        } else {
          setSubcategories(['All', 'Serums', 'Moisturizers', 'Cleansers', 'Sunscreens', 'Essentials']);
        }
      })
      .catch(() => {
        setSubcategories(['All', 'Serums', 'Moisturizers', 'Cleansers', 'Sunscreens', 'Essentials']);
      });
  }, [currentCategory]);

  // Sync search input when URL changes
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Fetch products with dynamic filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: ProductQueryParams = {
          page: currentPage,
          limit: 12,
          sort: currentSort,
        };

        if (currentCategory && currentCategory !== 'All Products') {
          params.category = currentCategory;
        }
        if (currentSubcategory && currentSubcategory !== 'All') {
          params.subcategory = currentSubcategory;
        }
        if (currentSearch) {
          params.search = currentSearch;
        }
        if (inStockOnly) {
          params.inStock = true;
        }

        const res = await productService.getAll(params);
        setProducts(res.data || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, currentSubcategory, currentSearch, currentSort, currentPage, inStockOnly]);

  const handleCategorySelect = (categoryName: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryName === 'All Products') {
      newParams.delete('category');
    } else {
      newParams.set('category', categoryName);
    }
    newParams.delete('subcategory');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSubcategorySelect = (subName: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (subName === 'All') {
      newParams.delete('subcategory');
    } else {
      newParams.set('subcategory', subName);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchInput('');
    setInStockOnly(false);
  };

  return (
    <div className="w-full bg-[#FAF8F5] pb-20">
      {/* 1. SHOP HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#F0ECE4] via-[#F4EFEB] to-[#EBE4D8] border-b border-[#EDE8E1] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="text-xs text-[#708078] tracking-widest uppercase font-medium">
              Home / Shop {currentCategory !== 'All Products' ? `/ ${currentCategory}` : ''}
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#13382B]">
              {currentCategory === 'All Products' ? 'Shop Our Skincare' : currentCategory}
            </h1>
            <p className="text-sm text-gray-600 max-w-md">
              Discover clean, cellular formulations crafted with potent active botanicals and verified clinical purity.
            </p>
          </div>

          <div className="w-48 sm:w-64 h-36 sm:h-44 rounded-2xl overflow-hidden shadow-lg border-2 border-white flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"
              alt="Hydra Skincare Formulation"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. FILTER & CATALOG BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Control Bar */}
        <div className="bg-white rounded-2xl p-4 border border-[#EDE8E1] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Dynamic Subcategory Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {subcategories.map((sub) => {
              const isSelected =
                (currentSubcategory === sub) ||
                (currentSubcategory === '' && sub === 'All') ||
                (!currentSubcategory && sub === 'All');

              return (
                <button
                  key={sub}
                  onClick={() => handleSubcategorySelect(sub)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#13382B] text-white shadow-sm'
                      : 'bg-[#FAF8F5] text-gray-600 hover:bg-[#EDE8E1]'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-56">
              <input
                type="text"
                placeholder="Search formulations..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 text-xs bg-[#FAF8F5] border border-[#EDE8E1] rounded-full focus:outline-none focus:border-[#13382B]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </form>

            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="hidden sm:inline">Sort:</span>
              <select
                value={currentSort}
                onChange={handleSortChange}
                className="bg-[#FAF8F5] border border-[#EDE8E1] rounded-full px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#13382B] cursor-pointer"
              >
                <option value="popular">Popular</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout: Categories Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Left Sidebar: Dynamic Categories & Filters */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            {/* Dynamic Categories Box */}
            <div className="bg-white rounded-2xl p-6 border border-[#EDE8E1] shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-[#13382B] border-b border-gray-100 pb-3 flex items-center justify-between">
                <span>Categories</span>
                <span className="text-[10px] text-gray-400 font-sans font-normal">
                  {total} available
                </span>
              </h3>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => handleCategorySelect('All Products')}
                    className={`w-full text-left py-2 px-3 rounded-xl flex items-center justify-between transition-colors ${
                      currentCategory === 'All Products'
                        ? 'bg-[#EAF1EB] text-[#13382B] font-bold shadow-sm'
                        : 'text-gray-600 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>All Products</span>
                    <span className="text-[11px] text-gray-400 font-mono">{total}</span>
                  </button>
                </li>
                {categories.map((cat) => {
                  const isSelected = currentCategory.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <li key={cat.name}>
                      <button
                        onClick={() => handleCategorySelect(cat.name)}
                        className={`w-full text-left py-2 px-3 rounded-xl flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-[#EAF1EB] text-[#13382B] font-bold shadow-sm'
                            : 'text-gray-600 hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[11px] text-gray-400 font-mono">{cat.count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* In Stock Toggle */}
            <div className="bg-white rounded-2xl p-5 border border-[#EDE8E1] shadow-sm">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-gray-800">In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#13382B] focus:ring-[#13382B] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            {/* Botanical Guarantee Banner */}
            <div className="bg-[#13382B] text-white rounded-2xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center gap-1.5 text-[#C5A880]">
                <Sparkles className="w-3.5 h-3.5" />
                <p className="text-xs font-serif font-bold">Cellular Purity Guarantee</p>
              </div>
              <p className="text-[11px] text-[#A2B997] leading-relaxed">
                Zero parabens, artificial dyes, harsh sulfates, or mineral oils. Sustainably packaged in UV-protective glass.
              </p>
            </div>
          </aside>

          {/* Right Product Grid */}
          <div className="lg:col-span-9">
            {/* Active Filters display */}
            {(currentCategory !== 'All Products' || currentSearch || (currentSubcategory && currentSubcategory !== 'All') || inStockOnly) && (
              <div className="flex items-center gap-2 mb-4 flex-wrap text-xs">
                <span className="text-gray-500 font-medium">Filters:</span>
                {currentCategory !== 'All Products' && (
                  <span className="px-2.5 py-1 bg-[#EAF1EB] text-[#2E6B48] font-medium rounded-full flex items-center gap-1">
                    Category: {currentCategory}
                    <button onClick={() => handleCategorySelect('All Products')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {currentSubcategory && currentSubcategory !== 'All' && (
                  <span className="px-2.5 py-1 bg-[#EAF1EB] text-[#2E6B48] font-medium rounded-full flex items-center gap-1">
                    Subcategory: {currentSubcategory}
                    <button onClick={() => handleSubcategorySelect('All')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {currentSearch && (
                  <span className="px-2.5 py-1 bg-[#EAF1EB] text-[#2E6B48] font-medium rounded-full flex items-center gap-1">
                    "{currentSearch}"
                    <button
                      onClick={() => {
                        const p = new URLSearchParams(searchParams);
                        p.delete('search');
                        setSearchParams(p);
                        setSearchInput('');
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="px-2.5 py-1 bg-[#EAF1EB] text-[#2E6B48] font-medium rounded-full flex items-center gap-1">
                    In Stock Only
                    <button onClick={() => setInStockOnly(false)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-red-600 hover:underline ml-2 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-white rounded-2xl animate-pulse p-4 border border-[#EDE8E1]" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            const newParams = new URLSearchParams(searchParams);
                            newParams.set('page', pageNum.toString());
                            setSearchParams(newParams);
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          className={`w-9 h-9 rounded-full text-xs font-semibold transition-all ${
                            currentPage === pageNum
                              ? 'bg-[#13382B] text-white shadow-md'
                              : 'bg-white border border-[#EDE8E1] text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#EDE8E1] shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#EAF1EB] text-[#13382B] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#1A211D]">
                  No Skincare Formulations Found
                </h3>
                <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">
                  We couldn't find any products matching your current filters. Try resetting or selecting another category.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2.5 bg-[#13382B] text-white text-xs font-semibold rounded-full hover:bg-[#1E4D3B] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
