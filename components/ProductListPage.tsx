
import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from './types';
import type { Currency } from './currency';
import { allProducts } from './products';

type Category = Product['category'];

const CATEGORIES: { id: Category; name: string }[] = [
    { id: 'makeup', name: 'Maquillaje' },
    { id: 'skincare', name: 'Cuidado Facial' },
    { id: 'hair', name: 'Cuidado Capilar' },
    { id: 'perfume', name: 'Perfumes' },
    { id: 'personal-care', name: 'Cuidado Personal' },
    { id: 'wellness', name: 'Wellness' },
    { id: 'men', name: 'Hombre' },
    { id: 'accessories', name: 'Accesorios' },
];


const ProductListPage: React.FC<{
    currency: Currency;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onProductSelect: (product: Product) => void;
    onQuickView: (product: Product) => void;
}> = ({ currency, onAddToCart, onProductSelect, onQuickView }) => {
    
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'all') {
            return allProducts;
        }
        return allProducts.filter(product => product.category === selectedCategory);
    }, [selectedCategory]);

    const handleCategoryClick = (categoryId: Category | 'all') => {
        setSelectedCategory(categoryId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div 
                className="bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-lg p-8 md:p-12 mb-12 text-center"
            >
                <h1 className="text-4xl font-extrabold text-black tracking-tight">Nuestra Tienda</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
                    Explora nuestra colección de fragancias, maquillaje y cuidado personal. Calidad y exclusividad en cada artículo.
                </p>
            </div>

            {/* Category Filters */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-center mb-6">Explora por Categoría</h2>
                <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                     <button
                        onClick={() => handleCategoryClick('all')}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${selectedCategory === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                    >
                        Todos
                    </button>
                    {CATEGORIES.map(category => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${selectedCategory === category.id ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
                    {filteredProducts.map((product, index) => (
                        <div 
                            key={product.id}
                            className={index === 0 && filteredProducts.length > 3 ? 'col-span-2 row-span-2' : ''}
                        >
                            <ProductCard
                                product={product}
                                currency={currency}
                                onAddToCart={onAddToCart}
                                onProductSelect={onProductSelect}
                                onQuickView={onQuickView}
                                isFeatured={index === 0 && filteredProducts.length > 3}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-600">No se encontraron productos en esta categoría.</p>
                </div>
            )}
        </div>
    );
};

export default ProductListPage;
