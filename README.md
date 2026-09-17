# 👟 Kicks Vault — Tienda Online de Zapatillas & Streetwear

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Alejandro-Castillo-eng/kicks-vault-ecommerce)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Alejandro-Castillo-eng/kicks-vault-ecommerce)
[![Supabase Ready](https://img.shields.io/badge/Supabase-Database%20Ready-3ECF8E?logo=supabase)](https://supabase.com)

Una plataforma de comercio electrónico moderna, rápida, responsiva e interactiva diseñada específicamente para una tienda de zapatillas deportivas y streetwear con integración lista para **Supabase** y despliegue en **Vercel**.

---

## 🔗 Repositorio y Despliegue

- **Repositorio en GitHub**: [https://github.com/Alejandro-Castillo-eng/kicks-vault-ecommerce](https://github.com/Alejandro-Castillo-eng/kicks-vault-ecommerce)
- **Despliegue directo en Vercel (1 Clic)**: [Desplegar en Vercel con un clic](https://vercel.com/new/clone?repository-url=https://github.com/Alejandro-Castillo-eng/kicks-vault-ecommerce)

---

## 🗄️ Base de Datos en Supabase

El archivo de configuración y esquema de la base de datos se encuentra en [`supabase/setup.sql`](supabase/setup.sql).

### Pasos para configurar tu base de datos en Supabase:

1. Ve a [Supabase.com](https://supabase.com) e inicia sesión (puedes entrar con tu cuenta de GitHub).
2. Crea un nuevo proyecto llamado **kicks-vault**.
3. En el menú lateral izquierdo, haz clic en **SQL Editor**.
4. Abre el archivo [`supabase/setup.sql`](supabase/setup.sql), copia todo su contenido y pégalo en el editor SQL de Supabase.
5. Haz clic en **Run**. ¡Se crearán automáticamente las tablas (`products`, `coupons`, `orders`, `order_items`), las políticas de seguridad (RLS) y se insertarán las 12 zapatillas iniciales!

### Conectar la web con Supabase:
En tu proyecto de Supabase ve a **Project Settings** > **API** y copia:
- **Project URL**
- **Anon Public API Key**

Puedes agregarlos a tu `.env` o en la consola del navegador:
```javascript
localStorage.setItem('supabase_url', 'https://TU_PROYECTO.supabase.co');
localStorage.setItem('supabase_anon_key', 'TU_ANON_KEY');
```
*Nota: Si no configuras las credenciales, la tienda funciona al 100% de manera automática utilizando el catálogo y simulación local integrada en `js/data.js`.*

---

## 🚀 Despliegue en Vercel

### Opción A (Recomendada - Conexión con GitHub):
1. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub (`Alejandro-Castillo-eng`).
2. Haz clic en **"Add New..."** > **"Project"**.
3. Selecciona el repositorio **`kicks-vault-ecommerce`**.
4. Haz clic en **"Deploy"**.
¡En menos de 30 segundos tu tienda estará publicada en internet con dominio HTTPS gratis! Cada `git push` que hagas se desplegará automáticamente.

### Opción B (Vía Terminal CLI):
Ejecuta en tu terminal interactiva:
```bash
npx vercel
```
Inicia sesión en el navegador cuando te lo solicite y presiona Enter para confirmar las opciones por defecto.

---

## 🌟 Características Principales

- **Catálogo de Zapatillas Realista**: Siluetas de marcas top como Nike, Jordan, Adidas, New Balance, Puma, Vans y Asics con fotografías de alta calidad.
- **Buscador & Filtros Avanzados**:
  - Búsqueda en tiempo real por modelo o marca.
  - Filtro por categorías (*Lifestyle, Running, Basketball, Skate*).
  - Filtro multimarca interactivo con conteo de modelos.
  - Selector interactivo de tallas europeas (EU 38 a EU 45).
  - Slider dinámico de rango de precio.
  - Ordenamiento por: Destacados, Precio (menor/mayor), Mejor Valorados y Lanzamientos Recientes.
- **Vista Rápida / Ficha de Producto (Modal)**:
  - Galería con cambio dinámico de imágenes en miniaturas.
  - Selector de color y talla.
  - Contador de unidades (+/-).
  - Ficha técnica de materiales y descripción.
  - Botón directo de añadir al carrito.
- **Carrito de Compras Completo (Slide-over)**:
  - Persistencia en `localStorage` (no se pierden los datos al recargar).
  - Barra de progreso para **Envío Gratis** (umbral de 100€).
  - Control de cantidad y eliminación por producto.
  - Sistema de cupones de descuento activos:
    - `SNEAKER10` — 10% de descuento directo.
    - `DROPSHIP` — Envío gratis express sin mínimo.
    - `VIP20` — 20% de descuento exclusivo.
- **Pasarela de Pago Simulada (Checkout)**:
  - Formulario de dirección de envío y validación.
  - Métodos de pago: Tarjeta de crédito, PayPal, Apple Pay y Bizum.
  - Registro del pedido en la base de datos de Supabase si está conectada.
  - Generación de comprobante con número de pedido único y estimación de entrega.
- **Lista de Deseos (Wishlist)**:
  - Guarda tus sneakers favoritos pulsando en el corazón.
  - Transferencia directa de favoritos al carrito.
- **Diseño & Animaciones**:
  - Estilo visual moderno inspirado en Nike SNKRS y tiendas streetwear de referencia.
  - Totalmente adaptado a móviles, tablets y ordenadores (Responsive).
  - Notificaciones flotantes (Toasts) para cada acción.

---

## 📁 Estructura del Proyecto

```
D:/nuevaprueba/
│
├── index.html              # Estructura principal, componentes y modales
├── css/
│   └── styles.css          # Estilos personalizados, animaciones y scrollbar
├── js/
│   ├── data.js             # Base de datos local y cupones válidos
│   ├── supabase-client.js  # Capa de sincronización y cliente de Supabase
│   └── app.js              # Lógica interactiva del carrito, filtros y checkout
├── supabase/
│   └── setup.sql           # Script SQL completo de creación de tablas, RLS y datos
├── vercel.json             # Configuración de despliegue y cabeceras para Vercel
├── .gitignore              # Exclusiones de Git
├── .env.example            # Plantilla de variables de entorno
└── README.md               # Documentación del proyecto
```
