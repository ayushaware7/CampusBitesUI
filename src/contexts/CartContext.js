import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Cart lines come from utils/cart.buildLine. Stored under a new key because the old
// shape (price in rupees, no variants) is not compatible.
const STORAGE_KEY = 'cart_v2';

const CartContext = createContext({
  cartItems: [],
  totalItems: 0,
  totalPaise: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export const useCart = () => useContext(CartContext);

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // storage unavailable: the cart still works for this session
    }
  }, [cartItems]);

  const value = useMemo(() => {
    const addToCart = (line) =>
      setCartItems((prev) =>
        prev.some((l) => l.id === line.id)
          ? prev.map((l) => (l.id === line.id ? { ...l, quantity: l.quantity + 1 } : l))
          : [...prev, { ...line, quantity: 1 }]
      );

    const removeFromCart = (id) => setCartItems((prev) => prev.filter((l) => l.id !== id));

    const updateQuantity = (id, quantity) =>
      setCartItems((prev) =>
        quantity <= 0
          ? prev.filter((l) => l.id !== id)
          : prev.map((l) => (l.id === id ? { ...l, quantity } : l))
      );

    return {
      cartItems,
      totalItems: cartItems.reduce((n, l) => n + l.quantity, 0),
      totalPaise: cartItems.reduce((sum, l) => sum + l.unitPricePaise * l.quantity, 0),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart: () => setCartItems([]),
    };
  }, [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
