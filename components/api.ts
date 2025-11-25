
import { CartItem, Product } from './types';
import { allProducts } from './products';

// =============================================================================
// 1. TUS CLAVES DE WOOCOMMERCE (PÉGALAS DENTRO DE LAS COMILLAS)
// =============================================================================
const WC_URL = 'https://vellaperfumeria.com';

// ⚠️ IMPORTANTE: Pega aquí tus claves generadas en WooCommerce > Ajustes > Avanzado > API REST
const CONSUMER_KEY = '';    // Ej: 'ck_123456789...'
const CONSUMER_SECRET = ''; // Ej: 'cs_987654321...'

// =============================================================================
// LÓGICA DE CONEXIÓN
// =============================================================================

/**
 * Genera la cabecera de autorización para WooCommerce
 */
const getAuthHeader = () => {
    if (!CONSUMER_KEY || !CONSUMER_SECRET) return {};
    // Autenticación Básica Base64 estándar
    const hash = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
    return {
        'Authorization': `Basic ${hash}`,
        'Content-Type': 'application/json'
    };
};

/**
 * Recupera un carrito del servidor usando las claves API.
 */
export const fetchServerCart = async (sessionId: string): Promise<CartItem[]> => {
    
    // CASO 1: MODO SIMULACIÓN (Si no hay claves o es el ID de prueba)
    if (sessionId === '12470fe406d4') {
        if (!CONSUMER_KEY || !CONSUMER_SECRET) {
            console.log("%c⚠️ MODO SIMULACIÓN ACTIVADO", "color: orange; font-weight: bold;");
            console.log("No has puesto las claves API en components/api.ts, pero mostraré el carrito de prueba para que veas cómo queda.");
        }
        return getMockCart();
    }

    // CASO 2: INTENTO DE CONEXIÓN REAL
    if (CONSUMER_KEY && CONSUMER_SECRET) {
        console.log(`🔌 Intentando conectar a ${WC_URL} para recuperar el pedido: ${sessionId}...`);
        
        try {
            const response = await fetch(`${WC_URL}/wp-json/wc/v3/orders/${sessionId}`, {
                method: 'GET',
                headers: getAuthHeader()
            });

            // Errores comunes de configuración
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.error("%c❌ ERROR DE PERMISOS (CORS o Claves)", "color: red; font-size: 14px;");
                    console.log("Es probable que te falte configurar el plugin 'WP CORS' en WordPress.");
                    console.log("1. Asegúrate de añadir 'Authorization' en 'Allowed Headers'.");
                    console.log("2. En 'Allowed Origins', pon un * (asterisco) o copia exactamente esta dirección:");
                    console.log(`👉 ${window.location.origin}`);
                }
                if (response.status === 404) {
                     console.warn("⚠️ PEDIDO NO ENCONTRADO: El ID no existe en WooCommerce.");
                }
                // Fallback a simulación para no romper la app visualmente
                return getMockCart(); 
            }

            const orderData = await response.json();
            console.log("✅ ¡CONEXIÓN EXITOSA! Datos recibidos de WooCommerce:", orderData);
            return mapOrderToCartItems(orderData);

        } catch (error: any) {
            console.error("%c❌ ERROR DE RED / CORS", "color: red; font-weight: bold;");
            console.log("Tu navegador ha bloqueado la conexión a WordPress. Esto se soluciona instalando el plugin 'WP CORS'.");
            console.log("CONFIGURACIÓN RECOMENDADA PARA EL PLUGIN:");
            console.log("- Access-Control-Allow-Origin: *");
            console.log("- Access-Control-Allow-Methods: GET, POST, OPTIONS");
            console.log("- Access-Control-Allow-Headers: Authorization, Content-Type");
            console.log("---------------------------------------------------");
            console.log("Si no quieres usar asterisco, tu Dominio actual es:");
            console.log(window.location.origin);
            
            return getMockCart();
        }
    } else {
        console.warn("⚠️ FALTAN CLAVES API: No se puede recuperar el pedido real sin Consumer Key y Secret.");
        // Devolvemos vacío o mock si no hay claves
        return [];
    }
};

/**
 * Mapea los datos crudos de WooCommerce a nuestro formato de carrito
 */
const mapOrderToCartItems = (orderData: any): CartItem[] => {
    if (!orderData || !orderData.line_items) return [];

    return orderData.line_items.map((item: any) => {
        // Buscar si tenemos el producto en local para mejor foto/descripción
        const localProduct = allProducts.find(p => p.id === item.product_id);
        
        const productData: Product = localProduct || {
            id: item.product_id,
            name: item.name,
            brand: "Vellaperfumeria",
            price: parseFloat(item.price),
            imageUrl: item.image?.src || "https://vellaperfumeria.com/wp-content/uploads/woocommerce-placeholder.png",
            description: "Producto sincronizado desde la tienda.",
            stock: 99,
            category: 'personal-care'
        };

        const variantData: Record<string, string> = {};
        if (item.meta_data && Array.isArray(item.meta_data)) {
            item.meta_data.forEach((meta: any) => {
                if (!meta.key.startsWith('_')) {
                    variantData[meta.key] = meta.value;
                }
            });
        }

        return {
            id: `wc-${item.id}`,
            product: productData,
            quantity: item.quantity,
            selectedVariant: Object.keys(variantData).length > 0 ? variantData : null
        };
    });
};

/**
 * Datos de prueba (Olia Garnier) para cuando no hay conexión real
 */
const getMockCart = (): CartItem[] => {
    const oliaProduct = allProducts.find(p => p.id === 90001);
    const shampooProduct = allProducts.find(p => p.id === 44961);

    const mockCart: CartItem[] = [];

    if (oliaProduct) {
        mockCart.push({
            id: `server-${oliaProduct.id}-1`,
            product: oliaProduct,
            quantity: 2,
            selectedVariant: { "Tono": "Rojo Intenso 6.60" }
        });
    }

    if (shampooProduct) {
            mockCart.push({
            id: `server-${shampooProduct.id}-2`,
            product: shampooProduct,
            quantity: 1,
            selectedVariant: null
        });
    }

    return mockCart;
};
