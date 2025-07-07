import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/currency';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item.productId, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <Link to={`/product/${item.productId}`}>
        <img
          src={item.image}
          alt={item.title}
          className="w-16 h-16 object-cover rounded-md"
        />
      </Link>
      
      <div className="flex-1">
        <Link to={`/product/${item.productId}`}>
          <h3 className="font-medium text-gray-900 hover:text-primary transition-colors">
            {item.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          {formatPrice(item.price)} each
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <ApperIcon name="Minus" size={16} />
        </Button>
        
        <span className="w-8 text-center font-medium">
          {item.quantity}
        </span>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleQuantityChange(item.quantity + 1)}
        >
          <ApperIcon name="Plus" size={16} />
        </Button>
      </div>
      
      <div className="text-right">
        <p className="font-semibold text-gray-900 price">
          {formatPrice(item.price * item.quantity)}
        </p>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRemove}
          className="text-error hover:text-red-700 mt-1"
        >
          <ApperIcon name="Trash2" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;