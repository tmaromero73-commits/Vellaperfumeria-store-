

import React from 'react';
import type { View, Product } from './types';
import { allProducts } from './products';
import { ProductCard } from './ProductCard';
import HeroCarousel from './HeroCarousel';
import type { Currency } from './currency';

const ProductList: React.FC<{
    onNavigate: (view: View) => void;
    onProductSelect: (product: Product) => void;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    currency: Currency;
    onQuickView: (product: Product) => void;
}> = ({ onNavigate, onProductSelect, onAddToCart, currency, onQuickView }) => {
    const newArrivals = allProducts.slice(0, 4);
    const bestSellers = allProducts.filter(p => p.rating && p.rating >= 5).slice(0, 4);
    const featuredProducts = allProducts.filter(p => p.category === 'perfume' || p.category === 'skincare').slice(0, 8);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
             <div className="text-center">
                 <h1 className="text-4xl lg:text-5xl font-extrabold text-black tracking-tight leading-tight">
                    Tu Esencia, Tu Belleza, <span className="text-brand-lilac-dark">Tu Tienda.</span>
                </h1>
                <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
                    Descubre cosméticos, fragancias y productos de bienestar que realzan tu belleza natural. Calidad y exclusividad en cada artículo.
                </p>
            </div>
            
            <HeroCarousel products={featuredProducts} currency={currency} onProductSelect={onProductSelect} />
            
            <section>
                <h2 className="text-3xl font-extrabold text-black tracking-tight text-center mb-10">Novedades</h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newArrivals.map(product => (
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
            </section>

            <section>
                <h2 className="text-3xl font-extrabold text-black tracking-tight text-center mb-10">Más Vendidos</h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {bestSellers.map(product => (
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
                <div className="text-center mt-12">
                    <button
                        onClick={() => onNavigate('products')}
                        className="btn-primary"
                    >
                        Ver toda la tienda
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ProductList;