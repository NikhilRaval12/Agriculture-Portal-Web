import {
  AuthResponse,
  BlogPost,
  CartSummary,
  Category,
  Order,
  Product,
  User,
  WishlistItem,
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const getHeaders = () => {
  const token = localStorage.getItem('agri_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  auth: {
    signIn: async (credentials: { username: string; password: string }): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Sign in failed' }));
        throw new Error(error.message || 'Invalid credentials');
      }
      return res.json();
    },

    signUp: async (data: {
      fullName: string;
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
      phone?: string;
    }): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Sign up failed' }));
        throw new Error(error.message || 'Registration failed');
      }
      return res.json();
    },

    getProfile: async (): Promise<User> => {
      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      return res.json();
    },
  },

  // Categories
  categories: {
    getAll: async (): Promise<Category[]> => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        return await res.json();
      } catch (e) {
        // Fallback seed
        return [
          { id: 1, name: 'Vegetables', description: 'Fresh organic vegetables harvested directly from regional farms.', imageUrl: '/images/category-1.jpg' },
          { id: 2, name: 'Fruits', description: 'Crisp, sweet, and sun-ripened seasonal fruits.', imageUrl: '/images/category-2.jpg' },
          { id: 3, name: 'Fertilizers', description: 'Certified bio-fertilizers and organic soil nourishment enhancers.', imageUrl: '/images/fertilizers.jpg' },
          { id: 4, name: 'Machineries', description: 'Reliable agricultural machinery and precision tools for modern cultivation.', imageUrl: '/images/machineries.jpg' },
        ];
      }
    },

    getById: async (id: number): Promise<Category> => {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`);
      if (!res.ok) throw new Error('Failed to fetch category');
      return res.json();
    },
  },

  // Products
  products: {
    getAll: async (categoryId?: number, search?: string, page = 0, size = 12): Promise<{
      products: Product[];
      currentPage: number;
      totalItems: number;
      totalPages: number;
    }> => {
      try {
        const params = new URLSearchParams();
        if (categoryId) params.append('categoryId', categoryId.toString());
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('size', size.toString());

        const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        return await res.json();
      } catch (e) {
        return {
          products: [],
          currentPage: 0,
          totalItems: 0,
          totalPages: 1,
        };
      }
    },

    getFeatured: async (): Promise<Product[]> => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/featured`);
        if (!res.ok) throw new Error('Failed to fetch featured products');
        return await res.json();
      } catch (e) {
        return [];
      }
    },

    getById: async (id: number): Promise<Product> => {
      const res = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    },

    search: async (query: string): Promise<Product[]> => {
      const res = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
  },

  // Cart
  cart: {
    get: async (): Promise<CartSummary> => {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch cart');
      return res.json();
    },

    add: async (productId: number, quantity = 1): Promise<CartSummary> => {
      const res = await fetch(`${API_BASE_URL}/cart/add/${productId}?quantity=${quantity}`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to add item to cart');
      return res.json();
    },

    updateQuantity: async (itemId: number, quantity: number): Promise<CartSummary> => {
      const res = await fetch(`${API_BASE_URL}/cart/item/${itemId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error('Failed to update quantity');
      return res.json();
    },

    removeItem: async (itemId: number): Promise<CartSummary> => {
      const res = await fetch(`${API_BASE_URL}/cart/item/${itemId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to remove item');
      return res.json();
    },

    clear: async (): Promise<void> => {
      await fetch(`${API_BASE_URL}/cart/clear`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
    },
  },

  // Wishlist
  wishlist: {
    get: async (): Promise<WishlistItem[]> => {
      const res = await fetch(`${API_BASE_URL}/wishlist`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      return res.json();
    },

    toggle: async (productId: number): Promise<WishlistItem[]> => {
      const res = await fetch(`${API_BASE_URL}/wishlist/toggle/${productId}`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to update wishlist');
      return res.json();
    },

    remove: async (itemId: number): Promise<WishlistItem[]> => {
      const res = await fetch(`${API_BASE_URL}/wishlist/item/${itemId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to remove from wishlist');
      return res.json();
    },
  },

  // Orders
  orders: {
    checkout: async (orderData: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      streetAddress: string;
      city: string;
      state: string;
      zipCode: string;
      paymentMethod: string;
    }): Promise<Order> => {
      const res = await fetch(`${API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Checkout failed' }));
        throw new Error(error.message || 'Checkout failed');
      }
      return res.json();
    },

    getMyOrders: async (): Promise<Order[]> => {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    },

    getByOrderNumber: async (orderNumber: string): Promise<Order> => {
      const res = await fetch(`${API_BASE_URL}/orders/${orderNumber}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Order not found');
      return res.json();
    },
  },

  // Blogs
  blogs: {
    getAll: async (): Promise<BlogPost[]> => {
      try {
        const res = await fetch(`${API_BASE_URL}/blogs`);
        if (!res.ok) throw new Error('Failed to fetch blogs');
        return await res.json();
      } catch (e) {
        return [];
      }
    },

    getById: async (id: number): Promise<BlogPost> => {
      const res = await fetch(`${API_BASE_URL}/blogs/${id}`);
      if (!res.ok) throw new Error('Blog post not found');
      return res.json();
    },
  },

  // Contact
  contact: {
    submit: async (data: { name: string; email: string; subject: string; message: string }): Promise<{ success: boolean; message: string }> => {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to send contact inquiry');
      return res.json();
    },
  },

  // AI Chat
  ai: {
    chat: async (message: string, context?: string, currentProductId?: number) => {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ message, context, currentProductId }),
      });
      if (!res.ok) throw new Error('AI service error');
      return res.json();
    },
  },
};
