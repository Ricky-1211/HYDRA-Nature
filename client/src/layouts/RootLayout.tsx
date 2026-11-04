import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/common/CartDrawer';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchWishlist } from '../store/wishlistSlice';

export const RootLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
};
