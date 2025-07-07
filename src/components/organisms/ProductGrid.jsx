import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/molecules/ProductCard';

const ProductGrid = ({ products, title }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {title}
        </h2>
      )}
      
      <div className="product-grid">
        {products.map((product, index) => (
          <motion.div
            key={product.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;