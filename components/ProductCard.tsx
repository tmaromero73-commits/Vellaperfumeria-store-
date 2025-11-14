

import React, { useRef, useState } from 'react';
import { type Currency, formatCurrency } from './currency';
import type { Product } from './types';

const HeartIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);

export const ProductCard: React.FC<{
    product: Product;
    currency: Currency;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onProductSelect: (product: Product) => void;
    onQuickView: (product: Product) => void;
    isFeatured?: boolean;
}> = ({ product, currency, onAddToCart, onProductSelect, onQuickView, isFeatured = false }) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const imageContainerClasses = isFeatured ? 'h-96' : 'h-56';
    const headingClasses = isFeatured ? 'text-lg md:text-xl' : 'text-sm';
    
    const isDiscounted = product.regularPrice && product.regularPrice > product.price;
    const discountPercentage = isDiscounted
        ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
        : 0;

    return (
        <div className={`bg-white rounded-lg shadow-sm overflow-hidden flex flex-col group border border-gray-200/80 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isFeatured ? 'h-full' : ''}`}>
            <div className="relative cursor-pointer" onClick={() => onProductSelect(product)} role="button" aria-label={`Ver detalles de ${product.name}`}>
                <div className={`w-full ${imageContainerClasses} flex items-center justify-center p-4 bg-white`}>
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                </div>
                
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {discountPercentage > 0 && (
                        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            -{discountPercentage}%
                        </div>
                    )}
                    {product.tag && (
                        <div className="bg-black text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            {product.tag}
                        </div>
                    )}
                </div>
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsWishlisted(!isWishlisted);
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white transition-colors"
                    aria-label={isWishlisted ? "Quitar de la lista de deseos" : "Añadir a la lista de deseos"}
                >
                    <HeartIcon className={isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'} />
                </button>
                
                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onQuickView(product);
                        }}
                        className="bg-black text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-gray-800 transition-transform transform group-hover:scale-100 scale-90"
                        aria-label={`Vista rápida de ${product.name}`}
                    >
                        Vista Rápida
                    </button>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow bg-white">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{product.brand}</p>
                <h3 
                    className={`${headingClasses} font-semibold text-black mt-1 flex-grow cursor-pointer hover:text-gray-700`}
                    onClick={() => onProductSelect(product)}
                >
                    {product.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                    <p className={`${isFeatured ? 'text-2xl' : 'text-lg'} font-bold ${isDiscounted ? 'text-brand-lilac-dark' : 'text-black'}`}>{formatCurrency(product.price, currency)}</p>
                    {isDiscounted && (
                        <p className="text-sm text-gray-500 line-through">{formatCurrency(product.regularPrice!, currency)}</p>
                    )}
                </div>
                <button
                    ref={btnRef}
                    onClick={() => onAddToCart(product, btnRef.current, null)}
                    className="w-full mt-4 bg-brand-lilac text-black font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-brand-lilac-dark transition-colors text-sm"
                    aria-label={`Añadir ${product.name} al carrito`}
                >
                    Añadir al carrito
                </button>
            </div>
        </div>
    );
};