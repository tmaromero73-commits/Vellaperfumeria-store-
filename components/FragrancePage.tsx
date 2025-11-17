import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from './types';
import type { Currency } from './currency';
import { allProducts } from './products';

const FilterIcon = () => (
    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V16a1 1 0 01-.293.707l-2 2A1 1 0 0113 18v-2.586l-4-4V7.414L3.707 6.707A1 1 0 013 6V4z" />
    </svg>
);

const SortIcon = () => (
    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
);

const subCategories = [
    'Todos',
    'Perfumes y fragancias',
    'Cremas Perfumadas',
    'Fragancias de viaje',
    'Brumas aromáticas',
    'Desodorantes y roll-ons'
];

const FragrancePage: React.FC<{
    currency: Currency;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onProductSelect: (product: Product) => void;
    onQuickView: (product: Product) => void;
    onCartClick: () => void;
}> = ({ currency, onAddToCart, onProductSelect, onQuickView, onCartClick }) => {
    
    const [sortOrder, setSortOrder] = useState('menu_order');
    const [activeSubCategory, setActiveSubCategory] = useState('Todos');

    const pageProducts = useMemo(() => {
        const baseProducts = allProducts.filter(p => 
            p.category === 'perfume' || 
            (p.category === 'personal-care' && p.name.toLowerCase().includes('perfumada'))
        );

        let filteredProducts: Product[];
        switch (activeSubCategory) {
            case 'Perfumes y fragancias':
                filteredProducts = baseProducts.filter(p => (p.name.includes('Eau de Parfum') || p.name.includes('Perfume') || p.name.includes('Eau de Toilette')) && !p.name.includes('Tamaño Viaje') && p.category === 'perfume');
                break;
            case 'Cremas Perfumadas':
                filteredProducts = baseProducts.filter(p => p.name.includes('Crema Corporal Perfumada'));
                break;
            case 'Fragancias de viaje':
                filteredProducts = baseProducts.filter(p => p.name.includes('Tamaño Viaje'));
                break;
            case 'Todos':
                filteredProducts = baseProducts;
                break;
            case 'Brumas aromáticas':
            case 'Desodorantes y roll-ons':
            default:
                filteredProducts = [];
        }
        
        let sorted = [...filteredProducts];
        switch (sortOrder) {
            case 'popularity':
                sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
                break;
            case 'rating':
                sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'price':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'menu_order':
            default:
                 return filteredProducts;
        }
        return sorted;
    }, [activeSubCategory, sortOrder]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(e.target.value);
    };

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold text-brand-primary">Fragancias</h1>
                </div>

                {/* Sub-category Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <div className="flex space-x-6 overflow-x-auto pb-2 -mb-px">
                        {subCategories.map(catName => (
                            <button
                                key={catName}
                                onClick={() => setActiveSubCategory(catName)}
                                className={`whitespace-nowrap py-3 px-1 text-sm font-semibold transition-colors border-b-2 ${
                                    activeSubCategory === catName ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-brand-primary hover:border-gray-300'
                                }`}
                            >
                                {catName}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <button className="flex items-center px-4 py-2 bg-white rounded-md border shadow-sm text-sm font-semibold hover:bg-gray-50">
                            <FilterIcon /> Filtrar
                        </button>
                        <div className="relative flex items-center">
                            <SortIcon />
                            <select
                                value={sortOrder}
                                onChange={handleSortChange}
                                className="pl-8 pr-4 py-2 border rounded-md shadow-sm text-sm font-semibold appearance-none bg-white"
                                aria-label="Ordenar productos"
                            >
                                <option value="menu_order">Recomendado</option>
                                <option value="popularity">Popularidad</option>
                                <option value="rating">Valoración</option>
                                <option value="price">Precio: bajo a alto</option>
                                <option value="price-desc">Precio: alto a bajo</option>
                            </select>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{pageProducts.length} productos</p>
                </div>
                
                {pageProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                        {pageProducts.map(p => <ProductCard key={p.id} product={p} currency={currency} onAddToCart={onAddToCart} onProductSelect={onProductSelect} onQuickView={onQuickView} onCartClick={onCartClick}/>)}
                    </div>
                ) : (
                     <div className="text-center py-16">
                        <h3 className="text-xl font-semibold text-gray-800">Próximamente...</h3>
                        <p className="mt-2 text-gray-600">
                            No hay productos en esta categoría todavía.
                        </p>
                    </div>
                )}


                <div className="text-center py-4 border-t border-gray-200 mt-8">
                     <p className="text-sm text-gray-700">Mostrando {pageProducts.length} de {pageProducts.length} productos</p>
                </div>
            </div>
        </div>
    );
};

export default FragrancePage;