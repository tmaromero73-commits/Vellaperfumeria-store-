import React from 'react';
import type { Product } from './types';
import type { Currency } from './currency';

const CATALOGUE_URL = 'https://es-catalogue.oriflame.com/oriflame/es/2025015-brp';

// The props are no longer used by this component but are kept in the function signature
// to avoid breaking the parent component (App.tsx) which passes them.
interface CatalogPageProps {
    currency: Currency;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
}

const CatalogPage: React.FC<CatalogPageProps> = (props) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-black tracking-tight">Catálogo BeautyShopVella</h1>
                <p className="mt-2 text-lg text-gray-600">Explora nuestro catálogo más reciente para descubrir ofertas y novedades.</p>
            </div>
            
            <div 
                className="relative w-full max-w-5xl mx-auto aspect-[4/3] bg-gray-100 rounded-lg shadow-2xl overflow-hidden border border-gray-200" 
                style={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}
            >
                 <iframe
                    src={`${CATALOGUE_URL}?page=1`}
                    title="Catálogo Digital BeautyShopVella"
                    className="w-full"
                    style={{ height: 'calc(100% + 56px)', transform: 'translateY(-56px)' }}
                    frameBorder="0"
                    allowFullScreen
                    aria-label="Visor del catálogo digital interactivo"
                 />
            </div>
        </div>
    );
};

export default CatalogPage;
