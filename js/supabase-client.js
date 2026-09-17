// Configuración e integración con Supabase
// Puedes configurar tus credenciales aquí o guardarlas en localStorage desde la consola
const SUPABASE_CONFIG = {
  url: window.SUPABASE_URL || localStorage.getItem('supabase_url') || '',
  anonKey: window.SUPABASE_ANON_KEY || localStorage.getItem('supabase_anon_key') || ''
};

let supabaseClient = null;

// Inicializar cliente si la librería oficial de Supabase está cargada y hay credenciales
if (window.supabase && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log("⚡ Conectado exitosamente a la base de datos de Supabase");
  } catch (err) {
    console.warn("No se pudo inicializar el cliente de Supabase:", err);
  }
}

// Cargar productos desde Supabase (con fallback a datos locales)
async function getSupabaseProducts() {
  if (!supabaseClient) {
    return PRODUCTS_DATA;
  }

  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) {
      console.log(`📦 Se cargaron ${data.length} zapatillas desde Supabase`);
      return data.map(item => ({
        ...item,
        originalPrice: item.original_price,
        reviewsCount: item.reviews_count,
        badgeType: item.badge_type,
        releaseYear: item.release_year
      }));
    }
  } catch (err) {
    console.warn("Aviso: No se pudo consultar Supabase, usando catálogo local:", err.message);
  }

  return PRODUCTS_DATA;
}

// Guardar un nuevo pedido en Supabase
async function saveOrderToSupabase(orderInfo, items) {
  if (!supabaseClient) {
    console.log("Pedido guardado localmente (simulación sin Supabase activo).");
    return { success: true, local: true };
  }

  try {
    // 1. Insertar el pedido principal
    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .insert([
        {
          order_number: orderInfo.orderNumber,
          customer_name: orderInfo.customerName,
          customer_email: orderInfo.customerEmail,
          address: orderInfo.address,
          city: orderInfo.city,
          postal_code: orderInfo.postalCode,
          phone: orderInfo.phone || null,
          payment_method: orderInfo.paymentMethod,
          subtotal: orderInfo.subtotal,
          discount: orderInfo.discount,
          shipping: orderInfo.shipping,
          total: orderInfo.total,
          status: 'preparing'
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Insertar los ítems asociados
    const orderItemsRows = items.map(item => ({
      order_id: orderData.id,
      product_id: item.id,
      product_name: item.name,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unit_price: item.price
    }));

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItemsRows);

    if (itemsError) throw itemsError;

    console.log("✅ Pedido guardado en Supabase con ID:", orderData.id);
    return { success: true, orderId: orderData.id };
  } catch (err) {
    console.error("Error al registrar pedido en Supabase:", err);
    return { success: false, error: err.message };
  }
}
