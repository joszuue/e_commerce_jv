import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { CheckoutClient } from '@/components/checkout/CheckoutClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finalizar Compra',
  description: 'Pasa por caja y completa tu orden de compra de forma segura con Stripe.',
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  // Strict server-side route protection
  if (!user) {
    redirect('/login?next=/checkout');
  }

  return <CheckoutClient user={user} />;
}
