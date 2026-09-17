// Estado global de la aplicación
const AppState = {
  products: [...PRODUCTS_DATA],
  filteredProducts: [...PRODUCTS_DATA],
  cart: JSON.parse(localStorage.getItem('kicks_cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('kicks_wishlist')) || [],
  appliedCoupon: JSON.parse(localStorage.getItem('kicks_coupon')) || null,
  activeFilters: {
    search: '',
    category: 'all',
    brands: [],
    maxPrice: 300,
    selectedSize: null,
    sortBy: 'featured'
  },
  currentProductModal: null,
  selectedModalSize: null,
  selectedModalColor: null,
  modalQuantity: 1
};

const FREE_SHIPPING_THRESHOLD = 100.0;
const STANDARD_SHIPPING_COST = 5.99;

// Guardar en LocalStorage
function saveCart() {
  localStorage.setItem('kicks_cart', JSON.stringify(AppState.cart));
  if (AppState.appliedCoupon) {
    localStorage.setItem('kicks_coupon', JSON.stringify(AppState.appliedCoupon));
  } else {
    localStorage.removeItem('kicks_coupon');
  }
}

function saveWishlist() {
  localStorage.setItem('kicks_wishlist', JSON.stringify(AppState.wishlist));
}

// Inicialización de la aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', async () => {
  initIcons();
  initEventListeners();

  // Cargar catálogo (desde Supabase si está configurado, o catálogo local)
  if (typeof getSupabaseProducts === 'function') {
    try {
      const liveProducts = await getSupabaseProducts();
      if (liveProducts && liveProducts.length > 0) {
        AppState.products = liveProducts;
        AppState.filteredProducts = [...liveProducts];
      }
    } catch (e) {
      console.warn("Usando catálogo local de contingencia:", e);
    }
  }

  renderProducts();
  updateCartUI();
  updateWishlistUI();
  populateBrandFilters();
});

// Re-renderizar iconos de Lucide
function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Poblar dinámicamente los checkboxes de marcas
function populateBrandFilters() {
  const brandContainer = document.getElementById('brandFilterList');
  if (!brandContainer) return;

  const brands = [...new Set(AppState.products.map(p => p.brand))].sort();
  brandContainer.innerHTML = brands.map(brand => {
    const count = AppState.products.filter(p => p.brand === brand).length;
    return `
      <label class="flex items-center justify-between text-sm text-slate-600 hover:text-slate-900 cursor-pointer py-1 group">
        <span class="flex items-center gap-2">
          <input type="checkbox" value="${brand}" class="brand-checkbox rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer transition">
          <span class="group-hover:translate-x-0.5 transition-transform">${brand}</span>
        </span>
        <span class="text-xs text-slate-400 font-mono">(${count})</span>
      </label>
    `;
  }).join('');

  // Eventos para filtros de marca
  brandContainer.querySelectorAll('.brand-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      if (e.target.checked) {
        AppState.activeFilters.brands.push(e.target.value);
      } else {
        AppState.activeFilters.brands = AppState.activeFilters.brands.filter(b => b !== e.target.value);
      }
      applyFilters();
    });
  });
}

