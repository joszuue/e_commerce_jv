import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { LoginForm } from '@/components/auth/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión',
  description: 'Inicia sesión en tu cuenta de TechShop para gestionar compras y pedidos.',
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/catalogo');
  }

  return (
    <div className="py-8 sm:py-16 flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
