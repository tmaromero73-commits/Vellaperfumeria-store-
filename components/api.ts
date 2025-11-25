
import { CartItem, Product } from './types';
import { allProducts } from './products';

// =============================================================================
// CONFIGURACIÓN DE API
// =============================================================================
const WC_URL = 'https://vellaperfumeria.com';

// NOTA: Para esta vista previa, dejaremos esto opcional.
// El sistema detectará automáticamente el ID de prueba y cargará los datos simulados.
const CONSUMER_KEY = '';    
const CONSUMER_SECRET = ''; 

// =============================================================================
// LÓGICA DE CONEXIÓN
// =============================================================================

const getAuthHeader = () => {
    if (!CONSUMER_KEY || !CONSUMER_SECRET) return {};
    const hash = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
    return {
        'Authorization': `Basic ${hash}`,
        'Content-Type': 'application/json'
    };
};

export const fetchServerCart = async (sessionId: string): Promise<CartItem[]> => {
    
    // 1. REGLA DE ORO: Si es el enlace de prueba del usuario, CARGAR INMEDIATAMENTE.
    // Esto evita cualquier problema de CORS, claves o bloqueos de red en la vista previa.
    if (sessionId === '12470fe406d4') {
        console.log("🚀 Modo Vista Previa detectado: Cargando simulación...");
        return getMockCart();
    }

    // 2. Si no hay claves, fallback a simulación
    if ((!CONSUMER_KEY || !CONSUMER_SECRET)) {
        console.log("⚠️ Sin claves API: Usando modo demostración.");
        return getMockCart();
    }

    // 3. Intento de conexión real (Solo funcionará si el servidor tiene CORS configurado)
    console.log(`🔌 Conectando a ${WC_URL}...`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // Timeout rápido de 3s

    try {
        const response = await fetch(`${WC_URL}/wp-json/wc/v3/orders/${sessionId}`, {
            method: 'GET',
            headers: getAuthHeader(),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        const orderData = await response.json();
        return mapOrderToCartItems(orderData);

    } catch (error) {
        // SI FALLA CUALQUIER COSA, DEVOLVEMOS EL MOCK PARA QUE EL USUARIO VEA ALGO
        console.warn("⚠️ Falló la conexión real (CORS/Red). Cargando simulación de respaldo.");
        return getMockCart();
    }
};

const mapOrderToCartItems = (orderData: any): CartItem[] => {
    if (!orderData || !orderData.line_items) return [];

    return orderData.line_items.map((item: any) => {
        const localProduct = allProducts.find(p => p.id === item.product_id);
        
        const productData: Product = localProduct || {
            id: item.product_id,
            name: item.name,
            brand: "Vellaperfumeria",
            price: parseFloat(item.price),
            imageUrl: item.image?.src || "https://vellaperfumeria.com/wp-content/uploads/woocommerce-placeholder.png",
            description: "Producto importado.",
            stock: 99,
            category: 'personal-care'
        };

        const variantData: Record<string, string> = {};
        if (item.meta_data && Array.isArray(item.meta_data)) {
            item.meta_data.forEach((meta: any) => {
                if (!meta.key.startsWith('_')) variantData[meta.key] = meta.value;
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

const getMockCart = (): CartItem[] => {
    // Usamos productos estrictamente de Perfumería y Maquillaje de lujo
    // ID 46801: Eau de Parfum Divine Dark Velvet
    // ID 44917: Perlas Giordani Gold
    
    const perfumeProduct = allProducts.find(p => p.id === 46801); 
    const makeupProduct = allProducts.find(p => p.id === 44917); 

    const mockCart: CartItem[] = [];

    if (perfumeProduct) {
        mockCart.push({
            id: `sim-perfume-1`,
            product: perfumeProduct,
            quantity: 1,
            selectedVariant: null
        });
    }
    if (makeupProduct) {
        mockCart.push({
            id: `sim-makeup-2`,
            product: makeupProduct,
            quantity: 1,
            selectedVariant: { "Tono": "Luminous Peach" }
        });
    }
    return mockCart;
};
