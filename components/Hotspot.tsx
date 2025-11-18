import React, { useState, useRef, useEffect } from 'react';
import type { Product } from './types';
import type { Currency } from './currency';
import { formatCurrency } from './currency';
import { allProducts } from './products';
import type { HotspotData } from './catalogData';

const CartPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

interface HotspotProps {
    data: HotspotData;
    currency: Currency;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
}

const Hotspot: React.FC<HotspotProps> = ({ data, currency, onAddToCart }) => {
    const [isOpen, setIsOpen] = useState(false);
    const product = allProducts.find(p => p.id === data.productId);
    const btnRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node) && btnRef.current && !btnRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);


    if (!product) return null;

    const popoverClasses = () => {
        let classes = 'absolute z-20 transform ';
        // Position popover based on hotspot location to keep it in view
        classes += data.y > 60 ? 'bottom-full mb-3 ' : 'top-full mt-3 ';
        classes += data.x > 50 ? 'right-0 ' : 'left-0 ';
        return classes;
    };


    return (
        <div
            className="absolute z-10"
            style={{ left: `${data.x}%`, top: `${data.y}%`, transform: 'translate(-50%, -50%)' }}
        >
            <button
                ref={btnRef}
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
                aria-label={`Ver producto ${product.name}`}
            >
                <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-brand-purple-dark"></span>
                </span>
            </button>

            {isOpen && (
                <div className={popoverClasses()} ref={popoverRef}>
                     <div className="bg-white rounded-lg shadow-2xl w-64 overflow-hidden border animate-fade-in-up">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-contain p-2" />
                        <div className="p-3">
                            <h4 className="font-bold text-sm truncate">{product.name}</h4>
                            <p className="text-gray-600 text-xs mb-2">{product.brand}</p>
                            <p className="font-bold text-lg mb-3">{formatCurrency(product.price, currency)}</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToCart(product, e.currentTarget, null);
                                    setIsOpen(false);
                                }}
                                className="w-full bg-brand-purple text-brand-primary font-semibold py-2 px-3 rounded-md hover:bg-brand-purple-dark transition-colors text-sm flex items-center justify-center"
                            >
                                <CartPlusIcon /> Añadir
                            </button>
                        </div>
                    </div>
                </div>
            )}
             <style>
                {`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.2s ease-out forwards;
                }
                `}
            </style>
        </div>
    );
};

export default Hotspot;
