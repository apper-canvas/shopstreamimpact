import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import QuickViewModal from "@/components/molecules/QuickViewModal";
import Layout from "@/components/organisms/Layout";
import ProductDetail from "@/components/pages/ProductDetail";
import Cart from "@/components/pages/Cart";
import Category from "@/components/pages/Category";
import Search from "@/components/pages/Search";
import Checkout from "@/components/pages/Checkout";
import Home from "@/components/pages/Home";
import { CartProvider } from "@/hooks/useCart";

function App() {
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState(null);

  const openQuickView = (productId) => {
    setQuickViewProductId(productId);
    setShowQuickView(true);
  };

  const closeQuickView = () => {
    setShowQuickView(false);
    setQuickViewProductId(null);
  };

  // Make openQuickView available globally
  useEffect(() => {
    window.openQuickView = openQuickView;
    return () => {
      delete window.openQuickView;
    };
  }, []);

  return (
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProductId, setQuickViewProductId] = useState(null);

  const openQuickView = (productId) => {
    setQuickViewProductId(productId);
    setShowQuickView(true);
  };

  const closeQuickView = () => {
    setShowQuickView(false);
    setQuickViewProductId(null);
  };

  return (
<CartProvider>
      <div className="min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/search" element={<Search />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
        />
        <QuickViewModal
          isOpen={showQuickView}
          onClose={closeQuickView}
          productId={quickViewProductId}
        />
      </div>
    </CartProvider>
  );
}

export default App;