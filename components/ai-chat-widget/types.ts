export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  contacts?: ContactInfo;
  products?: Product[];
  orders?: OrderCard[];
}

export interface ContactInfo {
  phones: string[];
  emails: string[];
  addresses: string[];
}

export interface OrderCard {
  orderNumber: string;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | string;
  total: number;
  createdAt: string;
  items: { productName: string; quantity: number }[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  inStock: boolean;
  images: string[];
}
