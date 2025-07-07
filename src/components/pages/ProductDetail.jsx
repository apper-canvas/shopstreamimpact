import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import StarRating from '@/components/atoms/StarRating';
import ProductGrid from '@/components/organisms/ProductGrid';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { useCart } from '@/hooks/useCart';
import { productService } from '@/services/api/productService';
import { formatPrice, formatDiscount } from '@/utils/currency';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, getCartItem } = useCart();

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const productData = await productService.getById(productId);
      setProduct(productData);
      setSelectedImage(0);

      const related = await productService.getRelated(productId, productData.categoryId);
      setRelatedProducts(related);
    } catch (err) {
      setError('Failed to load product details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Loading type="product-detail" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Error message={error} onRetry={loadData} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Error message="Product not found" showRetry={false} />
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount ? formatDiscount(product.originalPrice, product.price) : 0;
  const cartItem = getCartItem(product.Id);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ApperIcon name="ChevronRight" size={16} />
            <Link to={`/category/${product.categoryId}`} className="hover:text-primary">
              {product.category}
            </Link>
            <ApperIcon name="ChevronRight" size={16} />
            <span className="text-gray-900">{product.title}</span>
          </div>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
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
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
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
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <StarRating 
                  rating={product.rating} 
                  showCount={true} 
                  reviewCount={product.reviews}
                  size={20}
                />
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary price">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ApperIcon name="Check" size={16} className="text-success mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Specifications:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{key}:</span>
                      <span className="text-gray-900 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ApperIcon name="Minus" size={16} />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-2 hover:bg-gray-50"
                    >
                      <ApperIcon name="Plus" size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <ApperIcon 
                    name={product.inStock ? "Check" : "X"} 
                    size={16} 
                    className={product.inStock ? "text-success" : "text-error"}
                  />
                  <span className={product.inStock ? "text-success" : "text-error"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ApperIcon name="ShoppingCart" size={20} className="mr-2" />
                  Add to Cart
                </Button>
                
                {cartItem && (
                  <div className="text-sm text-gray-600 text-center">
                    {cartItem.quantity} item(s) already in cart
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;