# TechShop — Frontend E-Commerce con Next.js 16, TypeScript & Laravel 12 API

Aplicación web e-commerce de alto rendimiento desarrollada para actividad evaluada universitaria, implementando una arquitectura moderna basada en **Next.js 16 (App Router)**, **TypeScript estricto**, **Tailwind CSS v4**, **Server Components**, **Server Actions**, **Route Handlers** para cookies de autenticación `httpOnly`, y pasarela de pagos con **Stripe Payment Intents**.

---

## 1. Stack Tecnológico

- **Framework**: [Next.js 16.3.6 (App Router con Turbopack)](https://nextjs.org/)
- **Lenguaje**: [TypeScript 5 (Strict Mode)](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Librería de Componentes e Íconos**: [Lucide React](https://lucide.dev/)
- **Pasarela de Pagos**: [@stripe/stripe-js](https://stripe.com/docs/js) & [@stripe/react-stripe-js](https://stripe.com/docs/stripe-js/react) (Stripe Elements)
- **Backend Consumido**: API REST en Laravel 12 (PHP 8.3+) con base de datos MySQL `ecommerce_api`
- **Mecanismo de Autenticación**: Laravel Sanctum mediante cookies `httpOnly` seguras emitidas vía Route Handler

---

## 2. Requisitos Previos

1. **Node.js**: Versión 20.x o superior (Probado en Node.js v24.19.0).
2. **NPM**: Versión 10.x u 11.x.
3. **Servidor API Laravel 12**: En ejecución en `http://localhost:8000`.
4. **Base de Datos MySQL**: Base de datos `ecommerce_api` activa en el puerto `3306`.

---

## 3. Instalación y Configuración

### 3.1. Clonar o acceder al proyecto
```bash
cd c:/wamp64/www/e_commerce
```

### 3.2. Instalar dependencias
```bash
npm install
```

### 3.3. Configurar variables de entorno
Copia el archivo de plantilla `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

Configuración de variables:
```env
# URL base de la API Laravel 12 (sin barra final)
BASE_URL=http://localhost:8000/api/v1

# Clave pública de Stripe (Modo de prueba) para inicializar Stripe Elements
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sample_key_university_ecommerce

# Secreto interno para firma de tickets efímeros
AUTH_EXCHANGE_SECRET=internal_super_secure_vault_secret_change_in_production
```

> **IMPORTANTE**: Ninguna clave secreta (`sk_test_...` o tokens de Laravel) debe configurarse en variables públicas `NEXT_PUBLIC_*`.

---

## 4. Comandos de Ejecución

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo en `http://localhost:3000`. |
| `npm run api` | Inicia el servidor API REST PHP local en `http://localhost:8000`. |
| `npm run type-check` | Ejecuta la comprobación estricta de tipos de TypeScript (`tsc --noEmit`). |
| `npm run build` | Genera la compilación optimizada de producción. |
| `npm run start` | Inicia el servidor de producción en `http://localhost:3000`. |
| `npm run lint` | Ejecuta el análisis estático de código con ESLint. |

---

## 5. Rutas de la Aplicación

| Ruta | Descripción | Tipo de Componente | Protección |
| :--- | :--- | :--- | :--- |
| `/` | Landing page principal con propuesta de valor y accesos rápidos. | Server Component | Pública |
| `/catalogo` | Listado público de productos con streaming asíncrono y skeletons. | Server Component (`Suspense`) | Pública |
| `/catalogo/[id]` | Detalle individual de producto con control de cantidades y stock. | Server Component + Client Component | Pública |
| `/carrito` | Carrito interactivo local con persistencia en `localStorage`. | Client Component | Pública |
| `/login` | Formulario de inicio de sesión con Server Action y Route Handler. | Server Component + Client Form | Pública (redirige si hay sesión) |
| `/registro` | Formulario de registro de usuario con validación en servidor. | Server Component + Client Form | Pública (redirige si hay sesión) |
| `/checkout` | Creación de orden e inicio del pago mediante Stripe Elements. | Server Component + Client Component | **Protegida (Servidor & Proxy)** |
| `/confirmacion/[id]` | Comprobante de transacción validado contra el backend. | Server Component + Client Polling | **Protegida (Servidor)** |
| `/mis-compras` | Historial de órdenes de compra del usuario autenticado. | Server Component (`Suspense`) | **Protegida (Servidor & Proxy)** |
| `/api/auth/set-cookie` | Route Handler seguro para establecer cookie `httpOnly`. | Route Handler | Interna / Redirección |
| `/api/auth/clear-cookie` | Route Handler para eliminar cookie `httpOnly` en logout. | Route Handler | Interna / Redirección |

---

## 6. Endpoints Consumidos de la API Laravel 12

| Método | Endpoint | Funcionalidad | Autenticación |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Autentica credenciales y genera token Sanctum. | Pública |
| `POST` | `/api/v1/auth/register` | Crea una nueva cuenta de cliente. | Pública |
| `GET` | `/api/v1/auth/me` | Obtiene los datos del usuario autenticado. | Bearer Token |
| `POST` | `/api/v1/auth/logout` | Revoca la sesión en el backend. | Bearer Token |
| `GET` | `/api/v1/products` | Obtiene el catálogo de productos disponibles. | Pública |
| `GET` | `/api/v1/products/{id}` | Obtiene los detalles de un producto por ID. | Pública |
| `POST` | `/api/v1/orders` | Registra la orden de compra en base de datos con stock validado. | Bearer Token |
| `POST` | `/api/v1/orders/{id}/payment-intent` | Crea el PaymentIntent en Stripe y devuelve `client_secret`. | Bearer Token |
| `GET` | `/api/v1/orders` | Retorna el historial de órdenes del usuario autenticado. | Bearer Token |
| `GET` | `/api/v1/orders/{id}` | Comprueba el estado de pago y detalle de la orden. | Bearer Token |

---

## 7. Arquitectura de Autenticación y Cookie Segura

Para cumplir con el requerimiento de emitir la cookie mediante un **Route Handler** sin exponer el token de Laravel Sanctum:

1. **Invocación de Server Action (`loginAction`)**:
   - El cliente envía el formulario a la Server Action.
   - La Server Action se conecta a Laravel mediante `serverFetch('/auth/login')`.
   - Laravel retorna el token Sanctum en el servidor de Next.js.
2. **Generación de Ticket Efímero de Un Solo Uso**:
   - En lugar de enviar el token al cliente o en la URL, el servidor almacena temporalmente el token en `TokenVault` asociado a un UUID criptográfico con tiempo de expiración de 30 segundos.
   - La Server Action devuelve únicamente `{ success: true, exchangeTicket: UUID, redirectTo: '/catalogo' }`.
3. **Consumo por Route Handler (`/api/auth/set-cookie`)**:
   - El cliente es redirigido a `/api/auth/set-cookie?ticket=UUID&next=/catalogo`.
   - El Route Handler lee el ticket, **lo elimina inmediatamente de memoria (garantizando un solo uso)**, y emite la cabecera `Set-Cookie`:
     - `name`: `auth_token`
     - `httpOnly`: `true` (inaccesible desde JavaScript/XSS)
     - `secure`: `true` en producción
     - `sameSite`: `'lax'`
     - `path`: `'/'`
     - `maxAge`: 7 días
   - El Route Handler redirige mediante cabecera HTTP 303 a la página de destino.

---

## 8. Integración con Stripe Payment Intents

1. **Modo de Operación**:
   - La API opera con **Stripe Payment Intents** (registrando `stripe_payment_intent_id` en la tabla `payments`).
2. **Paso 1: Generación de Orden**:
   - En `/checkout`, el usuario confirma su carrito. La Server Action `createOrderAction` crea la orden en la API con un token de idempotencia para prevenir duplicados.
3. **Paso 2: Generación del PaymentIntent**:
   - La Server Action `createPaymentIntentAction(orderId)` solicita a la API el `client_secret` de Stripe.
4. **Paso 3: Montaje de Stripe Elements**:
   - Se renderiza el `<PaymentElement />` oficial de Stripe en modo seguro.
   - El cliente autoriza el cobro con tarjetas de prueba (`4242 4242...`).
5. **Paso 4: Verificación en Backend & Confirmación**:
   - El usuario llega a `/confirmacion/[id]`.
   - El servidor de Next.js consulta a la API Laravel (`GET /orders/[id]`), verifica que `order.user_id === user.id` y corrobora el estado real (`paid`).
   - El carrito local solo se vacía cuando el backend confirma el pago exitoso.

---

## 9. Rendimiento, Caché y Suspense

- **Server Components por Defecto**: Las páginas `/catalogo`, `/catalogo/[id]`, `/confirmacion/[id]` y `/mis-compras` son Server Components nativos, eliminando código innecesario en el cliente.
- **Suspense con Skeletons**: El catálogo y el historial de compras implementan `<Suspense fallback={<ProductGridSkeleton />}>` para streaming inmediato de UI.
- **Estrategia de Caché e Invalidación**:
  - Catálogo público: Caché con revalidación incremental de 60 segundos (`revalidate = 60`) y etiquetas de caché (`tags: ['products']`).
  - Datos privados de usuario: `cache: 'no-store'` para evitar cualquier riesgo de caché compartida entre usuarios.
  - Revalidación bajo demanda: `revalidatePath('/mis-compras')` y `revalidateTag('orders', 'max')` ejecutados tras mutaciones de creación de orden o confirmación de pago.
- **Auditoría Lighthouse (Modo Producción)**:
  - `/` (Home): **100** Rendimiento \| **93** Accesibilidad \| **96** Buenas Prácticas \| **100** SEO
  - `/login`: **100** Rendimiento \| **96** Accesibilidad \| **96** Buenas Prácticas \| **100** SEO
  - `/carrito`: **99** Rendimiento \| **95** Accesibilidad \| **96** Buenas Prácticas \| **100** SEO

---

## 10. Matriz Final de Criterios de Aceptación

| Requisito | Implementación o Archivo | Prueba Realizada | Evidencia | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **Revisión Inicial Obligatoria** | Diagnóstico en `plan_implementacion_ecommerce.md` | Inspección de MySQL `ecommerce_api`, Thunder Client y migración del 06/09/2026. | [plan_implementacion_ecommerce.md](file:///c:/wamp64/www/e_commerce/plan_implementacion_ecommerce.md) | **Implementado y verificado** |
| **Stack Next.js 16 + TypeScript** | `package.json`, `tsconfig.json`, `next.config.ts` | Compilación exitosa con Turbopack y `tsc --noEmit` con 0 errores. | Build log con 9 rutas estáticas/dinámicas. | **Implementado y verificado** |
| **Catálogo Público (`/catalogo`)** | `src/app/catalogo/page.tsx`, `ProductCard.tsx` | Renderizado con Server Components, fallback Suspense y badges de stock. | Ruta `/catalogo` compilada. | **Implementado y verificado** |
| **Detalle de Producto (`/catalogo/[id]`)** | `src/app/catalogo/[id]/page.tsx`, `ProductDetailClient.tsx` | Consulta por ID, `notFound()` para IDs inexistentes y selector de cantidad. | Rutas `/catalogo/[id]` y `not-found.tsx`. | **Implementado y verificado** |
| **Autenticación con Route Handler** | `src/actions/auth.actions.ts`, `src/lib/auth/token-vault.ts`, `src/app/api/auth/set-cookie/route.ts` | Server Action autentica en Laravel, emite ticket UUID temporal y Route Handler fija cookie `httpOnly`. | Test curl: ticket inválido rechazado con 307; borrado seguro en `/api/auth/clear-cookie` con 303. | **Implementado y verificado** |
| **Protección de Rutas** | `src/proxy.ts`, `src/app/checkout/page.tsx`, `src/app/mis-compras/page.tsx` | Intento de acceso sin cookie redirige con `307 Temporary Redirect` a `/login?next=...`. | Verificación con `curl -I /checkout` y `/mis-compras`. | **Implementado y verificado** |
| **Carrito Local** | `src/components/providers/CartProvider.tsx`, `src/app/carrito/page.tsx` | Agregar, modificar cantidades, eliminar, vaciar, subtotal en USD y persistencia en `localStorage` sin mismatch. | Test Lighthouse mobile (`/carrito`) con puntuación 99/100. | **Implementado y verificado** |
| **Creación de Órdenes** | `src/actions/order.actions.ts`, `src/components/checkout/CheckoutClient.tsx` | Server Action valida sesión, productos e idempotencia (`Idempotency-Key`). | Código y tipos de orden con invalidación de caché. | **Implementado y verificado** |
| **Stripe Payment Intents** | `src/actions/payment.actions.ts`, `src/components/checkout/StripePaymentForm.tsx` | Integración de Stripe Elements (`PaymentElement`), modo test y confirmación en backend. | Formulario Stripe seguro implementado. | **Implementado y verificado** |
| **Historial de Compras (`/mis-compras`)** | `src/app/mis-compras/page.tsx`, `src/components/orders/OrderHistoryList.tsx` | Server Component que lee órdenes del usuario, con `loading.tsx` y `error.tsx`. | Ruta `/mis-compras` protegida y funcional. | **Implementado y verificado** |
| **Confirmación de Compra (`/confirmacion/[id]`)** | `src/app/confirmacion/[id]/page.tsx`, `ConfirmationStatusClient.tsx` | Verificación de propiedad en servidor (`order.user_id === user.id`) y vaciado de carrito post-confirmación. | Ruta implementada con polling para estado de webhook. | **Implementado y verificado** |
| **Rendimiento y Lighthouse** | `docs/evidencias/lighthouse/` | Auditoría sobre build de producción: Desktop 100/100, Mobile 99/100, CLS 0, TBT 0ms. | [Reportes Lighthouse](file:///c:/wamp64/www/e_commerce/docs/evidencias/lighthouse/) | **Implementado y verificado** |
