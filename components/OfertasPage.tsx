
import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from './types';
import type { Currency } from './currency';
import { allProducts } from './products';
import SpecialOffersCarousel from './SpecialOffersCarousel';

// Acondicionadores Duologi (La Oferta)
const conditionerIds = [44960, 44961];
const conditionerProducts = allProducts.filter(p => conditionerIds.includes(p.id));

// Resto de productos Duologi
const otherDuologiProducts = allProducts.filter(p => p.brand === 'DUOLOGI' && !conditionerIds.includes(p.id));

// Productos Selección (Trigger Products) - Excluimos los acondicionadores
const triggerProductIds = [
    47440, 46987, 47009, // Love Nature Simple Joys
    46642, 46731, 45799, 45800, 47450, // Essense & Co
    46801, // Divine Dark Velvet
    46968, 46969, 46970, 46971, // Milk & Honey
    36151, // Tender Care
    47878, // Esponja
    47677, // Cepillo
    47202, // Crema Manos Pasión
];
const triggerProducts = allProducts.filter(p => triggerProductIds.includes(p.id));

// Otros productos de regalo (Backup)
const giftProductIds = [153756, 153757, 48649, 47536, 47538, 20374, 104, 38497, 46901, 22442, 1440];
const giftProducts = allProducts.filter(p => giftProductIds.includes(p.id));


const OfertasPage: React.FC<{
    currency: Currency;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onQuickAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onProductSelect: (product: Product) => void;
    onQuickView: (product: Product) => void;
}> = ({ currency, onAddToCart, onQuickAddToCart, onProductSelect, onQuickView }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-black tracking-tight">Ofertas Especiales</h2>
                <p className="mt-2 text-lg text-gray-600 font-semibold">Promociones exclusivas para ti.</p>
            </div>
            
            {/* Carousel Component */}
            <SpecialOffersCarousel onProductSelect={onProductSelect} />

            {/* Section 1: The Reward (Conditioners) */}
            <div className="mb-16">
                 <div className="flex items-center gap-2 mb-6">
                    <span className="bg-brand-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-md">1</span>
                    <h3 className="text-2xl font-bold text-black">Elige tu Acondicionador a 6,99€</h3>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-purple-50/30 p-6 rounded-xl shadow-sm border border-purple-100">
                    {conditionerProducts.map(product => (
                        <div key={product.id} className="relative">
                             <div className="absolute top-2 right-2 z-10 bg-brand-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                OFERTA 6,99€
                            </div>
                            <ProductCard
                                product={product}
                                currency={currency}
                                onAddToCart={onAddToCart}
                                onQuickAddToCart={onQuickAddToCart}
                                onProductSelect={onProductSelect}
                                onQuickView={onQuickView}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 2: The Trigger List */}
            <div className="mb-16" id="seleccion-oferta">
                 <div className="flex items-center gap-2 mb-6">
                    <span className="bg-purple-300 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-md">2</span>
                    <h3 className="text-2xl font-bold text-black">Productos Selección: Compra uno y activa la oferta</h3>
                 </div>
                 <p className="text-gray-600 mb-6 ml-10 text-lg">Añade cualquiera de estos productos a tu cesta para disfrutar del precio especial en los acondicionadores.</p>
                 
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {triggerProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            currency={currency}
                            onAddToCart={onAddToCart}
                            onQuickAddToCart={onQuickAddToCart}
                            onProductSelect={onProductSelect}
                            onQuickView={onQuickView}
                        />
                    ))}
                </div>
            </div>

            {/* Other Offers */}
             {otherDuologiProducts.length > 0 && (
                <div className="mb-16">
                    <h3 className="text-xl font-bold text-black mb-6 border-b border-purple-100 pb-2 text-brand-primary">Más ofertas Duologi</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {otherDuologiProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                currency={currency}
                                onAddToCart={onAddToCart}
                                onQuickAddToCart={onQuickAddToCart}
                                onProductSelect={onProductSelect}
                                onQuickView={onQuickView}
                            />
                        ))}
                    </div>
                </div>
            )}

             {giftProducts.length > 0 && (
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-black mb-6 border-b border-purple-100 pb-2 text-brand-primary">Otras Ideas para Regalar</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {giftProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                currency={currency}
                                onAddToCart={onAddToCart}
                                onQuickAddToCart={onQuickAddToCart}
                                onProductSelect={onProductSelect}
                                onQuickView={onQuickView}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfertasPage;
