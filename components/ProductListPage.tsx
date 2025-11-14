import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from './types';
import type { Currency } from './currency';
import { allProducts } from './products';

const ProductListPage: React.FC<{
    currency: Currency;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onProductSelect: (product: Product) => void;
    onQuickView: (product: Product) => void;
}> = ({ currency, onAddToCart, onProductSelect, onQuickView }) => {
    
    const [sortOrder, setSortOrder] = useState('menu_order');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    const sortedProducts = useMemo(() => {
        let sorted = [...allProducts];
        switch (sortOrder) {
            case 'popularity':
                sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
                break;
            case 'rating':
                sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'date':
                // Assuming newer products are at the start of the array
                sorted.reverse();
                break;
            case 'price':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'menu_order':
            default:
                // Default order is as is in products.ts
                break;
        }
        return sorted;
    }, [sortOrder]);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return sortedProducts.slice(startIndex, startIndex + productsPerPage);
    }, [currentPage, sortedProducts]);

    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const firstItemIndex = (currentPage - 1) * productsPerPage + 1;
    const lastItemIndex = Math.min(currentPage * productsPerPage, sortedProducts.length);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(e.target.value);
        setCurrentPage(1); // Reset to first page on sort change
    };
    
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-brand-primary tracking-tight mb-8">Shop</h1>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 p-4 bg-white rounded-lg shadow-sm border">
                <p className="text-sm text-gray-700">
                    Mostrando {firstItemIndex}–{lastItemIndex} de {sortedProducts.length} resultados
                </p>
                <form className="woocommerce-ordering">
                    <select 
                        name="orderby" 
                        className="orderby border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-brand-pink-dark focus:border-brand-pink-dark bg-white"
                        aria-label="Pedido de la tienda"
                        value={sortOrder}
                        onChange={handleSortChange}
                    >
                        <option value="menu_order">Orden predeterminado</option>
                        <option value="popularity">Ordenar por popularidad</option>
                        <option value="rating">Ordenar por puntuación media</option>
                        <option value="date">Ordenar por los últimos</option>
                        <option value="price">Ordenar por precio: bajo a alto</option>
                        <option value="price-desc">Ordenar por precio: alto a bajo</option>
                    </select>
                </form>
            </div>

            {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
                    {paginatedProducts.map(product => (
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
            ) : (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-600">No se encontraron productos.</p>
                </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
                <nav className="flex justify-center items-center space-x-2 mt-12" aria-label="Paginación">
                    {currentPage > 1 && (
                         <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="text-gray-600 hover:text-black font-semibold py-2 px-4 rounded-md transition"
                        >
                            Página anterior
                        </button>
                    )}
                    
                    <div className="flex items-center space-x-2">
                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
                                className={`py-2 px-4 rounded-md text-sm font-medium ${
                                    currentPage === number
                                        ? 'bg-brand-primary text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border'
                                }`}
                                aria-current={currentPage === number ? 'page' : undefined}
                            >
                                {number}
                            </button>
                        ))}
                    </div>

                    {currentPage < totalPages && (
                         <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="text-gray-600 hover:text-black font-semibold py-2 px-4 rounded-md transition"
                        >
                            Página siguiente
                        </button>
                    )}
                </nav>
            )}
        </div>
    );
};

export default ProductListPage;
