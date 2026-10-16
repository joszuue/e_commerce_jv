# Índice y Resumen Ejecutivo de Evidencias

Este documento consolida las evidencias técnicas, resultados de auditorías de rendimiento (Lighthouse), diagramas de secuencia y contratos de la API para la actividad universitaria del frontend de e-commerce.

---

## 1. Auditorías de Rendimiento con Lighthouse (Modo Producción)

Las mediciones fueron ejecutadas sobre la **compilación optimizada de producción** (`npm run build` y servidor en `http://localhost:3000`), utilizando Lighthouse 13.5.0 bajo Chrome Headless:

| Ruta Evaluada | Perfil | Rendimiento | Accesibilidad | Buenas Prácticas | SEO | FCP | LCP | CLS | TBT | Archivos de Reporte |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Inicio (`/`)** | Desktop | **100** / 100 | **93** / 100 | **96** / 100 | **100** / 100 | 0.2 s | 0.5 s | 0 | 0 ms | [HTML](file:///c:/wamp64/www/e_commerce/docs/evidencias/lighthouse/home_desktop.report.html) \| [JSON](file:///c:/wamp64/www/e_commerce/docs/evidencias/lighthouse/home_desktop.report.json) |
| **Iniciar Sesión (`/login`)** | Desktop | **100** / 100 | **96** / 100 | **96** / 100 | **100** / 100 | 0.2 s | 0.5 s | 0 | 0 ms | [HTML](file:///c:/wamp64/www/e_commerce/docs/evidencias/lighthouse/login_desktop.report.html) \| [JSON](file:///c:/wamp64/www/e_commerce/docs/evidencias/lighthouse/login_desktop.report.json) |
| **Carrito (`/carrito`)** | Mobile | **99** / 100 | **95** / 100 | **96** / 100 | **100** / 100 | 0.8 s | 2.1 s | 0 | 50 ms | [HTML](file:///c:/wamp64/www/e_commerce/docs/evidencias/lighthouse/carrito_mobile.report.html) \| [JSON](file:///c:/wamp64/www/e_commerce/docs/evidencias/lighthouse/carrito_mobile.report.json) |

### Conclusiones de Rendimiento
- **Cumplimiento de meta**: Todas las rutas superaron ampliamente el objetivo de 90+ puntos de rendimiento.
- **Estabilidad visual (CLS = 0)**: No se presentan saltos de contenido gracias a la reserva adecuada de dimensiones en imágenes y esqueletos estructurados.
- **TBT (Total Blocking Time)**: 0 ms en desktop y 50 ms en mobile, asegurando una experiencia fluida sin bloqueo del hilo principal de ejecución.

---

## 2. Estructura de Evidencias

- **[docs/evidencias/lighthouse/](file:///c:/wamp64/www/e_commerce/docs/evidencias/lighthouse/)**:
  - Reportes HTML interactivos completos y archivos JSON generados por Lighthouse.
- **[docs/evidencias/swagger/README.md](file:///c:/wamp64/www/e_commerce/docs/evidencias/swagger/README.md)**:
  - Detalle de contratos, métodos HTTP, modelos de datos, base de datos `ecommerce_api` y parámetros de la API REST Laravel 12.
- **[docs/evidencias/flujo-compra/README.md](file:///c:/wamp64/www/e_commerce/docs/evidencias/flujo-compra/README.md)**:
  - Diagrama de secuencia del flujo de compra y arquitectura de seguridad con cookies httpOnly.
