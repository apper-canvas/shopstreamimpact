import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import StarRating from '@/components/atoms/StarRating';
import ApperIcon from '@/components/ApperIcon';
import { useCart } from '@/hooks/useCart';
import { formatPrice, formatDiscount } from '@/utils/currency';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount ? formatDiscount(product.originalPrice, product.price) : 0;

  return (
    <motion.div
      className="bg-white rounded-lg shadow-product hover:shadow-lg transition-all duration-300 overflow-hidden group"
      whileHover={{ y: -4 }}
    >
      <Link to={`/product/${product.Id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.onSale && (
              <Badge variant="sale">
                {discountPercentage}% OFF
              </Badge>
            )}
            {product.isNew && (
              <Badge variant="new">NEW</Badge>
            )}
            {product.bestSeller && (
              <Badge variant="secondary">BESTSELLER</Badge>
            )}
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={product.rating} size={14} />
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary price">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {product.inStock && (
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ApperIcon name="Plus" size={16} />
              </Button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;