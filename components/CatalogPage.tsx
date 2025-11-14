import React from 'react';
import { allProducts } from './products';
import type { Product } from './types';
import type { Currency } from './currency';
import { ProductCard } from './ProductCard';

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

interface CatalogPageProps {
    currency: Currency;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onProductSelect: (product: Product) => void;
    onQuickView: (product: Product) => void;
}

const CatalogPage: React.FC<CatalogPageProps> = ({ currency, onAddToCart, onProductSelect, onQuickView }) => {
    const catalogUrl = "https://issuu.com/catalogos.virtuales/docs/oriflame_catalogo_12_2024_es";
    
    const catalogPages = [
        'https://storage.googleapis.com/aistudio-public/gallery/3c8c7283-f36b-4f7c-9b6f-7f6b49e25d2c.jpg',
        'https://storage.googleapis.com/aistudio-public/gallery/53b4971c-43f1-4f1e-9243-7848f22316f8.jpg',
        'https://storage.googleapis.com/aistudio-public/gallery/132c3f6d-7c2a-4f51-8a8b-08f335c05d7b.jpg'
    ];
    
    const featuredProducts = allProducts.filter(p => p.id === 214 || p.id === 46901 || p.id === 202);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-black tracking-tight">Catálogo Digital Oriflame</h1>
                <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
                    Explora nuestro catálogo más reciente para descubrir las últimas novedades, ofertas exclusivas y tus productos favoritos.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                     <a
                        href={catalogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-fuchsia-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-fuchsia-700 transition-colors duration-300"
                    >
                        <DownloadIcon />
                        Descargar PDF
                    </a>
                    <a
                        href={catalogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-white text-black font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300 border border-gray-300"
                    >
                        <EyeIcon />
                        Ver Catálogo Completo Online
                    </a>
                </div>
            </div>
            
            <div className="mb-16">
                 <h2 className="text-2xl font-bold text-center mb-6">Un Vistazo al Interior</h2>
                 <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                    {catalogPages.map((pageUrl, index) => (
                         <div key={index} className="snap-center flex-shrink-0 w-3/4 md:w-1/3">
                            <a href={catalogUrl} target="_blank" rel="noopener noreferrer" className="block rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                                <img src={pageUrl} alt={`Página ${index + 1} del catálogo`} className="w-full h-auto" />
                            </a>
                        </div>
                    ))}
                </div>
                 <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            </div>

            {featuredProducts.length > 0 && (
                <section>
                    <h2 className="text-3xl font-bold text-center mb-10">Compra desde el Catálogo</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {featuredProducts.map(product => (
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
            )}
        </div>
    );
};

export default CatalogPage;