// Configurar event listeners
function initEventListeners() {
  // Buscador
  const searchInput = document.getElementById('searchInput');
  const heroSearchInput = document.getElementById('heroSearchInput');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.activeFilters.search = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  if (heroSearchInput) {
    heroSearchInput.addEventListener('input', (e) => {
      AppState.activeFilters.search = e.target.value.trim().toLowerCase();
      if (searchInput) searchInput.value = e.target.value;
      applyFilters();
      // Scroll suave hacia la sección de productos si se busca desde el hero
      const catalogEl = document.getElementById('catalog');
      if (catalogEl && e.target.value.length === 1) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Filtros por Categoría
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => {
        b.classList.remove('bg-slate-900', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      });
      btn.classList.add('bg-slate-900', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');

      AppState.activeFilters.category = btn.dataset.category;
      applyFilters();
    });
  });

  // Filtro por Talla en la barra lateral
  document.querySelectorAll('.filter-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const size = parseInt(btn.dataset.size);
      if (AppState.activeFilters.selectedSize === size) {
        AppState.activeFilters.selectedSize = null;
        btn.classList.remove('active');
      } else {
        document.querySelectorAll('.filter-size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        AppState.activeFilters.selectedSize = size;
      }
      applyFilters();
    });
  });

  // Slider de Precio
  const priceSlider = document.getElementById('priceRange');
  const priceDisplay = document.getElementById('priceValue');
  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      AppState.activeFilters.maxPrice = val;
      priceDisplay.textContent = `${val}€`;
      applyFilters();
    });
  }

  // Ordenamiento
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.activeFilters.sortBy = e.target.value;
      applyFilters();
    });
  }

  // Reset Filters
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetAllFilters);
  }

  // Cart Drawer open/close
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');

  if (openCartBtn) openCartBtn.addEventListener('click', openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (cartDrawerOverlay) cartDrawerOverlay.addEventListener('click', closeCartDrawer);

  // Wishlist Modal open/close
  const openWishlistBtn = document.getElementById('openWishlistBtn');
  const closeWishlistBtn = document.getElementById('closeWishlistBtn');
  const wishlistOverlay = document.getElementById('wishlistModalOverlay');

  if (openWishlistBtn) openWishlistBtn.addEventListener('click', openWishlistModal);
  if (closeWishlistBtn) closeWishlistBtn.addEventListener('click', closeWishlistModal);
  if (wishlistOverlay) {
    wishlistOverlay.addEventListener('click', (e) => {
      if (e.target === wishlistOverlay) closeWishlistModal();
    });
  }

  // Product Quick View Modal close
  const closeProductModalBtn = document.getElementById('closeProductModalBtn');
  const productModalOverlay = document.getElementById('productModalOverlay');
  if (closeProductModalBtn) closeProductModalBtn.addEventListener('click', closeProductModal);
  if (productModalOverlay) {
    productModalOverlay.addEventListener('click', (e) => {
      if (e.target === productModalOverlay) closeProductModal();
    });
  }

  // Modal Quantity buttons
  const qtyMinus = document.getElementById('modalQtyMinus');
  const qtyPlus = document.getElementById('modalQtyPlus');
  const qtyInput = document.getElementById('modalQty');
  if (qtyMinus && qtyPlus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      if (AppState.modalQuantity > 1) {
        AppState.modalQuantity--;
        qtyInput.value = AppState.modalQuantity;
      }
    });
    qtyPlus.addEventListener('click', () => {
      if (AppState.modalQuantity < 10) {
        AppState.modalQuantity++;
        qtyInput.value = AppState.modalQuantity;
      }
    });
  }

  // Modal Add to Cart
  const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', handleModalAddToCart);
  }

  // Cupones en Carrito
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const couponInput = document.getElementById('couponInput');
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      applyCoupon(couponInput.value.trim().toUpperCase());
    });
    couponInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyCoupon(couponInput.value.trim().toUpperCase());
      }
    });
  }

  // Checkout modal trigger & close
  const openCheckoutBtn = document.getElementById('openCheckoutBtn');
  const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
  const checkoutModalOverlay = document.getElementById('checkoutModalOverlay');
  const checkoutForm = document.getElementById('checkoutForm');

  if (openCheckoutBtn) {
    openCheckoutBtn.addEventListener('click', () => {
      if (AppState.cart.length === 0) {
        showToast("Tu carrito está vacío. ¡Elige unas zapatillas!", "warning");
        return;
      }
      closeCartDrawer();
      openCheckoutModal();
    });
  }
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
  if (checkoutModalOverlay) {
    checkoutModalOverlay.addEventListener('click', (e) => {
      if (e.target === checkoutModalOverlay) closeCheckoutModal();
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  // Mobile Menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        showToast("¡Te has suscrito con éxito! Código VIP de 15%: BIENVENIDO15", "success");
        emailInput.value = '';
      }
    });
  }
}

