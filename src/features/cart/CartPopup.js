// components/CartPopup.js
import React from 'react';
import { useCart } from './CartContext';
import { X } from 'lucide-react';

const CartPopup = ({ isOpen, onClose }) => {
  const { cartItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();

  // Safety check to prevent the "length of undefined" error
  if (!cartItems) {
    return null; // Don't render anything if cartItems is undefined
  }

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Popup Content */}
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 h-full overflow-y-auto pb-32">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden mr-3">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">₹{item.price?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center border rounded overflow-hidden mr-2">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Fixed Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-600">Total:</span>
            <span className="font-bold text-gray-800">₹{totalPrice.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={clearCart}
              className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 font-medium"
              disabled={cartItems.length === 0}
            >
              Clear Cart
            </button>
            <button 
              className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200"
              disabled={cartItems.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;