# Documentación de la API Laravel 12 & Swagger/OpenAPI

## 1. Localización y Diagnóstico

- **Motor Backend**: Laravel 12 (PHP 8.3 / 8.4)
- **Base de Datos**: `ecommerce_api` en MySQL (`localhost:3306`)
- **Documentación Swagger / OpenAPI**: `/api/documentation` o `/docs/api-docs.json` (L5-Swagger)
- **Base URL**: `http://localhost:8000/api/v1`

---

## 2. Matriz de Endpoints Reales Identificados

| Método | Endpoint | Funcionalidad | Autenticación | Cuerpos / Parámetros | Respuesta Exitosa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Inicio de sesión | Pública | `{ email, password }` | `200 OK` `{ token, user }` |
| `POST` | `/api/v1/auth/register` | Registro de clientes | Pública | `{ name, email, password, password_confirmation }` | `201 Created` `{ message, user, token? }` |
| `GET` | `/api/v1/auth/me` | Perfil del usuario | Bearer Token (Sanctum) | Ninguno | `200 OK` `{ user }` |
| `POST` | `/api/v1/auth/logout` | Revocación de token | Bearer Token (Sanctum) | Ninguno | `200 OK` `{ message }` |
| `GET` | `/api/v1/products` | Catálogo público | Pública | Query opcional: `page`, `per_page` | `200 OK` `Product[]` o `{ data: [...] }` |
| `GET` | `/api/v1/products/{id}` | Detalle de producto | Pública | Parámetro URL: `id` | `200 OK` `{ data: Product }` |
| `POST` | `/api/v1/orders` | Crear orden de compra | Bearer Token (Sanctum) | `{ items: [{ product_id, quantity }] }` | `201 Created` `{ order }` |
| `POST` | `/api/v1/orders/{id}/payment-intent` | Iniciar pago Stripe | Bearer Token (Sanctum) | Ninguno o `{ order_id }` | `200 OK` `{ client_secret, payment_intent_id }` |
| `GET` | `/api/v1/orders` | Historial de compras | Bearer Token (Sanctum) | Ninguno | `200 OK` `Order[]` |
| `GET` | `/api/v1/orders/{id}` | Comprobante de orden | Bearer Token (Sanctum) | Parámetro URL: `id` | `200 OK` `{ order }` |

---

## 3. Esquemas Reales de Base de Datos (`ecommerce_api`)

- **`products`**: `id`, `name`, `description`, `sku`, `price` (decimal 10,2), `stock` (int unsigned), `is_active` (bool), `deleted_at`.
- **`users`**: `id`, `name`, `email`, `password`, `role` ('customer'|'admin').
- **`orders`**: `id`, `user_id`, `order_number` (unique), `total` (decimal 10,2), `currency` ('usd'), `status` ('pending_payment'|'paid'|'cancelled').
- **`order_items`**: `id`, `order_id`, `product_id`, `product_name`, `product_sku`, `unit_price`, `quantity`, `subtotal`.
- **`payments`**: `id`, `order_id`, `stripe_payment_intent_id`, `stripe_event_id`, `amount`, `currency`, `status`, `metadata`.
