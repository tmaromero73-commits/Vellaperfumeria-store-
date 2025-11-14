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
    
    const isDiscounted = product.regularPrice && product.regularPrice > product.price;

    return (
        <div className="bg-white rounded-lg overflow-hidden flex flex-col group border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="relative cursor-pointer" onClick={() => onProductSelect(product)} role="button" aria-label={`Ver detalles de ${product.name}`}>
                <div className="w-full aspect-square flex items-center justify-center p-2 bg-white">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                </div>
                
                {isDiscounted && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full uppercase tracking-wider">
                        Oferta
                    </div>
                )}
                
                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onQuickView(product);
                        }}
                        className="bg-white text-black font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-gray-200 transition-transform transform group-hover:scale-100 scale-90"
                        aria-label={`Vista rápida de ${product.name}`}
                    >
                        Vista Rápida
                    </button>
                </div>
            </div>
            <div className="p-4 text-center flex flex-col flex-grow bg-white">
                <h3 
                    className="text-base font-semibold text-brand-primary mt-1 flex-grow cursor-pointer"
                    onClick={() => onProductSelect(product)}
                >
                    {product.name}
                </h3>
                <div className="mt-2 flex items-baseline justify-center gap-2">
                    <p className={`text-lg font-bold ${isDiscounted ? 'text-red-600' : 'text-brand-primary'}`}>{formatCurrency(product.price, currency)}</p>
                    {isDiscounted && (
                        <p className="text-sm text-gray-400 line-through">{formatCurrency(product.regularPrice!, currency)}</p>
                    )}
                </div>
                <button
                    ref={btnRef}
                    onClick={() => onAddToCart(product, btnRef.current, null)}
                    className="w-full mt-4 bg-brand-primary text-white font-semibold py-2.5 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm"
                    aria-label={`Añadir ${product.name} al carrito`}
                >
                    Añadir al carrito
                </button>
            </div>
        </div>
    );
};