import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { useCart } from '@/hooks/useCart';
import { orderService } from '@/services/api/orderService';
import { formatPrice } from '@/utils/currency';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const total = getCartTotal();
  const tax = total * 0.08;
  const finalTotal = total + tax;

  const handleShippingChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateShipping = () => {
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    return required.every(field => shippingInfo[field].trim() !== '');
  };

  const validatePayment = () => {
    if (paymentInfo.method === 'credit_card') {
      return paymentInfo.cardNumber && paymentInfo.expiryDate && paymentInfo.cvv && paymentInfo.cardName;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateShipping()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validatePayment()) {
      setCurrentStep(3);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        items: cart.map(item => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: finalTotal,
        shipping: shippingInfo,
        payment: {
          method: paymentInfo.method,
          last4: paymentInfo.method === 'credit_card' ? paymentInfo.cardNumber.slice(-4) : null,
        },
      };

      const order = await orderService.create(orderData);
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.Id}`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const steps = [
    { number: 1, title: 'Shipping', icon: 'Truck' },
    { number: 2, title: 'Payment', icon: 'CreditCard' },
    { number: 3, title: 'Review', icon: 'CheckCircle' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step.number <= currentStep 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.number < currentStep ? (
                    <ApperIcon name="Check" size={20} />
                  ) : (
                    <ApperIcon name={step.icon} size={20} />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.number <= currentStep ? 'text-primary' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-px mx-4 ${
                    step.number < currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <Input
                      value={shippingInfo.firstName}
                      onChange={(e) => handleShippingChange('firstName', e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <Input
                      value={shippingInfo.lastName}
                      onChange={(e) => handleShippingChange('lastName', e.target.value)}
                      placeholder="Doe"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => handleShippingChange('email', e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <Input
                      value={shippingInfo.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <Input
                      value={shippingInfo.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      placeholder="New York"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <Select
                      value={shippingInfo.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      required
                    >
                      <option value="">Select State</option>
                      <option value="NY">New York</option>
                      <option value="CA">California</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <Input
                      value={shippingInfo.zipCode}
                      onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                      placeholder="10001"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <Select
                      value={shippingInfo.country}
                      onChange={(e) => handleShippingChange('country', e.target.value)}
                      required
                    >
                      <option value="USA">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleNextStep}>
                    Continue to Payment
                    <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Payment Information */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Payment Information
                </h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit_card"
                        checked={paymentInfo.method === 'credit_card'}
                        onChange={(e) => handlePaymentChange('method', e.target.value)}
                        className="mr-2"
                      />
                      <span>Credit Card</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentInfo.method === 'paypal'}
                        onChange={(e) => handlePaymentChange('method', e.target.value)}
                        className="mr-2"
                      />
                      <span>PayPal</span>
                    </label>
                  </div>
                </div>
                
                {paymentInfo.method === 'credit_card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <Input
                        value={paymentInfo.cardNumber}
                        onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <Input
                        value={paymentInfo.expiryDate}
                        onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <Input
                        value={paymentInfo.cvv}
                        onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                        placeholder="123"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <Input
                        value={paymentInfo.cardName}
                        onChange={(e) => handlePaymentChange('cardName', e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                    Back to Shipping
                  </Button>
                  <Button onClick={handleNextStep}>
                    Review Order
                    <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Order Review */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Review Your Order
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <div className="text-sm text-gray-600">
                      <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                      <p>{shippingInfo.country}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                    <div className="text-sm text-gray-600">
                      {paymentInfo.method === 'credit_card' ? (
                        <p>Credit Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                      ) : (
                        <p>PayPal</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                  >
                    <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                    Back to Payment
                  </Button>
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    loading={loading}
                  >
                    <ApperIcon name="Check" size={16} className="mr-2" />
                    Place Order
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="truncate mr-2">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-medium price">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 mb-4 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="price">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="text-success">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="price">{formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-primary price">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;