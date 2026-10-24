import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context with default values to prevent undefined errors
const CartContext = createContext({
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {}
});

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Load cart from localStorage when component mounts
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        // Reset cart if there's an error
        localStorage.removeItem('cart');
        setCartItems([]);
      }
    }
  }, []);

  useEffect(() => {
    // Update total items count
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    setTotalItems(itemCount);
    
    // Update total price
    const price = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    setTotalPrice(price);
    
    // Save to localStorage whenever cart changes
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Item exists, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // Item doesn't exist, add new item with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    // Ensure quantity is a positive number
    const newQuantity = Math.max(0, quantity);
    
    setCartItems(prevItems => {
      if (newQuantity === 0) {
        // Remove item if quantity is 0
        return prevItems.filter(item => item.id !== itemId);
      }
      
      return prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;       