
import React, { useRef, useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from './types';
import { type Currency, formatCurrency } from './currency';
import { allProducts } from './products';
import ImageLightbox from './ImageLightbox';

interface ProductDetailPageProps {
    product: Product;
    currency: Currency;
    onAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onQuickAddToCart: (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => void;
    onProductSelect: (product: Product) => void;
    onQuickView: (product: Product) => void;
}

// SVG Icons
const CloseIcon = () => (
    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const TruckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 17a2 2 0 10-4 0 2 2 0 004 0zM19 17a2 2 0 10-4 0 2 2 0 004 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h2a1 1 0 001-1V7.572a1 1 0 00-.218-.671l-1.5-2.25a1 1 0 00-.868-.451H13v11z" />
    </svg>
);

const SparklesIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m1-9l2-2 2 2m-2 4v6m2-6l2 2-2 2M15 3l2 2-2 2m-2-4v4m2 4l2 2-2 2m-8 4h12" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.475 5.422 5.571-1.469z" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
);

const TwitterIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const StarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const MagnifyPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3h-6" />
    </svg>
);


interface Review {
    author: string;
    rating: number;
    text: string;
    date: string;
}

const getDefaultVariant = (product: Product): Record<string, string> | null => {
    if (!product.variants) return null;
    const defaultVariant: Record<string, string> = {};
    for (const key in product.variants) {
        if (product.variants[key].length > 0) {
           defaultVariant[key] = product.variants[key][0].value;
        }
    }
    return defaultVariant;
};

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, currency, onAddToCart, onQuickAddToCart, onProductSelect, onQuickView }) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState('Copiar enlace');
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    const [selectedVariant, setSelectedVariant] = useState<Record<string, string> | null>(getDefaultVariant(product));
    const [currentImageUrl, setCurrentImageUrl] = useState(product.imageUrl);

    useEffect(() => {
        let variantImageUrl: string | null = null;
        if (product.variants && selectedVariant) {
            for (const variantType in product.variants) {
                const selectedValue = selectedVariant[variantType];
                if (selectedValue) {
                    const variantOption = product.variants[variantType].find(
                        v => v.value === selectedValue
                    );
                    if (variantOption?.imageUrl) {
                        variantImageUrl = variantOption.imageUrl;
                        break;
                    }
                }
            }
        }
        setCurrentImageUrl(variantImageUrl || product.imageUrl);
    }, [selectedVariant, product.variants, product.imageUrl]);

    const handleVariantChange = (variantType: string, value: string) => {
        setSelectedVariant(prev => ({ ...(prev || {}), [variantType]: value }));
    };

    const [reviews, setReviews] = useState<Review[]>([
        { author: 'Ana G.', rating: 5, text: '¡Me encanta este producto! Huele de maravilla y la calidad es excepcional. Lo compraré de nuevo sin duda.', date: '20/07/2024' },
        { author: 'Carlos M.', rating: 4, text: 'Muy buen producto, cumple con lo que promete. El envío fue rápido y todo llegó en perfecto estado.', date: '15/07/2024' },
    ]);
    const [newReview, setNewReview] = useState({ author: '', rating: 0, text: '' });
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const productUrl = window.location.href;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(productUrl).then(() => {
            setCopyButtonText('¡Copiado!');
            setTimeout(() => setCopyButtonText('Copiar enlace'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('No se pudo copiar el enlace.');
        });
    };

    const getStockInfo = (stock: number): { text: string; color: string } => {
        if (stock === 0) {
            return { text: 'Agotado', color: 'text-orange-600' };
        }
        if (stock <= 10) {
            return { text: 'Pocas unidades', color: 'text-amber-600' };
        }
        return { text: 'En stock', color: 'text-green-600' };
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newReview.author.trim() && newReview.rating > 0 && newReview.text.trim()) {
            const reviewToPublish: Review = {
                ...newReview,
                date: new Date().toLocaleDateString('es-ES'),
            };
            setReviews([reviewToPublish, ...reviews]);
            setNewReview({ author: '', rating: 0, text: '' });
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        }
    };
    
    const isReviewFormValid = newReview.author.trim() && newReview.rating > 0 && newReview.text.trim();
    const stockInfo = getStockInfo(product.stock);
    const isOutOfStock = product.stock === 0;

    const relatedProducts = allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const isDiscounted = product.regularPrice && product.regularPrice > product.price;

    return (
        <div className="container mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden md:grid md:grid-cols-5 md:gap-8 p-4 md:p-10">
                <div className="md:col-span-3">
                    <div 
                        className="relative group cursor-pointer p-6 flex justify-center items-center bg-purple-50/20 rounded-2xl border border-purple-100/50"
                        onClick={() => setIsLightboxOpen(true)}
                        role="button"
                        aria-label="Ampliar imagen del producto"
                    >
                        <img
                            src={currentImageUrl}
                            alt={product.name}
                            className="max-h-[500px] object-contain transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center rounded-2xl">
                            <div className="opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 transition-all duration-300 bg-purple-400/80 p-3 rounded-full backdrop-blur-sm">
                                <MagnifyPlusIcon />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="p-4 flex flex-col md:col-span-2">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-lg text-gray-500 uppercase tracking-wide">{product.brand}</span>
                        {product.rating && (
                            <div className="flex items-center gap-1">
                                <StarIcon className="text-amber-300 w-4 h-4" />
                                <span className="text-sm font-medium text-gray-600">{product.rating} <span className="text-gray-400">({product.reviewCount} reseñas)</span></span>
                            </div>
                        )}
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight mb-4 text-gray-900">{product.name}</h1>
                    
                    <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1 mb-6">
                        <p className={`text-4xl font-extrabold ${isDiscounted ? 'text-purple-500' : 'text-gray-900'}`}>{formatCurrency(product.price, currency)}</p>
                        {isDiscounted && (
                            <>
                                <p className="text-xl text-gray-400 line-through decoration-purple-200">{formatCurrency(product.regularPrice!, currency)}</p>
                                <span className="bg-purple-400 text-white text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm transform -translate-y-1">
                                    AHORRA {Math.round(((product.regularPrice! - product.price) / product.regularPrice!) * 100)}%
                                </span>
                            </>
                        )}
                    </div>

                    {product.isShippingSaver && (
                        <div className="flex items-center gap-3 text-orange-800 font-medium my-2 p-4 bg-orange-50 rounded-xl border border-orange-200">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <TruckIcon className="text-orange-500"/>
                            </div>
                            <span>¡Este producto te da <b>envío GRATIS</b> en todo tu pedido!</span>
                        </div>
                    )}
                    
                     {product.beautyPoints && (
                        <div className="flex items-center gap-3 text-purple-800 font-medium my-2 p-4 bg-purple-50 rounded-xl border border-purple-200">
                             <div className="bg-white p-2 rounded-full shadow-sm">
                                <SparklesIcon className="text-purple-500"/>
                            </div>
                            <span>Consigue <b>+{product.beautyPoints} Puntos Beauty</b> con este producto</span>
                        </div>
                    )}

                    {product.variants && (
                        <div className="space-y-5 my-8 pt-6 border-t border-gray-100">
                            {Object.keys(product.variants).map((type) => {
                                const options = product.variants![type];
                                if (!Array.isArray(options)) return null;

                                return (
                                    <div key={type}>
                                        <h3 className="text-sm font-bold text-gray-900 mb-3">
                                            {type}: <span className="font-normal text-gray-600">{selectedVariant?.[type]}</span>
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {options.map(option => {
                                                const isSelected = selectedVariant?.[type] === option.value;
                                                if (option.colorCode) { 
                                                    return (
                                                        <button
                                                            key={option.value}
                                                            onClick={() => handleVariantChange(type, option.value)}
                                                            className={`w-10 h-10 rounded-full border-2 transition-all ${isSelected ? 'border-purple-400 ring-2 ring-offset-2 ring-purple-200 scale-110' : 'border-gray-200 hover:border-gray-400'}`}
                                                            style={{ backgroundColor: option.colorCode }}
                                                            aria-label={`Seleccionar color ${option.value}`}
                                                            title={option.value}
                                                        />
                                                    );
                                                }
                                                return (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => handleVariantChange(type, option.value)}
                                                        className={`px-5 py-2 text-sm font-medium border rounded-lg transition-all ${isSelected ? 'bg-purple-400 text-white border-purple-500 shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
                                                    >
                                                        {option.value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    
                    <div className="mb-6 mt-auto pt-4">
                        <p className="text-sm font-semibold text-gray-600">Disponibilidad: <span className={`font-bold ${stockInfo.color}`}>{stockInfo.text}</span></p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <button
                            ref={btnRef}
                            onClick={() => {
                                if (btnRef.current && !isOutOfStock) {
                                    onAddToCart(product, btnRef.current, selectedVariant);
                                }
                            }}
                            disabled={isOutOfStock}
                            className={`w-full font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 text-lg ${isOutOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#E9D5FF] text-black hover:bg-[#D8B4FE] hover:shadow-purple-200 transform hover:-translate-y-1'}`}
                            aria-label={`Añadir ${product.name} al carrito`}
                        >
                            {isOutOfStock ? 'Agotado' : 'Añadir al carrito'}
                        </button>
                        <button
                           onClick={() => {
                               setIsShareModalOpen(true);
                               setCopyButtonText('Copiar enlace');
                           }}
                           className="w-full bg-white border-2 border-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-colors duration-300"
                           aria-label="Compartir este producto"
                        >
                           Compartir
                        </button>
                    </div>
                </div>
            </div>

            {/* Description & How to Use Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mt-8">
                <div className="flex border-b border-gray-200 mb-8">
                    <button 
                        onClick={() => setActiveTab('description')} 
                        className={`py-4 px-4 mr-4 font-bold text-base transition-all focus:outline-none border-b-4 ${activeTab === 'description' ? 'border-purple-400 text-purple-600' : 'border-transparent text-gray-500 hover:text-purple-400'}`}
                    >
                        Descripción
                    </button>
                    {product.howToUse && (
                        <button 
                            onClick={() => setActiveTab('howToUse')} 
                            className={`py-4 px-4 font-bold text-base transition-all focus:outline-none border-b-4 ${activeTab === 'howToUse' ? 'border-purple-400 text-purple-600' : 'border-transparent text-gray-500 hover:text-purple-400'}`}
                        >
                            Modo de Empleo
                        </button>
                    )}
                </div>
                <div className="text-gray-700 leading-relaxed text-lg min-h-[100px]">
                    {activeTab === 'description' && <p>{product.description}</p>}
                    {activeTab === 'howToUse' && product.howToUse && <p className="whitespace-pre-wrap">{product.howToUse}</p>}
                </div>
            </div>

             {product.category === 'skincare' && (
                <div className="text-center my-12">
                    <button 
                        onClick={() => onProductSelect(allProducts.find(p => p.category === 'skincare')!)} 
                        className="inline-block bg-purple-50 text-purple-900 font-bold py-4 px-10 rounded-full hover:bg-purple-100 transition-all shadow-sm border border-purple-200"
                    >
                        Ver todos los limpiadores y productos de Skincare
                    </button>
                </div>
            )}

            {relatedProducts.length > 0 && (
                <section className="mt-20">
                    <h2 className="text-3xl font-extrabold mb-10 text-center text-gray-900">También te puede interesar</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map(relatedProduct => (
                            <ProductCard
                                key={relatedProduct.id}
                                product={relatedProduct}
                                currency={currency}
                                onAddToCart={onAddToCart}
                                onQuickAddToCart={onQuickAddToCart}
                                onProductSelect={onProductSelect}
                                onQuickView={onQuickView}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* --- Reviews Section --- */}
            <div className="mt-16 pt-10 border-t border-gray-200">
                <h2 className="text-2xl font-bold mb-8">Valoraciones de Clientes</h2>
                
                <div className="bg-gray-50 p-8 rounded-2xl mb-10 border border-gray-100">
                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                        <h3 className="text-xl font-bold">Escribe tu opinión</h3>
                        {showSuccessMessage && (
                             <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-md" role="alert">
                                <p className="font-bold">¡Gracias!</p>
                                <p>Tu reseña ha sido publicada.</p>
                            </div>
                        )}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="reviewAuthor" className="block text-sm font-bold text-gray-700 mb-2">Tu nombre</label>
                                <input
                                    type="text"
                                    id="reviewAuthor"
                                    value={newReview.author}
                                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-shadow"
                                    required
                                />
                            </div>
                            <div>
                                 <label className="block text-sm font-bold text-gray-700 mb-2">Tu valoración</label>
                                 <div className="flex items-center gap-2 py-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none transform hover:scale-110 transition-transform"
                                            aria-label={`Valorar con ${star} estrella${star > 1 ? 's' : ''}`}
                                        >
                                            <StarIcon
                                                className={`w-8 h-8 cursor-pointer transition-colors ${
                                                    (hoverRating || newReview.rating) >= star
                                                        ? 'text-amber-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="reviewText" className="block text-sm font-bold text-gray-700 mb-2">Tu reseña</label>
                            <textarea
                                id="reviewText"
                                rows={4}
                                value={newReview.text}
                                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-shadow"
                                required
                            />
                        </div>
                        <div className="text-right">
                             <button
                                type="submit"
                                disabled={!isReviewFormValid}
                                className="bg-black text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-purple-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Publicar reseña
                            </button>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    {reviews.length > 0 ? reviews.map((review, index) => (
                        <div key={index} className="flex items-start gap-5 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                                <UserIcon />
                            </div>
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <p className="font-bold text-gray-900">{review.author}</p>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">{review.date}</p>
                                </div>
                                <p className="text-gray-700">{review.text}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 py-8">No hay reseñas para este producto todavía. ¡Sé el primero!</p>
                    )}
                </div>
            </div>

            {isShareModalOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300"
                    onClick={() => setIsShareModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="share-modal-title"
                >
                    <div 
                        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                        onClick={(e) => e.stopPropagation()}
                        style={{animation: 'fade-in-scale 0.3s forwards cubic-bezier(0.16, 1, 0.3, 1)'}}
                    >
                        <button 
                            onClick={() => setIsShareModalOpen(false)} 
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
                        >
                            <CloseIcon />
                        </button>
                        <h3 id="share-modal-title" className="text-xl font-bold mb-4 text-center">Compartir Producto</h3>
                        <div className="flex justify-center gap-4 mb-6">
                            <button className="p-3 bg-gray-100 rounded-full hover:bg-purple-100 text-gray-600 hover:text-purple-600 transition-colors"><FacebookIcon /></button>
                            <button className="p-3 bg-gray-100 rounded-full hover:bg-purple-100 text-gray-600 hover:text-purple-600 transition-colors"><TwitterIcon /></button>
                            <button className="p-3 bg-gray-100 rounded-full hover:bg-purple-100 text-gray-600 hover:text-purple-600 transition-colors"><WhatsAppIcon /></button>
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                readOnly 
                                value={productUrl} 
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pr-12 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                            <button 
                                onClick={handleCopyLink}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-700 font-bold text-sm px-2"
                            >
                                {copyButtonText === 'Copiar enlace' ? 'Copiar' : '¡Listo!'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isLightboxOpen && (
                <ImageLightbox 
                    imageUrl={currentImageUrl} 
                    altText={product.name} 
                    onClose={() => setIsLightboxOpen(false)} 
                />
            )}

             <style>{`
                @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ProductDetailPage;
