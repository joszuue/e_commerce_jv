import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { RegisterForm } from '@/components/auth/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Cuenta',
  description: 'Regístrate en TechShop para comprar los mejores periféricos de computación.',
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/catalogo');
  }

  return (
    <div className="py-8 sm:py-16 flex items-center justify-center">
      <RegisterForm />
    </div>
  );
}
