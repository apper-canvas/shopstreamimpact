import { createContext, useContext, useReducer, useEffect } from 'react';
import { getFromStorage, setToStorage } from '@/utils/storage';
import { toast } from 'react-toastify';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART': {
      return {
        ...state,
        items: action.payload,
      };
    }
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          ...state,
          items: updatedItems,
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
        };
      }
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload),
      };
    }
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.productId === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
      };
    }
    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
      };
    }
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = getFromStorage('cart', []);
    dispatch({ type: 'SET_CART', payload: savedCart });
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    setToStorage('cart', state.items);
  }, [state.items]);

  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product.Id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        quantity,
      },
    });
    toast.success(`${product.title} added to cart!`);
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
    toast.info('Item removed from cart');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { productId, quantity },
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.info('Cart cleared');
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartItem = (productId) => {
    return state.items.find(item => item.productId === productId);
  };

  const value = {
    cart: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    getCartItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};