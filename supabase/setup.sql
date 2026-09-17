-- =======================================================
-- KICKS VAULT — Supabase Database Setup & Schema
-- =======================================================

-- 1. Eliminar tablas previas si existen (en orden de dependencias)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- 2. Tabla de Zapatillas (Products)
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL, -- 'lifestyle', 'running', 'basketball', 'skate'
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  rating NUMERIC(2, 1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  badge TEXT,
  badge_type TEXT, -- 'hot', 'new', 'sale'
  image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  sizes INTEGER[] DEFAULT '{39,40,41,42,43,44,45}',
  colors TEXT[] DEFAULT '{}',
  description TEXT,
  featured BOOLEAN DEFAULT FALSE,
  release_year INTEGER DEFAULT 2024,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Cupones de Descuento (Coupons)
CREATE TABLE coupons (
  code TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'percent', 'free_shipping'
  value NUMERIC(10, 2) NOT NULL,
  label TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Pedidos (Orders)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  phone TEXT,
  payment_method TEXT NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) DEFAULT 0.00,
  shipping NUMERIC(10, 2) DEFAULT 0.00,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'preparing', -- 'preparing', 'shipped', 'delivered'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de Ítems del Pedido (Order Items)
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT,
  product_name TEXT NOT NULL,
  size INTEGER NOT NULL,
  color TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL
);

-- =======================================================
-- Políticas de Seguridad (Row Level Security - RLS)
-- =======================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Acceso de lectura público para productos y cupones
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Coupons" ON coupons FOR SELECT USING (true);

-- Permitir a los compradores insertar sus pedidos e ítems
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Orders" ON orders FOR SELECT USING (true);

CREATE POLICY "Public Insert Order Items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Order Items" ON order_items FOR SELECT USING (true);

-- =======================================================
-- Datos Iniciales (Seed Data)
-- =======================================================

-- Cupones
INSERT INTO coupons (code, type, value, label, is_active) VALUES
('SNEAKER10', 'percent', 10, '10% de descuento de bienvenida', true),
('DROPSHIP', 'free_shipping', 0, 'Envío gratis express', true),
('VIP20', 'percent', 20, '20% de descuento para miembros VIP', true);

