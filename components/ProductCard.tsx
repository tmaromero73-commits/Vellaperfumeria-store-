
import React, { useRef, useState } from 'react';
import { type Currency, formatCurrency } from './currency';
import type { Product } from './types';

// --- ICONS ---
const HeartIcon: React.FC<{isFilled: boolean}> = ({ isFilled }) => (
    <svg className={`h-6 w-6 transition-colors duration-300 ${isFilled ? 'text-purple-500 fill-current' : 'text-gray-400'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);

const StarIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
    <svg className={`w-3 h-3 ${className}`} style={style} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const EyeIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

interface ProductCardProps {
    product: Product;
    currency: Currency;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onQuickAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onProductSelect: (product: Product) => void;
    onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, currency, onAddToCart, onQuickAddToCart, onProductSelect, onQuickView }) => {
    const [isWishlist, setIsWishlist] = useState(false);
    const addToCartBtnRef = useRef<HTMLButtonElement>(null);

    const isDiscounted = product.regularPrice && product.regularPrice > product.price;
    const discountPercentage = isDiscounted
        ? Math.round(((product.regularPrice! - product.price) / product.regularPrice!) * 100)
        : 0;

    const hasManyVariants = product.variants && (Object.keys(product.variants).length > 1 || (product.variants['Color'] && product.variants['Color'].length > 4));

    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (product.stock === 0) return;

        if (hasManyVariants) {
            onProductSelect(product);
        } else {
            // Default variant selection logic for quick add
            let defaultVariant = null;
            if (product.variants) {
                defaultVariant = {};
                for (const key in product.variants) {
                     if (product.variants[key].length > 0) {
                        defaultVariant[key] = product.variants[key][0].value;
                     }
                }
            }
            onQuickAddToCart(product, addToCartBtnRef.current, defaultVariant);
        }
    };

    return (
        <div 
            className="group relative bg-white border border-purple-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            role="article"
            aria-label={`Producto: ${product.name}`}
        >
            {/* Badge Section */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {product.tag && (
                    <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                        {product.tag}
                    </span>
                )}
                {isDiscounted && (
                    <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                        -{discountPercentage}%
                    </span>
                )}
                {product.isShippingSaver && (
                    <span className="bg-orange-300 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                        ENVÍO GRATIS
                    </span>
                )}
            </div>

            {/* Wishlist Button */}
            <button 
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors text-purple-300 hover:text-purple-500"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsWishlist(!isWishlist);
                }}
                aria-label={isWishlist ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
                <HeartIcon isFilled={isWishlist} />
            </button>

            {/* Image Section */}
            <div 
                className="relative aspect-square overflow-hidden bg-gradient-to-b from-white to-[#FAF5FF] cursor-pointer"
                onClick={() => onProductSelect(product)}
            >
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                
                {/* Quick View Overlay Button (Desktop) */}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex justify-center">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onQuickView(product);
                        }}
                        className="bg-white/90 backdrop-blur-sm text-purple-600 hover:text-purple-700 text-sm font-bold py-2 px-4 rounded-full shadow-lg hover:bg-purple-50 transition-colors flex items-center gap-2 border border-purple-100"
                    >
                        <EyeIcon /> Vista Rápida
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-1 flex justify-between items-start">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{product.brand}</span>
                    {product.rating && (
                        <div className="flex items-center gap-1">
                            <StarIcon className="text-amber-300" />
                            <span className="text-xs font-medium text-gray-500">{product.rating}</span>
                        </div>
                    )}
                </div>

                <h3 
                    className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition-colors cursor-pointer"
                    onClick={() => onProductSelect(product)}
                >
                    {product.name}
                </h3>

                {/* Price Section */}
                <div className="mt-auto pt-2">
                     <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-lg font-bold ${isDiscounted ? 'text-purple-600' : 'text-gray-900'}`}>
                            {formatCurrency(product.price, currency)}
                        </span>
                        {isDiscounted && (
                            <span className="text-sm text-gray-400 line-through decoration-purple-200">
                                {formatCurrency(product.regularPrice!, currency)}
                            </span>
                        )}
                    </div>

                    {/* Action Button */}
                    <button
                        ref={addToCartBtnRef}
                        onClick={handleActionClick}
                        disabled={product.stock === 0}
                        className={`w-full mt-3 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md ${
                            product.stock === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-[#E9D5FF] text-black hover:bg-[#D8B4FE] hover:shadow-purple-200 transform hover:-translate-y-0.5'
                        }`}
                    >
                        {product.stock === 0 
                            ? 'Agotado' 
                            : hasManyVariants 
                                ? 'Ver Opciones' 
                                : 'Añadir'}
                    </button>
                </div>
            </div>
        </div>
    );
};
