import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    // Make openQuickView available globally for ProductGrid components
    if (window.openQuickView) {
      // Function is already available from App component context
      return;
    }
    
    // This will be overridden by App component when it mounts
    window.openQuickView = () => {
      console.warn('QuickView not initialized yet');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;