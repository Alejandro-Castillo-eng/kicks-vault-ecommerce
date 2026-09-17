// Catálogo de zapatillas de la tienda
const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Air Jordan 1 Retro High OG",
    brand: "Jordan",
    category: "lifestyle",
    price: 189.99,
    originalPrice: 219.99,
    rating: 4.9,
    reviewsCount: 142,
    badge: "Más Vendido",
    badgeType: "hot", // hot, new, sale
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Rojo / Blanco / Negro", "Royal Blue", "Shadow Grey"],
    description: "El icono indiscutible del baloncesto urbano. Confeccionada en piel premium de alta resistencia, amortiguación Air-Sole encapsulada y la silueta que revolucionó el calzado deportivo.",
    featured: true,
    releaseYear: 2024
  },
  {
    id: 2,
    name: "Nike Air Max Pulse Roam",
    brand: "Nike",
    category: "running",
    price: 159.99,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 98,
    badge: "Novedad",
    badgeType: "new",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    colors: ["Rojo Fuego", "Triple Black", "Pure White"],
    description: "Inspirada en la escena musical underground de Londres. Combina la legendaria unidad Air Max de máxima amortiguación con una malla técnica ultratranspirable para cualquier terreno.",
    featured: true,
    releaseYear: 2024
  },
  {
    id: 3,
    name: "New Balance 550 Vintage White",
    brand: "New Balance",
    category: "lifestyle",
    price: 140.00,
    originalPrice: 160.00,
    rating: 4.7,
    reviewsCount: 215,
    badge: "-12%",
    badgeType: "sale",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    colors: ["Blanco / Verde Bosque", "Blanco / Azul Marino", "Blanco / Gris"],
    description: "El renacimiento de una leyenda del baloncesto de 1989. Silueta aerodinámica de caña baja con piel perforada y detalles vintage que marcan la pauta del streetwear actual.",
    featured: true,
    releaseYear: 2023
  },
  {
    id: 4,
    name: "Adidas Yeezy Boost 350 V2 Style",
    brand: "Adidas",
    category: "lifestyle",
    price: 229.99,
    originalPrice: 260.00,
    rating: 4.9,
    reviewsCount: 310,
    badge: "Edición Limitada",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Zebra", "Bone White", "Onyx Black"],
    description: "Tecnología de amortiguación Boost de retorno de energía infinito combinada con tejido Primeknit que envuelve el pie como un guante. Futurismo y comodidad absoluta.",
    featured: true,
    releaseYear: 2024
  },
  {
    id: 5,
    name: "Nike ZoomX Vaporfly Next% 3",
    brand: "Nike",
    category: "running",
    price: 249.99,
    originalPrice: null,
    rating: 5.0,
    reviewsCount: 84,
    badge: "Pro Running",
    badgeType: "new",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [40, 41, 42, 43, 44],
    colors: ["Volt / Naranja Neón", "Blanco / Azul Eléctrico"],
    description: "La zapatilla de maratón por excelencia. Placa completa de fibra de carbono Flyplate integrada en espuma ZoomX para máxima propulsión en cada zancada.",
    featured: false,
    releaseYear: 2024
  },
  {
    id: 6,
    name: "Puma Suede Classic XXI",
    brand: "Puma",
    category: "lifestyle",
    price: 85.00,
    originalPrice: 95.00,
    rating: 4.6,
    reviewsCount: 167,
    badge: "-10%",
    badgeType: "sale",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    colors: ["Negro / Blanco", "Rojo Clásico", "Verde Oliva"],
    description: "Un icono del hip-hop y del estilo urbano desde 1968. Empeine de ante suave, plantilla acolchada y la mítica franja Formstrip en contraste.",
    featured: false,
    releaseYear: 2023
  },
  {
    id: 7,
    name: "Converse Chuck 70 High Top",
    brand: "Converse",
    category: "skate",
    price: 95.00,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 380,
    badge: "Clásico",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45],
    colors: ["Rojo Burdeos", "Negro Vintage", "Pergamino"],
    description: "La versión premium de las zapatillas más legendarias de todos los tiempos. Lona de 340 g/m² de grosor superior, costuras reforzadas y plantilla OrthoLite de confort continuo.",
    featured: false,
    releaseYear: 2023
  },
  {
    id: 8,
    name: "Nike Dunk High Retro Basketball",
    brand: "Nike",
    category: "basketball",
    price: 139.99,
    originalPrice: 159.99,
    rating: 4.9,
    reviewsCount: 190,
    badge: "Top Ventas",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [40, 41, 42, 43, 44, 45, 46],
    colors: ["Panda (Blanco/Negro)", "Syracuse Orange", "Midnight Navy"],
    description: "Nacida en la cancha en los años 80 y adoptada por la cultura skate y streetwear. Tobillo acolchado de caña alta y tracción circular en la suela para giros rápidos.",
    featured: true,
    releaseYear: 2024
  },
  {
    id: 9,
    name: "Asics GEL-Kayano 14 Metallic",
    brand: "Asics",
    category: "running",
    price: 175.00,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 112,
    badge: "Tendencia",
    badgeType: "new",
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    colors: ["Plata / Blanco", "Plata / Negro", "Crema / Dorado"],
    description: "Estética retro runner del año 2000 que lidera la moda actual. Tecnología GEL en talón y antepié para absorber impactos con estilo inconfundible.",
    featured: false,
    releaseYear: 2024
  },
  {
    id: 10,
    name: "Vans Old Skool Skate Pro",
    brand: "Vans",
    category: "skate",
    price: 79.99,
    originalPrice: 89.99,
    rating: 4.6,
    reviewsCount: 240,
    badge: "-11%",
    badgeType: "sale",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    colors: ["Black / White", "Checkerboard", "Navy Blue"],
    description: "El clásico zapato de skate con la distintiva raya lateral Sidestripe. Refuerzos DURACAP en zonas de alto desgaste y suela waffle de goma adherente.",
    featured: false,
    releaseYear: 2023
  },
  {
    id: 11,
    name: "Adidas Ultraboost Light 23",
    brand: "Adidas",
    category: "running",
    price: 199.99,
    originalPrice: 220.00,
    rating: 4.9,
    reviewsCount: 178,
    badge: "-9%",
    badgeType: "sale",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ["Core Black", "Cloud White", "Lucid Cyan"],
    description: "Un 30% más ligera que las generaciones anteriores de Ultraboost. Cientos de cápsulas Boost que desatan energía explosiva en cada paso con suela Continental™.",
    featured: false,
    releaseYear: 2024
  },
  {
    id: 12,
    name: "Nike Air Force 1 '07 LV8",
    brand: "Nike",
    category: "lifestyle",
    price: 129.99,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 512,
    badge: "Esencial",
    badgeType: "hot",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    colors: ["Blanco Puro / Suela Goma", "Triple White", "Negro Mate"],
    description: "El resplandor perdura en las zapatillas de básquetbol por excelencia. Combinando la comodidad de la cancha con el brillo fuera de ella en un diseño atemporal.",
    featured: true,
    releaseYear: 2024
  }
];

// Cupones de descuento válidos
const DISCOUNT_COUPONS = {
  "SNEAKER10": { type: "percent", value: 10, label: "10% de descuento de bienvenida" },
  "DROPSHIP": { type: "free_shipping", value: 0, label: "Envío gratis express" },
  "VIP20": { type: "percent", value: 20, label: "20% de descuento para miembros VIP" }
};
