
import React, { useRef, useState } from 'react';
import { type Currency, formatCurrency } from './currency';
import type { Product } from './types';

// --- ICONS ---
const QuickBuyIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const HeartIcon: React.FC<{isFilled: boolean}> = ({ isFilled }) => (
    <svg className="h-6 w-6" fill={isFilled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


export const ProductCard: React.FC<{
    product: Product;
    currency: Currency;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onProductSelect: (product: Product) => void;
    onQuickView: (product: Product) => void;
    onCartClick: () => void;
}> = ({ product, currency, onAddToCart, onProductSelect, onQuickView, onCartClick }) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const isDiscounted = product.regularPrice && product.regularPrice > product.price;

    const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        // Redirect to the cart page to reliably add the item before checkout.
        window.top.location.href = `https://vellaperfumeria.com/cart/?add-to-cart=${product.id}&quantity=1`;
    };

    const handleQuickBuy = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onAddToCart(product, e.currentTarget, null);
    };

    const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsWishlisted(prev => !prev);
    };

    const renderStars = () => {
        if (!product.rating) return null;
        const fullStars = Math.floor(product.rating);
        const halfStar = product.rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <div className="flex items-center" title={`${product.rating}/5 ★`}>
                {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} className="text-amber-400" />)}
                {halfStar && <StarIcon key="half" className="text-amber-400" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)' }} />}
                {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} className="text-gray-300" />)}
            </div>
        );
    };

    return (
        <div 
            className="bg-white rounded-lg flex flex-col group border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full"
            onClick={() => onProductSelect(product)}
        >
            <div className="relative cursor-pointer overflow-hidden rounded-t-lg">
                <img src={product.imageUrl} alt={product.name} className="w-full aspect-square object-contain p-2 transition-transform duration-300 group-hover:scale-105" />

                {/* Hover Overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={handleQuickBuy}
                        className="bg-white/80 backdrop-blur-sm p-2.5 rounded-full text-black hover:bg-white shadow-md transition-all transform hover:scale-110"
                        aria-label={`Compra rápida de ${product.name}`}
                    >
                        <QuickBuyIcon />
                    </button>
                    <button
                        onClick={handleToggleWishlist}
                        className={`p-2.5 rounded-full text-black shadow-md transition-all transform hover:scale-110 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur-sm hover:bg-white'}`}
                        aria-label="Añadir a favoritos"
                    >
                        <HeartIcon isFilled={isWishlisted} />
                    </button>
                </div>
            </div>

            <div className="p-3 text-left flex flex-col flex-grow">
                {product.rating && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        {renderStars()}
                        <span>({product.reviewCount})</span>
                    </div>
                )}
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{product.brand}</span>
                <h3 className="text-sm font-semibold text-brand-primary mt-1 flex-grow cursor-pointer min-h-10">
                    {product.name}
                </h3>
                
                {product.variants?.Tono && (
                    <div className="flex items-center gap-1 mt-3 h-5">
                        {product.variants.Tono.slice(0, 6).map(v => (
                            <span key={v.value} className="block w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: v.colorCode }} title={v.value}></span>
                        ))}
                        {product.variants.Tono.length > 6 && <span className="text-xs text-gray-500 font-semibold">+{product.variants.Tono.length - 6}</span>}
                    </div>
                )}
                
                <div className="mt-3 flex items-baseline justify-start gap-2">
                    <p className={`text-lg font-bold ${isDiscounted ? 'text-red-600' : 'text-brand-primary'}`}>{formatCurrency(product.price, currency)}</p>
                    {isDiscounted && (
                        <p className="text-sm text-gray-400 line-through">{formatCurrency(product.regularPrice!, currency)}</p>
                    )}
                </div>
                
                <div className="mt-4 flex flex-col gap-2">
                     <button
                        ref={btnRef}
                        onClick={(e) => { e.stopPropagation(); onAddToCart(product, btnRef.current, null); }}
                        className="w-full bg-brand-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm"
                        aria-label={`Añadir ${product.name} al carrito`}
                    >
                        Añadir al carrito
                    </button>
                    <button
                        onClick={handleBuyNow}
                        className="w-full bg-gray-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-black transition-colors text-sm"
                        aria-label={`Comprar ahora ${product.name}`}
                    >
                        Comprar ahora
                    </button>
                </div>
            </div>
        </div>
    );
};
