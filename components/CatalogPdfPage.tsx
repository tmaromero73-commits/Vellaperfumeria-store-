import React from 'react';
import { ProductCard } from './ProductCard';
import { allProducts } from './products';
import type { Product } from './types';
import type { Currency } from './currency';

const PDF_VIEWER_URL = 'https://vellaperfumeria.com/wp-content/plugins/pdf-viewer-block/inc/pdfjs/web/viewer.html?file=https://vellaperfumeria.com/wp-content/uploads/2025/10/2025015.pdf';
const PDF_DIRECT_LINK = 'https://vellaperfumeria.com/wp-content/uploads/2025/10/2025015.pdf';

const featuredProductIds = [38497, 46901, 12760, 46989, 202, 41043];
const featuredProducts = allProducts.filter(p => featuredProductIds.includes(p.id));

interface CatalogPdfPageProps {
    currency: Currency;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onProductSelect: (product: Product) => void;
    onQuickView: (product: Product) => void;
}

const CatalogPdfPage: React.FC<CatalogPdfPageProps> = ({ currency, onAddToCart, onProductSelect, onQuickView }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-black tracking-tight">Catálogo Digital</h1>
                <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
                    Explora nuestro catálogo más reciente y compra tus favoritos directamente desde aquí.
                </p>
            </div>
            <div className="relative w-full h-[700px] max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-2xl overflow-hidden border">
                <iframe
                    src={PDF_VIEWER_URL}
                    title="Catálogo Vellaperfumeria"
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                />
                 <div className="absolute inset-0 pointer-events-none border-4 border-white rounded-lg"></div>
            </div>
             <div className="text-center mt-8">
                <a
                    href={PDF_DIRECT_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-black font-semibold hover:text-fuchsia-600 transition-colors hover-underline-effect"
                >
                    Abrir catálogo en una nueva pestaña &rarr;
                </a>
            </div>

            {featuredProducts.length > 0 && (
                <section className="mt-20">
                    <h2 className="text-3xl font-extrabold text-black tracking-tight text-center mb-10">Destacados del Catálogo</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
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

export default CatalogPdfPage;