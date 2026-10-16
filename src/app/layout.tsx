import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { CartProvider } from '@/components/providers/CartProvider';

export const metadata: Metadata = {
  title: {
    default: 'TechShop | E-Commerce Oficial',
    template: '%s | TechShop',
  },
  description:
    'Tienda en línea de productos tecnológicos de alto rendimiento, desarrollada con Next.js 16, Laravel 12 API y Stripe.',
  keywords: ['ecommerce', 'next.js', 'laravel', 'stripe', 'tecnologia', 'perifericos'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        <CartProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
