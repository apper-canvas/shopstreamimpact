export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatDiscount = (originalPrice, discountedPrice) => {
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount);
};

export const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};