// Aplicar filtros
function applyFilters() {
  const { search, category, brands, maxPrice, selectedSize, sortBy } = AppState.activeFilters;

  AppState.filteredProducts = AppState.products.filter(item => {
    // Búsqueda
    if (search && !item.name.toLowerCase().includes(search) && !item.brand.toLowerCase().includes(search)) {
      return false;
    }
    // Categoría
    if (category !== 'all' && item.category !== category) {
      return false;
    }
    // Marcas
    if (brands.length > 0 && !brands.includes(item.brand)) {
      return false;
    }
    // Precio
    if (item.price > maxPrice) {
      return false;
    }
    // Talla
    if (selectedSize && !item.sizes.includes(selectedSize)) {
      return false;
    }
    return true;
  });

  // Ordenamiento
  switch (sortBy) {
    case 'price-asc':
      AppState.filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      AppState.filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      AppState.filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      AppState.filteredProducts.sort((a, b) => b.releaseYear - a.releaseYear);
      break;
    case 'featured':
    default:
      AppState.filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  renderProducts();
}

function resetAllFilters() {
  AppState.activeFilters = {
    search: '',
    category: 'all',
    brands: [],
    maxPrice: 300,
    selectedSize: null,
    sortBy: 'featured'
  };

  const searchInput = document.getElementById('searchInput');
  const heroSearchInput = document.getElementById('heroSearchInput');
  const priceSlider = document.getElementById('priceRange');
  const priceDisplay = document.getElementById('priceValue');
  const sortSelect = document.getElementById('sortSelect');

  if (searchInput) searchInput.value = '';
  if (heroSearchInput) heroSearchInput.value = '';
  if (priceSlider) priceSlider.value = '300';
  if (priceDisplay) priceDisplay.textContent = '300€';
  if (sortSelect) sortSelect.value = 'featured';

  document.querySelectorAll('.category-btn').forEach(b => {
    b.classList.remove('bg-slate-900', 'text-white', 'shadow-md');
    b.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
  });
  const allCatBtn = document.querySelector('.category-btn[data-category="all"]');
  if (allCatBtn) {
    allCatBtn.classList.add('bg-slate-900', 'text-white', 'shadow-md');
    allCatBtn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');
  }

  document.querySelectorAll('.filter-size-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.brand-checkbox').forEach(cb => cb.checked = false);

  applyFilters();
  showToast("Filtros restablecidos", "info");
}

// Renderizar tarjetas de productos
function renderProducts() {
  const container = document.getElementById('productsGrid');
  const countDisplay = document.getElementById('productsCount');

  if (!container) return;

  if (countDisplay) {
    countDisplay.textContent = `${AppState.filteredProducts.length} zapatillas encontradas`;
  }

  if (AppState.filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-4">
          <i data-lucide="package-x" class="w-8 h-8"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-800 mb-1 font-display">Sin resultados para tu búsqueda</h3>
        <p class="text-slate-500 text-sm max-w-sm mx-auto mb-6">Prueba a cambiar los filtros de precio, marcas o términos de búsqueda.</p>
        <button onclick="resetAllFilters()" class="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition">
          Restablecer Filtros
        </button>
      </div>
    `;
    initIcons();
    return;
  }

  container.innerHTML = AppState.filteredProducts.map(product => {
    const isWishlisted = AppState.wishlist.some(id => id === product.id);
    const badgeClass = product.badgeType === 'hot' ? 'badge-hot' : product.badgeType === 'new' ? 'badge-new' : 'badge-sale';

    return `
      <div class="sneaker-card bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col group relative shadow-sm hover:border-slate-200">
        <!-- Badge -->
        ${product.badge ? `
          <div class="absolute top-3.5 left-3.5 z-10 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${badgeClass} shadow-sm">
            ${product.badge}
          </div>
        ` : ''}

        <!-- Wishlist Button -->
        <button onclick="toggleWishlist(${product.id})" class="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm transition hover:scale-110 active:scale-95 ${isWishlisted ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}">
          <i data-lucide="heart" class="w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}"></i>
        </button>

        <!-- Image Container -->
        <div class="relative bg-slate-50 aspect-square p-6 flex items-center justify-center overflow-hidden cursor-pointer" onclick="openProductModal(${product.id})">
          <img src="${product.image}" alt="${product.name}" class="product-img object-contain w-full h-full drop-shadow-md" loading="lazy">
          <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span class="bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Vista rápida
            </span>
          </div>
        </div>

        <!-- Details -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span class="uppercase tracking-wider font-semibold text-orange-600">${product.brand}</span>
              <div class="flex items-center gap-1 text-amber-500">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
                <span class="font-bold text-slate-700">${product.rating}</span>
                <span class="text-slate-400 text-[10px]">(${product.reviewsCount})</span>
              </div>
            </div>

            <h3 onclick="openProductModal(${product.id})" class="font-bold text-slate-900 text-base leading-snug hover:text-orange-600 cursor-pointer transition line-clamp-1">
              ${product.name}
            </h3>

            <!-- Color preview dots -->
            <div class="flex items-center gap-1.5 mt-2">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-300"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-red-600 border border-slate-300"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-white border border-slate-300"></span>
              <span class="text-[11px] text-slate-400 ml-1">+${product.colors.length} colores</span>
            </div>
          </div>

          <!-- Price and Actions -->
          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div class="flex items-baseline gap-2">
                <span class="text-lg font-extrabold text-slate-900 font-display">${product.price.toFixed(2)}€</span>
                ${product.originalPrice ? `
                  <span class="text-xs text-slate-400 line-through font-medium">${product.originalPrice.toFixed(2)}€</span>
                ` : ''}
              </div>
            </div>

            <button onclick="quickAddToCart(${product.id})" class="w-9 h-9 rounded-xl bg-slate-900 hover:bg-orange-600 text-white flex items-center justify-center transition-colors shadow-sm hover:shadow" title="Añadir al carrito">
              <i data-lucide="plus" class="w-5 h-5"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  initIcons();
}

// Modal de Producto (Vista Rápida)
function openProductModal(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  AppState.currentProductModal = product;
  AppState.selectedModalSize = product.sizes[0];
  AppState.selectedModalColor = product.colors[0];
  AppState.modalQuantity = 1;

  // Llenar datos
  document.getElementById('modalProductTitle').textContent = product.name;
  document.getElementById('modalProductBrand').textContent = product.brand;
  document.getElementById('modalProductPrice').textContent = `${product.price.toFixed(2)}€`;
  
  const originalPriceEl = document.getElementById('modalProductOriginalPrice');
  if (product.originalPrice) {
    originalPriceEl.textContent = `${product.originalPrice.toFixed(2)}€`;
    originalPriceEl.classList.remove('hidden');
  } else {
    originalPriceEl.classList.add('hidden');
  }

  document.getElementById('modalProductRating').textContent = product.rating;
  document.getElementById('modalProductReviews').textContent = `(${product.reviewsCount} opiniones)`;
  document.getElementById('modalProductDescription').textContent = product.description;
  document.getElementById('modalQty').value = AppState.modalQuantity;

  // Imagen principal y miniaturas
  const mainImage = document.getElementById('modalMainImage');
  mainImage.src = product.image;
  mainImage.alt = product.name;

  const thumbsContainer = document.getElementById('modalThumbnails');
  thumbsContainer.innerHTML = product.gallery.map((imgSrc, idx) => `
    <button onclick="changeModalImage('${imgSrc}', this)" class="modal-thumb w-16 h-16 rounded-xl border-2 ${idx === 0 ? 'border-orange-500' : 'border-slate-200'} overflow-hidden p-1 bg-slate-50 transition hover:opacity-90">
      <img src="${imgSrc}" alt="thumb" class="w-full h-full object-contain">
    </button>
  `).join('');

  // Selector de tallas
  const sizesContainer = document.getElementById('modalSizesList');
  sizesContainer.innerHTML = product.sizes.map(size => `
    <button type="button" onclick="selectModalSize(${size}, this)" class="size-btn py-2 text-sm font-semibold rounded-xl border border-slate-200 hover:border-slate-900 transition ${size === AppState.selectedModalSize ? 'active' : 'bg-white text-slate-800'}">
      EU ${size}
    </button>
  `).join('');

  // Selector de colores
  const colorsContainer = document.getElementById('modalColorsList');
  colorsContainer.innerHTML = product.colors.map(col => `
    <button type="button" onclick="selectModalColor('${col}', this)" class="color-btn text-xs font-medium px-3 py-1.5 rounded-lg border transition ${col === AppState.selectedModalColor ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}">
      ${col}
    </button>
  `).join('');

  // Mostrar modal
  const modalOverlay = document.getElementById('productModalOverlay');
  modalOverlay.classList.add('open');
  initIcons();
}

function closeProductModal() {
  const modalOverlay = document.getElementById('productModalOverlay');
  modalOverlay.classList.remove('open');
  AppState.currentProductModal = null;
}

function changeModalImage(src, btn) {
  document.getElementById('modalMainImage').src = src;
  document.querySelectorAll('.modal-thumb').forEach(b => {
    b.classList.remove('border-orange-500');
    b.classList.add('border-slate-200');
  });
  btn.classList.add('border-orange-500');
  btn.classList.remove('border-slate-200');
}

function selectModalSize(size, btn) {
  AppState.selectedModalSize = size;
  document.querySelectorAll('#modalSizesList .size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function selectModalColor(color, btn) {
  AppState.selectedModalColor = color;
  document.querySelectorAll('#modalColorsList .color-btn').forEach(b => {
    b.classList.remove('border-slate-900', 'bg-slate-900', 'text-white');
    b.classList.add('border-slate-200', 'bg-slate-50', 'text-slate-700');
  });
  btn.classList.add('border-slate-900', 'bg-slate-900', 'text-white');
  btn.classList.remove('border-slate-200', 'bg-slate-50', 'text-slate-700');
}

function handleModalAddToCart() {
  if (!AppState.currentProductModal) return;
  if (!AppState.selectedModalSize) {
    showToast("Por favor selecciona una talla", "warning");
    return;
  }

  addToCart(
    AppState.currentProductModal.id,
    AppState.selectedModalSize,
    AppState.selectedModalColor,
    AppState.modalQuantity
  );

  closeProductModal();
}

// Añadir rápido con talla por defecto
function quickAddToCart(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;
  const defaultSize = product.sizes[0];
  const defaultColor = product.colors[0];
  addToCart(productId, defaultSize, defaultColor, 1);
}

// Carrito de compras
function addToCart(productId, size, color, quantity = 1) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  const existingItemIndex = AppState.cart.findIndex(
    item => item.id === productId && item.size === size && item.color === color
  );

  if (existingItemIndex > -1) {
    AppState.cart[existingItemIndex].quantity += quantity;
  } else {
    AppState.cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      size: size,
      color: color,
      quantity: quantity
    });
  }

  saveCart();
  updateCartUI();
  triggerCartBumpAnimation();
  showToast(`¡${product.name} (Talla EU ${size}) añadido al carrito!`, "success");
}

