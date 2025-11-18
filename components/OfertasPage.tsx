



import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from './types';
import type { Currency } from './currency';
import { allProducts } from './products';

// A curated list of products perfect for gifting.
const giftProductIds = [153756, 153757, 48649, 47536, 47538, 20374, 104, 38497, 46901, 22442, 1440, 46801];
const giftProducts = allProducts.filter(p => giftProductIds.includes(p.id));


const IdeasRegaloPage: React.FC<{
    currency: Currency;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onQuickAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onProductSelect: (product: Product) => void;
    onQuickView: (product: Product) => void;
}> = ({ currency, onAddToCart, onQuickAddToCart, onProductSelect, onQuickView }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-black tracking-tight">Ideas para Regalar</h2>
                <p className="mt-2 text-lg text-gray-600 font-semibold">Encuentra el detalle perfecto para cada ocasión.</p>
            </div>

            {giftProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {giftProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            currency={currency}
                            onAddToCart={onAddToCart}
                            onQuickAddToCart={onQuickAddToCart}
                            onProductSelect={onProductSelect}
                            onQuickView={onQuickView}
                        />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-2xl font-semibold text-gray-800">No hay ideas de regalos en este momento</h3>
                    <p className="mt-2 text-gray-600">
                        ¡Vuelve pronto para ver nuevas sugerencias!
                    </p>
                </div>
            )}
        </div>
    );
};

export default IdeasRegaloPage;