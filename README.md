# 👟 Kicks Vault — Tienda Online de Zapatillas & Streetwear

Una plataforma de comercio electrónico moderna, rápida, responsiva e interactiva diseñada específicamente para una tienda de zapatillas deportivas y streetwear.

---

## 🚀 Características Principales

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
  - Generación de comprobante con número de pedido único y estimación de entrega.
- **Lista de Deseos (Wishlist)**:
  - Guarda tus sneakers favoritos pulsando en el corazón.
  - Transferencia directa de favoritos al carrito.
- **Diseño & Animaciones**:
  - Estilo visual moderno inspirado en Nike SNKRS y tiendas streetwear de referencia.
  - Totalmente adaptado a móviles, tablets y ordenadores (Responsive).
  - Notificaciones flotantes (Toasts) para cada acción.

---

## 💻 Cómo Abrir y Probar el Proyecto

### Opción 1: Abrir directamente en el navegador
Puedes hacer doble clic en [index.html](file:///D:/nuevaprueba/index.html) desde tu explorador de archivos y se abrirá al instante en Chrome, Edge, Firefox o Safari.

### Opción 2: Con un servidor local ligero
Si prefieres servirlo mediante un servidor web local:

**Con Node.js / npx:**
```bash
npx serve .
```

**Con Python:**
```bash
python -m http.server 3000
```
Y abre `http://localhost:3000` en tu navegador.

---

## 📁 Estructura del Proyecto

```
D:/nuevaprueba/
│
├── index.html          # Estructura principal, componentes y modales
├── css/
│   └── styles.css      # Estilos personalizados, animaciones y scrollbar
├── js/
│   ├── data.js         # Base de datos de productos y cupones válidos
│   └── app.js          # Lógica interactiva del carrito, filtros y checkout
└── README.md           # Documentación del proyecto
```