function removeFromCart(index) {
  const removed = AppState.cart[index];
  AppState.cart.splice(index, 1);
  saveCart();
  updateCartUI();
  if (removed) {
    showToast(`Eliminado ${removed.name} del carrito`, "info");
  }
}

function updateCartQuantity(index, delta) {
  const item = AppState.cart[index];
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(index);
    return;
  }
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const cartBadge = document.getElementById('cartBadgeCount');
  const cartItemsContainer = document.getElementById('cartItemsList');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartFooter = document.getElementById('cartFooter');

  const subtotalEl = document.getElementById('cartSubtotal');
  const shippingEl = document.getElementById('cartShipping');
  const discountEl = document.getElementById('cartDiscount');
  const discountRow = document.getElementById('cartDiscountRow');
  const totalEl = document.getElementById('cartTotal');
  const freeShippingBar = document.getElementById('freeShippingProgressBar');
  const freeShippingText = document.getElementById('freeShippingText');

  const totalItemsCount = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartBadge) {
    cartBadge.textContent = totalItemsCount;
    cartBadge.classList.toggle('hidden', totalItemsCount === 0);
  }

  // Si está vacío
  if (AppState.cart.length === 0) {
    if (cartItemsContainer) cartItemsContainer.innerHTML = '';
    if (cartEmptyState) cartEmptyState.classList.remove('hidden');
    if (cartFooter) cartFooter.classList.add('hidden');
    if (freeShippingBar) freeShippingBar.style.width = '0%';
    if (freeShippingText) freeShippingText.textContent = `Añade ${FREE_SHIPPING_THRESHOLD.toFixed(2)}€ para envío GRATIS`;
    return;
  }

  if (cartEmptyState) cartEmptyState.classList.add('hidden');
  if (cartFooter) cartFooter.classList.remove('hidden');

  // Renderizar items del carrito
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = AppState.cart.map((item, index) => `
      <div class="flex items-center gap-4 py-3.5 border-b border-slate-100 last:border-b-0">
        <div class="w-18 h-18 w-20 h-20 rounded-xl bg-slate-50 p-2 flex-shrink-0 border border-slate-100 flex items-center justify-center">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain drop-shadow-sm">
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-bold text-slate-900 truncate leading-tight">${item.name}</h4>
          <p class="text-xs text-slate-500 mt-0.5">Talla: <span class="font-semibold text-slate-700">EU ${item.size}</span> | ${item.color}</p>
          <div class="text-sm font-extrabold text-slate-900 mt-1 font-display">${(item.price * item.quantity).toFixed(2)}€</div>
          
          <!-- Controles de cantidad -->
          <div class="flex items-center justify-between mt-2">
            <div class="inline-flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
              <button onclick="updateCartQuantity(${index}, -1)" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition">
                <i data-lucide="minus" class="w-3 h-3"></i>
              </button>
              <span class="w-7 text-center text-xs font-bold text-slate-800">${item.quantity}</span>
              <button onclick="updateCartQuantity(${index}, 1)" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition">
                <i data-lucide="plus" class="w-3 h-3"></i>
              </button>
            </div>

            <button onclick="removeFromCart(${index})" class="text-slate-400 hover:text-red-500 text-xs transition flex items-center gap-1">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Cálculos
  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  let shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;

  if (AppState.appliedCoupon) {
    if (AppState.appliedCoupon.type === 'percent') {
      discount = subtotal * (AppState.appliedCoupon.value / 100);
    } else if (AppState.appliedCoupon.type === 'free_shipping') {
      shippingCost = 0;
    }
  }

  const finalTotal = Math.max(0, subtotal - discount + shippingCost);

  // Barra de envío gratis
  const shippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (freeShippingBar) {
    freeShippingBar.style.width = `${progressPercent}%`;
  }
  if (freeShippingText) {
    if (shippingRemaining <= 0) {
      freeShippingText.innerHTML = `<span class="text-emerald-600 font-bold">🎉 ¡Enhorabuena! Tienes Envío GRATIS</span>`;
    } else {
      freeShippingText.innerHTML = `Añade <span class="font-bold text-orange-600">${shippingRemaining.toFixed(2)}€</span> más para envío <strong>GRATIS</strong>`;
    }
  }

  // Actualizar resumen
  if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)}€`;
  if (shippingEl) {
    shippingEl.textContent = shippingCost === 0 ? 'GRATIS' : `${shippingCost.toFixed(2)}€`;
    if (shippingCost === 0) shippingEl.classList.add('text-emerald-600', 'font-bold');
    else shippingEl.classList.remove('text-emerald-600', 'font-bold');
  }

  if (discountRow && discountEl) {
    if (discount > 0) {
      discountRow.classList.remove('hidden');
      discountEl.textContent = `-${discount.toFixed(2)}€`;
    } else {
      discountRow.classList.add('hidden');
    }
  }

  if (totalEl) totalEl.textContent = `${finalTotal.toFixed(2)}€`;

  initIcons();
}