-- Zapatillas
INSERT INTO products (name, brand, category, price, original_price, rating, reviews_count, badge, badge_type, image, gallery, sizes, colors, description, featured, release_year) VALUES
(
  'Air Jordan 1 Retro High OG',
  'Jordan',
  'lifestyle',
  189.99,
  219.99,
  4.9,
  142,
  'Más Vendido',
  'hot',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80'
  ],
  ARRAY[40, 41, 42, 43, 44, 45],
  ARRAY['Rojo / Blanco / Negro', 'Royal Blue', 'Shadow Grey'],
  'El icono indiscutible del baloncesto urbano. Confeccionada en piel premium de alta resistencia, amortiguación Air-Sole encapsulada y la silueta que revolucionó el calzado deportivo.',
  true,
  2024
),
(
  'Nike Air Max Pulse Roam',
  'Nike',
  'running',
  159.99,
  NULL,
  4.8,
  98,
  'Novedad',
  'new',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
  ],
  ARRAY[39, 40, 41, 42, 43, 44],
  ARRAY['Rojo Fuego', 'Triple Black', 'Pure White'],
  'Inspirada en la escena musical underground de Londres. Combina la legendaria unidad Air Max de máxima amortiguación con una malla técnica ultratranspirable para cualquier terreno.',
  true,
  2024
),
(
  'New Balance 550 Vintage White',
  'New Balance',
  'lifestyle',
  140.00,
  160.00,
  4.7,
  215,
  '-12%',
  'sale',
  'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80'
  ],
  ARRAY[38, 39, 40, 41, 42, 43, 44, 45],
  ARRAY['Blanco / Verde Bosque', 'Blanco / Azul Marino', 'Blanco / Gris'],
  'El renacimiento de una leyenda del baloncesto de 1989. Silueta aerodinámica de caña baja con piel perforada y detalles vintage que marcan la pauta del streetwear actual.',
  true,
  2023
),
(
  'Adidas Yeezy Boost 350 V2 Style',
  'Adidas',
  'lifestyle',
  229.99,
  260.00,
  4.9,
  310,
  'Edición Limitada',
  'hot',
  'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80'
  ],
  ARRAY[40, 41, 42, 43, 44, 45],
  ARRAY['Zebra', 'Bone White', 'Onyx Black'],
  'Tecnología de amortiguación Boost de retorno de energía infinito combinada con tejido Primeknit que envuelve el pie como un guante. Futurismo y comodidad absoluta.',
  true,
  2024
),
(
  'Nike ZoomX Vaporfly Next% 3',
  'Nike',
  'running',
  249.99,
  NULL,
  5.0,
  84,
  'Pro Running',
  'new',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
  ],
  ARRAY[40, 41, 42, 43, 44],
  ARRAY['Volt / Naranja Neón', 'Blanco / Azul Eléctrico'],
  'La zapatilla de maratón por excelencia. Placa completa de fibra de carbono Flyplate integrada en espuma ZoomX para máxima propulsión en cada zancada.',
  false,
  2024
),
(
  'Puma Suede Classic XXI',
  'Puma',
  'lifestyle',
  85.00,
  95.00,
  4.6,
  167,
  '-10%',
  'sale',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
  ],
  ARRAY[38, 39, 40, 41, 42, 43, 44],
  ARRAY['Negro / Blanco', 'Rojo Clásico', 'Verde Oliva'],
  'Un icono del hip-hop y del estilo urbano desde 1968. Empeine de ante suave, plantilla acolchada y la mítica franja Formstrip en contraste.',
  false,
  2023
),
(
  'Converse Chuck 70 High Top',
  'Converse',
  'skate',
  95.00,
  NULL,
  4.8,
  380,
  'Clásico',
  'hot',
  'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80'
  ],
  ARRAY[37, 38, 39, 40, 41, 42, 43, 44, 45],
  ARRAY['Rojo Burdeos', 'Negro Vintage', 'Pergamino'],
  'La versión premium de las zapatillas más legendarias de todos los tiempos. Lona de 340 g/m² de grosor superior, costuras reforzadas y plantilla OrthoLite de confort continuo.',
  false,
  2023
),
(
  'Nike Dunk High Retro Basketball',
  'Nike',
  'basketball',
  139.99,
  159.99,
  4.9,
  190,
  'Top Ventas',
  'hot',
  'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'
  ],
  ARRAY[40, 41, 42, 43, 44, 45, 46],
  ARRAY['Panda (Blanco/Negro)', 'Syracuse Orange', 'Midnight Navy'],
  'Nacida en la cancha en los años 80 y adoptada por la cultura skate y streetwear. Tobillo acolchado de caña alta y tracción circular en la suela para giros rápidos.',
  true,
  2024
),
(
  'Asics GEL-Kayano 14 Metallic',
  'Asics',
  'running',
  175.00,
  NULL,
  4.7,
  112,
  'Tendencia',
  'new',
  'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80'
  ],
  ARRAY[39, 40, 41, 42, 43, 44],
  ARRAY['Plata / Blanco', 'Plata / Negro', 'Crema / Dorado'],
  'Estética retro runner del año 2000 que lidera la moda actual. Tecnología GEL en talón y antepié para absorber impactos con estilo inconfundible.',
  false,
  2024
),
(
  'Vans Old Skool Skate Pro',
  'Vans',
  'skate',
  79.99,
  89.99,
  4.6,
  240,
  '-11%',
  'sale',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80'
  ],
  ARRAY[38, 39, 40, 41, 42, 43, 44, 45],
  ARRAY['Black / White', 'Checkerboard', 'Navy Blue'],
  'El clásico zapato de skate con la distintiva raya lateral Sidestripe. Refuerzos DURACAP en zonas de alto desgaste y suela waffle de goma adherente.',
  false,
  2023
),
(
  'Adidas Ultraboost Light 23',
  'Adidas',
  'running',
  199.99,
  220.00,
  4.9,
  178,
  '-9%',
  'sale',
  'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
  ],
  ARRAY[40, 41, 42, 43, 44, 45],
  ARRAY['Core Black', 'Cloud White', 'Lucid Cyan'],
  'Un 30% más ligera que las generaciones anteriores de Ultraboost. Cientos de cápsulas Boost que desatan energía explosiva en cada paso con suela Continental™.',
  false,
  2024
),
(
  'Nike Air Force 1 ''07 LV8',
  'Nike',
  'lifestyle',
  129.99,
  NULL,
  4.9,
  512,
  'Esencial',
  'hot',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
  ],
  ARRAY[38, 39, 40, 41, 42, 43, 44, 45, 46],
  ARRAY['Blanco Puro / Suela Goma', 'Triple White', 'Negro Mate'],
  'El resplandor perdura en las zapatillas de básquetbol por excelencia. Combinando la comodidad de la cancha con el brillo fuera de ella en un diseño atemporal.',
  true,
  2024
);
