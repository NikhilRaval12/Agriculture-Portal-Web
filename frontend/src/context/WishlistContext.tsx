import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WishlistItem } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useDragon } from './DragonContext';

interface WishlistContextType {
  items: WishlistItem[];
  isLoading: boolean;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (itemId: number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const dragon = useDragon();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      const local = localStorage.getItem('agri_guest_wishlist');
      if (local) {
        try {
          setItems(JSON.parse(local));
        } catch {
          setItems([]);
        }
      }
      return;
    }

    try {
      setIsLoading(true);
      const data = await api.wishlist.get();
      setItems(data);
    } catch (e) {
      console.error('Failed to load wishlist:', e);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId: number) => {
    return items.some(item => item.productId === productId);
  };

  const toggleWishlist = async (productId: number) => {
    try {
      const wasInWishlist = isInWishlist(productId);
      if (isAuthenticated) {
        const updated = await api.wishlist.toggle(productId);
        setItems(updated);
      } else {
        let updated: WishlistItem[];
        if (wasInWishlist) {
          updated = items.filter(item => item.productId !== productId);
        } else {
          const product = await api.products.getById(productId);
          updated = [
            ...items,
            {
              id: Date.now(),
              productId: product.id,
              productName: product.name,
              imageUrl: product.imageUrl,
              price: product.price,
              discountedPrice: product.discountedPrice || product.price,
              discount: product.discount,
              availableQuantity: product.availableQuantity,
              categoryName: product.categoryName,
            },
          ];
        }
        setItems(updated);
        localStorage.setItem('agri_guest_wishlist', JSON.stringify(updated));
      }

      if (wasInWishlist) {
        dragon.setEmotion('CONFUSED', 1500);
      } else {
        dragon.setEmotion('HAPPY', 2000);
        dragon.speak('Saved to your harvest favorites! ❤️', 3000);
      }
    } catch (e) {
      dragon.reactToError('Could not update wishlist');
    }
  };

  const removeFromWishlist = async (itemId: number) => {
    try {
      if (isAuthenticated) {
        const updated = await api.wishlist.remove(itemId);
        setItems(updated);
      } else {
        const updated = items.filter(i => i.id !== itemId);
        setItems(updated);
        localStorage.setItem('agri_guest_wishlist', JSON.stringify(updated));
      }
      dragon.setEmotion('IDLE');
    } catch (e) {
      dragon.reactToError('Failed to remove item');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