// Cupón de descuento
function applyCoupon(code) {
  if (!code) {
    showToast("Introduce un código de cupón", "warning");
    return;
  }

  if (DISCOUNT_COUPONS[code]) {
    AppState.appliedCoupon = { code, ...DISCOUNT_COUPONS[code] };
    saveCart();
    updateCartUI();
    showToast(`¡Cupón "${code}" aplicado: ${AppState.appliedCoupon.label}!`, "success");
    const couponInput = document.getElementById('couponInput');
    if (couponInput) couponInput.value = '';
  } else {
    showToast("El cupón ingresado no es válido o ha expirado.", "error");
  }
}

// Wishlist (Lista de Deseos)
function toggleWishlist(productId) {
  const index = AppState.wishlist.indexOf(productId);
  const product = AppState.products.find(p => p.id === productId);

  if (index > -1) {
    AppState.wishlist.splice(index, 1);
    showToast(`Eliminado de tu lista de deseos`, "info");
  } else {
    AppState.wishlist.push(productId);
    showToast(`¡${product.name} guardado en favoritos!`, "success");
  }

  saveWishlist();
  updateWishlistUI();
  renderProducts(); // Actualizar corazones en catálogo
}

function updateWishlistUI() {
  const badge = document.getElementById('wishlistBadgeCount');
  if (badge) {
    badge.textContent = AppState.wishlist.length;
    badge.classList.toggle('hidden', AppState.wishlist.length === 0);
  }

  const container = document.getElementById('wishlistItemsContainer');
  const emptyState = document.getElementById('wishlistEmptyState');

  if (!container) return;

  if (AppState.wishlist.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  const wishlistProducts = AppState.products.filter(p => AppState.wishlist.includes(p.id));

  container.innerHTML = wishlistProducts.map(p => `
    <div class="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
      <div class="flex items-center gap-3">
        <img src="${p.image}" alt="${p.name}" class="w-14 h-14 object-contain rounded-lg bg-white p-1 border border-slate-100">
        <div>
          <h4 class="font-bold text-slate-800 text-sm leading-snug">${p.name}</h4>
          <span class="text-xs font-extrabold text-orange-600 font-display">${p.price.toFixed(2)}€</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="quickAddToCart(${p.id}); toggleWishlist(${p.id});" class="p-2 bg-slate-900 text-white rounded-lg hover:bg-orange-600 transition" title="Mover al carrito">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i>
        </button>
        <button onclick="toggleWishlist(${p.id})" class="p-2 text-slate-400 hover:text-red-500 rounded-lg transition" title="Eliminar">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  `).join('');

  initIcons();
}

function openWishlistModal() {
  document.getElementById('wishlistModalOverlay').classList.add('open');
  updateWishlistUI();
}

function closeWishlistModal() {
  document.getElementById('wishlistModalOverlay').classList.remove('open');
}

// Drawer de carrito
function openCartDrawer() {
  document.getElementById('cartDrawerOverlay').classList.remove('pointer-events-none', 'opacity-0');
  document.getElementById('cartDrawerOverlay').classList.add('opacity-100');
  document.getElementById('cartDrawer').classList.add('open');
}

function closeCartDrawer() {
  document.getElementById('cartDrawerOverlay').classList.add('pointer-events-none', 'opacity-0');
  document.getElementById('cartDrawerOverlay').classList.remove('opacity-100');
  document.getElementById('cartDrawer').classList.remove('open');
}

function triggerCartBumpAnimation() {
  const btn = document.getElementById('openCartBtn');
  if (btn) {
    btn.classList.add('cart-bump');
    setTimeout(() => btn.classList.remove('cart-bump'), 400);
  }
}

// Checkout Modal
function openCheckoutModal() {
  const overlay = document.getElementById('checkoutModalOverlay');
  overlay.classList.add('open');

  // Resumen en modal
  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  let shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;

  if (AppState.appliedCoupon) {
    if (AppState.appliedCoupon.type === 'percent') {
      discount = subtotal * (AppState.appliedCoupon.value / 100);
    } else if (AppState.appliedCoupon.type === 'free_shipping') {
      shipping = 0;
    }
  }

  const total = Math.max(0, subtotal - discount + shipping);

  document.getElementById('checkoutModalTotal').textContent = `${total.toFixed(2)}€`;
  document.getElementById('checkoutItemsCount').textContent = `${AppState.cart.length} productos`;

  // Restaurar formulario si venía de un pedido completado previo
  document.getElementById('checkoutForm').classList.remove('hidden');
  document.getElementById('checkoutSuccessState').classList.add('hidden');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModalOverlay').classList.remove('open');
}

async function handleCheckoutSubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('checkoutSubmitBtn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <span class="inline-block animate-spin mr-2">⟳</span> Procesando pago seguro...
  `;

  // Cálculos de totales
  const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  let shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;

  if (AppState.appliedCoupon) {
    if (AppState.appliedCoupon.type === 'percent') {
      discount = subtotal * (AppState.appliedCoupon.value / 100);
    } else if (AppState.appliedCoupon.type === 'free_shipping') {
      shipping = 0;
    }
  }

  const total = Math.max(0, subtotal - discount + shipping);
  const orderNumber = 'KV-' + Math.floor(100000 + Math.random() * 900000);
  const buyerName = document.getElementById('checkoutName').value;
  const buyerEmail = document.getElementById('checkoutEmail').value;
  const buyerAddress = document.getElementById('checkoutAddress').value;

  // Datos para registrar en Supabase
  const orderInfo = {
    orderNumber,
    customerName: buyerName,
    customerEmail: buyerEmail,
    address: buyerAddress,
    city: document.querySelector('#checkoutForm input[placeholder="Madrid"]')?.value || '',
    postalCode: document.querySelector('#checkoutForm input[placeholder="28013"]')?.value || '',
    phone: document.querySelector('#checkoutForm input[type="tel"]')?.value || '',
    paymentMethod: document.querySelector('input[name="payment"]:checked')?.value || 'card',
    subtotal,
    discount,
    shipping,
    total
  };

  const orderedItems = [...AppState.cart];

  // Si Supabase está disponible, guardar pedido en base de datos
  if (typeof saveOrderToSupabase === 'function') {
    await saveOrderToSupabase(orderInfo, orderedItems);
  }

  setTimeout(() => {
    document.getElementById('checkoutOrderNumber').textContent = orderNumber;
    document.getElementById('checkoutCustomerGreeting').textContent = `¡Muchas gracias por tu compra, ${buyerName}!`;

    // Vaciar carrito
    AppState.cart = [];
    AppState.appliedCoupon = null;
    saveCart();
    updateCartUI();

    // Mostrar pantalla de éxito
    document.getElementById('checkoutForm').classList.add('hidden');
    document.getElementById('checkoutSuccessState').classList.remove('hidden');
    submitBtn.disabled = false;
    submitBtn.innerHTML = `Confirmar y Pagar`;

    showToast("¡Pedido realizado con éxito! Comprueba tu correo.", "success");
  }, 1200);
}

// Toast Notifications
function showToast(message, type = "info") {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium';

  let iconName = 'info';
  let colors = 'bg-white border-slate-200 text-slate-800';

  if (type === 'success') {
    iconName = 'check-circle';
    colors = 'bg-slate-900 border-slate-800 text-white';
  } else if (type === 'warning') {
    iconName = 'alert-triangle';
    colors = 'bg-amber-500 border-amber-600 text-white';
  } else if (type === 'error') {
    iconName = 'x-circle';
    colors = 'bg-red-600 border-red-700 text-white';
  }

  toast.className += ` ${colors}`;
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-5 h-5 flex-shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  initIcons();

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
