
import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from './types';
import type { Currency } from './currency';
import { allProducts } from './products';

// The Ofertas page now automatically shows products with a regularPrice.
const ofertasProducts = allProducts.filter(p => p.regularPrice && p.regularPrice > p.price);

const OfertasPage: React.FC<{
    currency: Currency;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onProductSelect: (product: Product) => void;
    onQuickView: (product: Product) => void;
}> = ({ currency, onAddToCart, onProductSelect, onQuickView }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-black tracking-tight">Ofertas Destacadas</h2>
                <p className="mt-2 text-xl text-gray-600 font-semibold">¡Aprovecha nuestros descuentos especiales!</p>
            </div>

            {ofertasProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {ofertasProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            currency={currency}
                            onAddToCart={onAddToCart}
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
                    <h3 className="mt-4 text-2xl font-semibold text-gray-800">No hay ofertas especiales en este momento</h3>
                    <p className="mt-2 text-gray-600">
                        ¡Vuelve pronto para ver nuevas promociones!
                    </p>
                </div>
            )}
        </div>
    );
};

export default OfertasPage;
