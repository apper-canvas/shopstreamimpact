import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import { useCart } from '@/hooks/useCart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const location = useLocation();
  const cartCount = getCartCount();

  const navigation = [
    { name: 'Home', href: '/', icon: 'Home' },
    { name: 'Electronics', href: '/category/electronics', icon: 'Smartphone' },
    { name: 'Clothing', href: '/category/clothing', icon: 'Shirt' },
    { name: 'Home & Kitchen', href: '/category/home-kitchen', icon: 'Home' },
    { name: 'Sports', href: '/category/sports-outdoors', icon: 'Dumbbell' },
    { name: 'Beauty', href: '/category/beauty-personal-care', icon: 'Sparkles' },
  ];

  const isActiveLink = (href) => {
    if (href === '/' && location.pathname === '/') return true;
    if (href !== '/' && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="ShoppingBag" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold font-display gradient-text">
              ShopStream
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActiveLink(item.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <ApperIcon name={item.icon} size={16} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" className="relative p-2">
                <ApperIcon name="ShoppingCart" size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <ApperIcon name={isMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    isActiveLink(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ApperIcon name={item.icon} size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;