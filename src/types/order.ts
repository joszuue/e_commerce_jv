export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  unit_price: number | string;
  quantity: number;
  subtotal: number | string;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  total: number | string;
  currency: string;
  status: 'pending_payment' | 'paid' | 'cancelled' | 'processing' | string;
  items?: OrderItem[];
  order_items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateOrderPayload {
  items: {
    product_id: number;
    quantity: number;
  }[];
  notes?: string;
}
