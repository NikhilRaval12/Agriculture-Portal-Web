import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartSummary } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useDragon } from './DragonContext';

interface CartContextType {
  cart: CartSummary;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const emptyCart: CartSummary = {
  items: [],
  cartCount: 0,
  subtotal: 0,
  discount: 0,
  delivery: 0,
  total: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartSummary>(emptyCart);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const dragon = useDragon();

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      // Local storage fallback for guests
      const local = localStorage.getItem('agri_guest_cart');
      if (local) {
        try {
          setCart(JSON.parse(local));
        } catch {
          setCart(emptyCart);
        }
      } else {
        setCart(emptyCart);
      }
      return;
    }

    try {
      setIsLoading(true);
      const data = await api.cart.get();
      setCart(data);
    } catch (e) {
      console.error('Failed to load remote cart:', e);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      setIsLoading(true);
      dragon.setEmotion('EXCITED', 2000);
      if (isAuthenticated) {
        const updated = await api.cart.add(productId, quantity);
        setCart(updated);
      } else {
        // Guest cart
        const product = await api.products.getById(productId);
        const effectivePrice = product.discountedPrice || product.price;
        const existingIdx = cart.items.findIndex(i => i.productId === productId);
        let newItems = [...cart.items];

        if (existingIdx > -1) {
          newItems[existingIdx].quantity += quantity;
          newItems[existingIdx].total = newItems[existingIdx].quantity * effectivePrice;
        } else {
          newItems.push({
            id: Date.now(),
            productId: product.id,
            productName: product.name,
            imageUrl: product.imageUrl,
            price: product.price,
            discountedPrice: effectivePrice,
            quantity: quantity,
            total: quantity * effectivePrice,
            availableQuantity: product.availableQuantity,
          });
        }

        const subtotal = newItems.reduce((acc, curr) => acc + curr.total, 0);
        const delivery = subtotal > 500 || subtotal === 0 ? 0 : 70;
        const updatedCart: CartSummary = {
          items: newItems,
          cartCount: newItems.reduce((acc, curr) => acc + curr.quantity, 0),
          subtotal,
          discount: 0,
          delivery,
          total: subtotal + delivery,
        };
        setCart(updatedCart);
        localStorage.setItem('agri_guest_cart', JSON.stringify(updatedCart));
      }
      dragon.reactToSuccess('Added to your basket! 🧺');
    } catch (err: any) {
      dragon.reactToError('Could not add to cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      if (isAuthenticated) {
        const updated = await api.cart.updateQuantity(itemId, quantity);
        setCart(updated);
      } else {
        let newItems = cart.items.map(item => {
          if (item.id === itemId) {
            const q = Math.max(0, quantity);
            return { ...item, quantity: q, total: q * item.discountedPrice };
          }
          return item;
        }).filter(item => item.quantity > 0);

        const subtotal = newItems.reduce((acc, curr) => acc + curr.total, 0);
        const delivery = subtotal > 500 || subtotal === 0 ? 0 : 70;
        const updatedCart: CartSummary = {
          items: newItems,
          cartCount: newItems.reduce((acc, curr) => acc + curr.quantity, 0),
          subtotal,
          discount: 0,
          delivery,
          total: subtotal + delivery,
        };
        setCart(updatedCart);
        localStorage.setItem('agri_guest_cart', JSON.stringify(updatedCart));
      }
      dragon.setEmotion('HAPPY', 1500);
    } catch (err) {
      dragon.reactToError('Unable to update quantity');
      throw err;
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      if (isAuthenticated) {
        const updated = await api.cart.removeItem(itemId);
        setCart(updated);
      } else {
        const newItems = cart.items.filter(item => item.id !== itemId);
        const subtotal = newItems.reduce((acc, curr) => acc + curr.total, 0);
        const delivery = subtotal > 500 || subtotal === 0 ? 0 : 70;
        const updatedCart: CartSummary = {
          items: newItems,
          cartCount: newItems.reduce((acc, curr) => acc + curr.quantity, 0),
          subtotal,
          discount: 0,
          delivery,
          total: subtotal + delivery,
        };
        setCart(updatedCart);
        localStorage.setItem('agri_guest_cart', JSON.stringify(updatedCart));
      }
      dragon.setEmotion('CURIOUS', 1500);
    } catch (err) {
      dragon.reactToError('Failed to remove item');
      throw err;
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      await api.cart.clear();
    }
    setCart(emptyCart);
    localStorage.removeItem('agri_guest_cart');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
