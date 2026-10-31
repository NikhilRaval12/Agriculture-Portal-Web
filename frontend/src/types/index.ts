export type DragonEmotion =
  | 'IDLE'
  | 'HAPPY'
  | 'CURIOUS'
  | 'EXCITED'
  | 'CONFUSED'
  | 'SAD'
  | 'THINKING'
  | 'SLEEPING'
  | 'CELEBRATING'
  | 'GREETING'
  | 'WORKING'
  | 'ERROR'
  | 'SUCCESS';

export type DragonPosition =
  | 'BOTTOM_RIGHT'
  | 'BOTTOM_LEFT'
  | 'TOP_RIGHT'
  | 'HERO'
  | 'FLOATING_PRODUCT'
  | 'CART_SIDE'
  | 'CHECKOUT_WAIT'
  | 'CUSTOM';

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  discountedPrice: number;
  description: string;
  availableQuantity: number;
  categoryId?: number;
  categoryName?: string;
  imageUrl: string;
  rating: number;
  vendorName: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  total: number;
  availableQuantity: number;
}

export interface CartSummary {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
}

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  discountedPrice: number;
  discount: number;
  availableQuantity: number;
  categoryName?: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  orderDetails: string;
  createdAt: string;
  items?: OrderItem[];
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
}

export interface Feedback {
  id: number;
  userId?: number;
  userName: string;
  feedback: string;
  date: string;
  rating: number;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
}

export interface AiMessage {
  id: string;
  sender: 'user' | 'dragon';
  text: string;
  emotion?: DragonEmotion;
  suggestedProducts?: Product[];
  suggestedAction?: string;
  followUpQuestions?: string[];
  timestamp: Date;
}
