export interface Payment {
  id: number;
  order_id: number;
  stripe_payment_intent_id: string;
  stripe_event_id?: string | null;
  amount: number | string;
  currency: string;
  status: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentIntentResponse {
  client_secret?: string;
  clientSecret?: string;
  payment_intent_id?: string;
  order_id: number;
  amount?: number | string;
  currency?: string;
}
