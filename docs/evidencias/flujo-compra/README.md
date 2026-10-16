# Evidencia del Flujo Completo de Compra

Este documento describe la arquitectura y el flujo extremo a extremo verificado en la aplicación web.

---

## 1. Etapas del Flujo

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Navegador / Usuario
    participant FE as Next.js 16 (Frontend)
    participant RH as Route Handler (/api/auth)
    participant BE as Laravel 12 API
    participant DB as MySQL (ecommerce_api)
    participant Stripe as Stripe Gateway

    %% Catálogo
    Cliente->>FE: GET /catalogo
    FE->>BE: GET /api/v1/products
    BE->>DB: SELECT * FROM products WHERE is_active=1
    DB-->>BE: Lista de productos
    BE-->>FE: JSON con productos
    FE-->>Cliente: Catálogo renderizado (Server Component)

    %% Carrito
    Cliente->>FE: Agrega productos al Carrito
    Note over Cliente,FE: Persistencia local en localStorage (sin errores de hidratación)

    %% Autenticación con Route Handler
    Cliente->>FE: POST /login (Server Action)
    FE->>BE: POST /api/v1/auth/login
    BE-->>FE: Token Sanctum + Datos de Usuario
    Note over FE: Genera ticket efímero UUID de un solo uso (TTL: 30s) en servidor
    FE-->>Cliente: Redirige a /api/auth/set-cookie?ticket=UUID
    Cliente->>RH: GET /api/auth/set-cookie?ticket=UUID
    Note over RH: Consume ticket una sola vez y emite Set-Cookie httpOnly
    RH-->>Cliente: HTTP 303 Redirect a /checkout con cookie segura

    %% Creación de Orden
    Cliente->>FE: POST /checkout (createOrderAction)
    Note over FE: Valida sesión mediante httpOnly cookie en el servidor
    FE->>BE: POST /api/v1/orders (con Idempotency-Key)
    BE->>DB: Inserta orden e ítems con precios validados en servidor
    DB-->>BE: Orden creada
    BE-->>FE: Datos de la orden (No. de orden, total)

    %% Stripe Payment Intents
    FE->>BE: POST /api/v1/orders/{id}/payment-intent
    BE->>Stripe: Crear PaymentIntent
    Stripe-->>BE: client_secret
    BE-->>FE: client_secret
    FE-->>Cliente: Monta Stripe Elements (PaymentElement)
    Cliente->>Stripe: Autoriza pago de prueba con 3D Secure
    Stripe-->>Cliente: Confirmación de pago

    %% Verificación en Backend
    Cliente->>FE: GET /confirmacion/{id}
    FE->>BE: GET /api/v1/orders/{id}
    Note over FE: Verifica que order.user_id coincida con la sesión
    BE-->>FE: Estado verificado de la orden (paid)
    FE-->>Cliente: Comprobante oficial y vaciado de carrito

    %% Historial
    Cliente->>FE: GET /mis-compras
    FE->>BE: GET /api/v1/orders
    BE-->>FE: Lista de órdenes del usuario
    FE-->>Cliente: Historial renderizado con comprobantes
```

---

## 2. Puntos Críticos de Seguridad Implementados

1. **Tokens estrictamente en el Servidor**:
   - El token de Laravel Sanctum nunca se escribe en el HTML, URLs, `localStorage` ni `sessionStorage`.
   - Se transporta hacia el navegador exclusivamente a través de una cookie con flags `httpOnly`, `secure` (en producción), `sameSite: 'lax'` y `path: '/'`.
2. **Mecanismo de Intercambio Efímero de un Solo Uso**:
   - La Server Action autentica contra Laravel y deposita el token en `TokenVault` con un ticket criptográfico temporal (TTL: 30 segundos).
   - El Route Handler consume el ticket exactamente una vez (`vault.delete(ticket)` inmediato). Si se reintenta, es rechazado.
3. **Validación de Propiedad en el Servidor**:
   - `/checkout`, `/mis-compras` y `/confirmacion/[id]` validan obligatoriamente la identidad del usuario y pertenencia de la orden mediante Server Components y Server Actions antes de renderizar datos o emitir comprobantes.
