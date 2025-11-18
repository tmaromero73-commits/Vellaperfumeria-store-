import React, { useState, useCallback } from 'react';
import type { Product } from './types';
import type { Currency } from './currency';
import Hotspot from './Hotspot';
import { catalogData } from './catalogData';

// Icons
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

interface InteractiveCatalogProps {
    currency: Currency;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onProductSelect: (product: Product) => void;
    onQuickView: (product: Product) => void;
    onCartClick: () => void;
}

const InteractiveCatalog: React.FC<InteractiveCatalogProps> = ({ currency, onAddToCart }) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const nextPage = useCallback(() => {
        setCurrentPageIndex(prev => (prev === catalogData.length - 1 ? 0 : prev + 1));
    }, []);

    const prevPage = () => {
        setCurrentPageIndex(prev => (prev === 0 ? catalogData.length - 1 : prev - 1));
    };

    const currentPage = catalogData[currentPageIndex];

    return (
        <div className="relative w-full max-w-4xl aspect-[4/3] mx-auto bg-gray-100 rounded-lg shadow-2xl overflow-hidden group border">
            {/* Pages */}
            {catalogData.map((page, index) => (
                <div
                    key={page.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentPageIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    {page.isVideo && page.videoUrl ? (
                        <video
                            src={page.videoUrl}
                            className="w-full h-full object-cover"
                            playsInline
                            autoPlay
                            muted
                            loop
                            // Only play when the video page is active
                            key={currentPageIndex === index ? 'playing' : 'paused'}
                        />
                    ) : (
                        <img src={page.imageUrl} alt={`Página ${page.id} del catálogo`} className="w-full h-full object-cover" />
                    )}
                </div>
            ))}

            {/* Hotspots for the current page */}
            <div className="absolute inset-0">
                {currentPage.hotspots.map((hotspot, index) => (
                    <Hotspot
                        key={index}
                        data={hotspot}
                        currency={currency}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>

            {/* Navigation */}
            <button 
                onClick={prevPage}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Página anterior"
            >
                <ChevronLeftIcon />
            </button>
            <button 
                onClick={nextPage}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Página siguiente"
            >
                <ChevronRightIcon />
            </button>

            {/* Page Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {catalogData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentPageIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white'}`}
                        aria-label={`Ir a la página ${index + 1}`}
                    />
                ))}
            </div>
             {/* Page Counter */}
            <div className="absolute bottom-4 right-4 bg-black/40 text-white text-xs font-semibold px-2 py-1 rounded-md">
                {currentPageIndex + 1} / {catalogData.length}
            </div>
        </div>
    );
};

export default InteractiveCatalog;
