import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { publicApi } from '../services/api';
import { RAZORPAY_KEY_ID } from '../config';
import { formatPaise } from '../utils/money';
import { describeLine } from '../utils/cart';

const CheckoutPage = () => { // 
  const navigate = useNavigate();
  const { cartItems, totalPaise, updateQuantity, removeFromCart, clearCart } = useCart(); // 
  const [customerInfo, setCustomerInfo] = useState({ // 
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'razorpay'
  });
  const [isProcessing, setIsProcessing] = useState(false); // [cite: 79]
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  
  
  // Load Razorpay script (useEffect remains the same) [cite: 80-81]
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      alert('Failed to load payment gateway. Please refresh the page.');
    };
   
     document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // --- REMOVED saveOrderToLocalStorage FUNCTION [cite: 82-84] ---
  // The backend now handles all storage.

  // [Functions handleInputChange, handleDecreaseQuantity, handleIncreaseQuantity,
  //  handleRemoveItem, handleBack all remain the same: 85-93]
  
  const handleInputChange = (e) => { // [cite: 85]
    const { name, value } = e.target;
    setCustomerInfo({ // [cite: 86]
      ...customerInfo,
      [name]: value
    });
  };

  const handleDecreaseQuantity = (itemId) => { // [cite: 87]
    const item = cartItems.find(item => item.id === itemId);
    if (item) { // [cite: 88]
      if (item.quantity <= 1) {
        removeFromCart(itemId); // [cite: 88]
      } else {
        updateQuantity(itemId, item.quantity - 1); // [cite: 89]
      }
    }
  };
  
  const handleIncreaseQuantity = (itemId) => { // [cite: 90]
    const item = cartItems.find(item => item.id === itemId);
    if (item) { // [cite: 91]
      updateQuantity(itemId, item.quantity + 1);
    }
  };
  
  const handleRemoveItem = (itemId) => { // [cite: 92]
    removeFromCart(itemId);
  };
  
  const handleBack = () => { // [cite: 93]
    navigate('/menu');
  };

  // The server prices the cart, stores the order (awaiting payment) and opens the payment; the
  // browser only opens the Razorpay popup and then asks the server to verify the result.
  const initiateRazorpayPayment = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Please fill in your name and phone number');
      return;
    }
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }
    if (!razorpayLoaded) {
      alert('Payment gateway is still loading. Please wait a moment.');
      return;
    }

    setIsProcessing(true);

    try {
      const placed = await publicApi.placeOrder({
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        items: cartItems.map((l) => ({ itemId: l.itemId, variantId: l.variantId, addonIds: l.addonIds, quantity: l.quantity })),
      });

      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY_ID,
        amount: placed.totalPaise,
        currency: 'INR',
        name: 'Campus Bites',
        description: `Order ${placed.code}`,
        order_id: placed.gatewayOrderId,
        handler: async (response) => {
          try {
            await publicApi.verifyPayment({
              orderId: placed.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            // remembered so the tracking page can open this order straight away
            try {
              localStorage.setItem('lastOrder', JSON.stringify({ code: placed.code, phone: customerInfo.phone }));
            } catch {
              // storage unavailable: the customer can still type the code and phone
            }
            clearCart();
            navigate('/track-orders');
          } catch (err) {
            alert(`We could not confirm your payment yet (${err.message}). If money was deducted your order will be confirmed shortly. Keep your order code: ${placed.code}`);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: { name: customerInfo.name, email: customerInfo.email, contact: customerInfo.phone },
        theme: { color: '#ff610c' },
        modal: { ondismiss: () => setIsProcessing(false) },
      });
      rzp.open();
    } catch (err) {
      alert(err.message);
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => { // [cite: 118]
    e.preventDefault();
    initiateRazorpayPayment();
  };

  // [The rest of the JSX (return statement) remains exactly the same: 119-155]
  // ... (No changes to the HTML structure)
  return (
    <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
            {cartItems.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-600 mb-4">Your cart is empty</p>
                    <button 
                        onClick={handleBack}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg"
                    >
                        Return to Menu
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="max-h-64 overflow-y-auto mb-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="mb-3 pb-3 border-b border-gray-100 last:border-b-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <span className="font-medium text-sm">{item.name}</span>
                                                {describeLine(item) && <div className="text-gray-500 text-xs">{describeLine(item)}</div>}
                                                <div className="text-green-600 text-sm">{formatPaise(item.unitPricePaise)} each</div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-red-500 hover:text-red-700 text-sm ml-2"
                                                title="Remove item"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleDecreaseQuantity(item.id)}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                                                >
                                                    −
                                                </button>
                                                <span className="text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleIncreaseQuantity(item.id)}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="text-green-600 font-medium text-sm">{formatPaise(item.unitPricePaise * item.quantity)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pt-4 mt-2">
                                <div className="flex justify-between text-gray-600 mb-2">
                                    <span>Subtotal</span>
                                    <span>{formatPaise(totalPaise)}</span>
                                 </div>
                                <div className="flex justify-between font-bold text-lg mt-3">
                                    <span>Total</span>
                                    <span>{formatPaise(totalPaise)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4">Your Information</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="name">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={customerInfo.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={customerInfo.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1" htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={customerInfo.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-1">Payment Method</label>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="razorpay"
                                                checked={customerInfo.paymentMethod === 'razorpay'}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            Online Payment (Razorpay)
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-6">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg"
                                    >
                                        Back to Menu
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isProcessing || cartItems.length === 0 || !razorpayLoaded}
                                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {!razorpayLoaded ?
                                            'Loading Payment...' : 
                                            isProcessing ?
                                            'Processing...' : 
                                            'Place Order'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default CheckoutPage;