

// Variant types, used in Product
export interface VariantOption {
    value: string;
    colorCode?: string;
    imageUrl?: string;
}

export interface ProductVariants {
    [key: string]: VariantOption[];
}

// Product type
export interface Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    imageUrl: string;
    description: string;
    stock: number;
    category: 'perfume' | 'hair' | 'makeup' | 'skincare' | 'personal-care' | 'men' | 'wellness' | 'accessories';
    subCategory?: 'Giordani Gold' | 'THE ONE' | 'OnColour';
    tag?: 'NOVEDAD' | 'SET';
    statusLabel?: string;
    rating?: number;
    reviewCount?: number;
    variants?: ProductVariants;
    beautyPoints?: number;
    isShippingSaver?: boolean;
}

// Cart item type
export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
    selectedVariant: Record<string, string> | null;
}

// App view type
export type View = 'home' | 'products' | 'productDetail' | 'algas' | 'ofertas' | 'ia' | 'catalog' | 'about' | 'contact' | 'blog' | 'blogPost' | 'orderConfirmation';