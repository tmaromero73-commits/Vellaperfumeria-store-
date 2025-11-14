
import React, { useRef } from 'react';
import type { Product } from './types';
import type { Currency } from './currency';
import { formatCurrency } from './currency';

interface HeroCarouselProps {
    products: Product[];
    currency: Currency;
    onProductSelect: (product: Product) => void;
}

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const HeroCarousel: React.FC<HeroCarouselProps> = ({ products, currency, onProductSelect }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = current.offsetWidth * 0.8; // Scroll 80% of the container width
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="mb-16 relative">
            <h2 className="text-3xl font-bold text-left mb-6">Lo más destacado</h2>
            <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-2 pointer-events-none z-10 -mt-8">
                 <button 
                    onClick={() => scroll('left')} 
                    className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors pointer-events-auto hidden md:block"
                    aria-label="Scroll left"
                >
                    <ArrowLeftIcon />
                </button>
                <button 
                    onClick={() => scroll('right')} 
                    className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors pointer-events-auto hidden md:block"
                    aria-label="Scroll right"
                >
                    <ArrowRightIcon />
                </button>
            </div>
            <div
                ref={scrollContainerRef}
                className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            >
                {products.map((product) => {
                    const isDiscounted = product.regularPrice && product.regularPrice > product.price;
                    return (
                        <div key={product.id} className="snap-center flex-shrink-0 w-64">
                            <div 
                                className="bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                onClick={() => onProductSelect(product)}
                                role="button"
                                aria-label={`Ver detalles de ${product.name}`}
                            >
                                <div className="relative">
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-4">
                                        <h3 className="text-white font-semibold text-lg">{product.name}</h3>
                                        <p className="text-white/90 text-sm">{product.brand}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50">
                                    <div className="flex items-baseline gap-2">
                                        <p className={`text-xl font-bold ${isDiscounted ? 'text-brand-lilac-dark' : 'text-black'}`}>{formatCurrency(product.price, currency)}</p>
                                        {isDiscounted && (
                                            <p className="text-sm text-gray-500 line-through">{formatCurrency(product.regularPrice!, currency)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </section>
    );
};

export default HeroCarousel;