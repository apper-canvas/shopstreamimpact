import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import StarRating from '@/components/atoms/StarRating';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { useCart } from '@/hooks/useCart';
import { productService } from '@/services/api/productService';
import { formatPrice, formatDiscount } from '@/utils/currency';
import { toast } from 'react-toastify';

const QuickViewModal = ({ isOpen, onClose, productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getCartItem } = useCart();

  useEffect(() => {
    if (isOpen && productId) {
      loadProduct();
    }
  }, [isOpen, productId]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    setSelectedImageIndex(0);
    setQuantity(1);
    
    try {
      const productData = await productService.getById(productId);
      setProduct(productData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && product.inStock) {
      addToCart(product, quantity);
      toast.success(`Added ${product.title} to cart!`);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (!isOpen) return null;

  const hasDiscount = product?.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount ? formatDiscount(product.originalPrice, product.price) : 0;
  const cartItem = product ? getCartItem(product.Id) : null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-modal flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick View</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {loading && (
              <div className="flex items-center justify-center p-8">
                <Loading />
              </div>
            )}

            {error && (
              <div className="p-8">
                <Error message={error} />
              </div>
            )}

            {product && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={product.images[selectedImageIndex]}
                      alt={product.title}
                      className="w-full h-80 md:h-96 object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
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

                  {/* Image Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                            selectedImageIndex === index
                              ? 'border-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {product.title}
                    </h1>
                    <div className="flex items-center gap-3 mb-3">
                      <StarRating rating={product.rating} size={16} />
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-primary price">
                        {formatPrice(product.price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {hasDiscount && (
                      <p className="text-success text-sm font-medium">
                        You save {formatPrice(product.originalPrice - product.price)}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {/* Quantity and Add to Cart */}
                  {product.inStock && (
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Quantity:</span>
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            className="px-3 py-1 hover:bg-gray-50"
                          >
                            <ApperIcon name="Minus" size={16} />
                          </Button>
                          <span className="px-4 py-1 min-w-[3rem] text-center">
                            {quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-50"
                          >
                            <ApperIcon name="Plus" size={16} />
                          </Button>
                        </div>
                      </div>

                      <Button
                        onClick={handleAddToCart}
                        className="w-full"
                        size="lg"
                      >
                        <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
                        Add to Cart - {formatPrice(product.price * quantity)}
                      </Button>

                      {cartItem && (
                        <p className="text-sm text-gray-600 text-center">
                          {cartItem.quantity} item{cartItem.quantity !== 1 ? 's' : ''} already in cart
                        </p>
                      )}
                    </div>
                  )}

                  {!product.inStock && (
                    <div className="pt-4 border-t border-gray-200">
                      <Button disabled className="w-full" size="lg">
                        Out of Stock
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickViewModal;