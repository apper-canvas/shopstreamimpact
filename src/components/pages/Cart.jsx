import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import CartItem from '@/components/molecules/CartItem';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/currency';

const Cart = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <Empty
            title="Your cart is empty"
            message="Add some products to your cart to get started."
            actionLabel="Continue Shopping"
            onAction={() => window.history.back()}
            icon="ShoppingCart"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCart}
            className="text-error border-error hover:bg-error hover:text-white"
          >
            <ApperIcon name="Trash2" size={16} className="mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CartItem item={item} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium price">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-success font-medium">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium price">{formatPrice(total * 0.08)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-primary price">
                    {formatPrice(total * 1.08)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Link to="/checkout">
                  <Button size="lg" className="w-full">
                    <ApperIcon name="CreditCard" size={20} className="mr-2" />
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link to="/">
                  <Button variant="outline" size="lg" className="w-full">
                    <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Shield" size={16} className="mr-2 text-success" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="RotateCcw" size={16} className="mr-2 text-success" />
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Truck" size={16} className="mr-2 text-success" />
                    <span>Free shipping on orders over $50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;