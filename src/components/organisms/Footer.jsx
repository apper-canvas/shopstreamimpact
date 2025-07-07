import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const Footer = () => {
  const footerLinks = {
    'Customer Service': [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Shipping Info', href: '#' },
      { name: 'Returns & Exchanges', href: '#' },
    ],
    'About': [
      { name: 'Our Story', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Sustainability', href: '#' },
    ],
    'Categories': [
      { name: 'Electronics', href: '/category/electronics' },
      { name: 'Clothing', href: '/category/clothing' },
      { name: 'Home & Kitchen', href: '/category/home-kitchen' },
      { name: 'Sports & Outdoors', href: '/category/sports-outdoors' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: 'Facebook', href: '#' },
    { name: 'Twitter', icon: 'Twitter', href: '#' },
    { name: 'Instagram', icon: 'Instagram', href: '#' },
    { name: 'LinkedIn', icon: 'Linkedin', href: '#' },
  ];

  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 lg:col-span-1">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <ApperIcon name="ShoppingBag" size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold font-display">
                  ShopStream
                </span>
              </Link>
              <p className="text-gray-300 mb-4">
                Your ultimate shopping destination for quality products at great prices.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <ApperIcon name={link.icon} size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="font-semibold text-white mb-4">{title}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-white mb-2">
                Subscribe to our newsletter
              </h3>
              <p className="text-gray-300">
                Get the latest deals and product updates delivered to your inbox.
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-2 rounded-l-md border-0 focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center space-x-2 text-gray-300">
              <ApperIcon name="Shield" size={20} />
              <span className="text-sm">Secure Shopping</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <ApperIcon name="Truck" size={20} />
              <span className="text-sm">Free Shipping</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <ApperIcon name="RotateCcw" size={20} />
              <span className="text-sm">Easy Returns</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <ApperIcon name="Headphones" size={20} />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-300 text-sm">
              © 2024 ShopStream. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;