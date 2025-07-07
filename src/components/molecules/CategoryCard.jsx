import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryCard = ({ category }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-product hover:shadow-lg transition-all duration-300 overflow-hidden group"
      whileHover={{ y: -4 }}
    >
      <Link to={`/category/${category.slug}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {category.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {category.productCount} products
            </span>
            <span className="text-primary font-medium text-sm group-hover:underline">
              Shop Now →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;