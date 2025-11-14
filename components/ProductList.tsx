

import React from 'react';
import type { View, Product } from './types';
import HeroBanner from './HeroBanner';
import { allProducts } from './products';
import { ProductCard } from './ProductCard';
import FeaturesSection from './FeaturesSection';
import HeroCarousel from './HeroCarousel';
import VideoSection from './VideoSection';
import InteractiveCatalogSection from './InteractiveCatalogSection';
import type { Currency } from './currency';

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

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
        <div className="bg-white">
            <HeroBanner onNavigate={onNavigate} />
            
            <FeaturesSection />

            {/* Perfil de Belleza Oriflame Section */}
            <section className="bg-rose-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                     <div className="grid md:grid-cols-2 gap-10 items-center">
                         <div>
                            <img 
                                src="https://storage.googleapis.com/aistudio-public/gallery/3a598889-4081-426a-9351-d4190b40e34b.jpg" 
                                alt="Brand Partner de Vellaperfumeria trabajando con estilo desde casa" 
                                className="rounded-lg shadow-xl w-full h-auto object-cover"
                            />
                        </div>
                         <div className="text-center md:text-left">
                            <h2 className="text-3xl font-extrabold text-black tracking-tight">Conviértete en Brand Partner</h2>
                            <p className="mt-4 text-lg text-gray-700 max-w-lg">
                                Únete a nuestra comunidad de belleza. Disfruta de la flexibilidad, obtén ingresos extra y crece con el apoyo de un equipo increíble. ¡Tú pones los límites!
                            </p>
                            <button
                                onClick={() => onNavigate('contact')}
                                className="mt-8 inline-flex items-center justify-center bg-gray-800 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
                            >
                                Únete a mi equipo
                                <ArrowRightIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
               
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

               <VideoSection onNavigate={onNavigate} />

               <InteractiveCatalogSection onNavigate={onNavigate} />

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
                            className="bg-[#f3d9ff] text-black font-semibold py-3 px-8 rounded-md shadow-sm hover:bg-[#e9c2ff] transition-colors"
                        >
                            Ver toda la tienda
                        </button>
                    </div>
               </section>
            </div>
        </div>
    );
};

export default ProductList;