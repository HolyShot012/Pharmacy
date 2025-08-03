import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => {
      // Use product_id as the primary identifier, fallback to id for backward compatibility
      const productId = product.product_id || product.id;
      const existing = prev.find(item => (item.product_id || item.id) === productId);

      if (existing) {
        return prev.map(item =>
          (item.product_id || item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Add new item to cart with all product information
      return [...prev, {
        ...product,
        quantity: 1,
        // Ensure we have the correct ID field for consistency
        product_id: productId,
        id: productId // Keep id for backward compatibility
      }];
    });
  };

  const updateQuantity = (productId, change) => {
    setCartItems(prev =>
      prev.map(item =>
        (item.product_id || item.id) === productId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev =>
      prev.filter(item => (item.product_id || item.id) !== productId)
    );
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => (item.product_id || item.id) === productId);
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => (item.product_id || item.id) === productId);
    return item ? item.quantity : 0;
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartItemCount,
      getCartTotal,
      isInCart,
      getItemQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}