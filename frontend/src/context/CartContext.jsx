import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle, X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotification } from './NotificationContext';
import './Notifications.css';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { addNotification } = useNotification();
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('amazon_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('amazon_cart', JSON.stringify(cart));
  }, [cart]);

  const parseQuantity = (value) => {
    const qty = Number(value);
    return Number.isFinite(qty) && qty > 0 ? qty : 0;
  };

  const parsePrice = (value) => {
    if (typeof value === 'string') {
      const cleaned = value.replace(/,/g, '').trim();
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const addToCart = (product) => {
    const existingInCart = cart.find(item => item.id === product.id);
    const maxStock = product?.stock ? parseQuantity(product.stock) : Infinity;
    const currentQty = existingInCart ? parseQuantity(existingInCart.quantity) : 0;

    if (currentQty >= maxStock) {
      alert('Cannot add more than available stock!');
      return;
    }

    addNotification(product, 'cart');

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const unitPrice = parsePrice(item.price);
      const qty = parseQuantity(item.quantity);
      return total + unitPrice * qty;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};
