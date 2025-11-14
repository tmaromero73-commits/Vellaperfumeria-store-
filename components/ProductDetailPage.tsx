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
    onProductSelect: (product: Product) => void;
    onQuickView: (product: Product) => void;
    stripe: any;
    onOrderComplete: () => void;
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
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.475 5.422 5.571-1.469z" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
);

const TwitterIcon = () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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

const GooglePayIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={`h-6 w-6 ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="#fff" d="M19.6,9.46c0-1.12-.13-2.2-.36-3.24H12.22V10.4h4.4c-.19,1.21-.77,2.25-1.63,2.93l2.76,2.12c1.6-1.48,2.65-3.69,2.65-6.2Z"/>
        <path fill="#fff" d="M12.22,20a7.7,7.7,0,0,0,5.36-1.94l-2.76-2.12c-.91.62-2.07.98-3.31.98-2.54,0-4.69-1.71-5.46-4.01H3.63v2.2C4.94,17.9,8.32,20,12.22,20Z"/>
        <path fill="#fff" d="M6.76,12.81a4.63,4.63,0,0,1,0-2.84V7.77H3.63a7.93,7.93,0,0,0,0,7.26Z"/>
        <path fill="#fff" d="M12.22,6.22c1.38,0,2.6.48,3.58,1.4l2.45-2.45A7.7,7.7,0,0,0,12.22,4a7.92,7.92,0,0,0-7.3,4.24l3.13,2.2C8.8,8.14,10.43,6.22,12.22,6.22Z"/>
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

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, currency, onAddToCart, onProductSelect, onQuickView, stripe, onOrderComplete }) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState('Copiar enlace');
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [canMakeGPayPayment, setCanMakeGPayPayment] = useState(false);
    const paymentRequestRef = useRef<any>(null);


    const [selectedVariant, setSelectedVariant] = useState<Record<string, string> | null>(getDefaultVariant(product));
    const [currentImageUrl, setCurrentImageUrl] = useState(product.imageUrl);

    // Update image when a variant with a specific image is selected
    useEffect(() => {
        let variantImageUrl: string | null = null;

        if (product.variants && selectedVariant) {
            // Iterate over the product's variant types to find one with an image
            for (const variantType in product.variants) {
                const selectedValue = selectedVariant[variantType];
                if (selectedValue) {
                    const variantOption = product.variants[variantType].find(
                        v => v.value === selectedValue
                    );
                    
                    // If this selected option has a specific image, use it and stop searching
                    if (variantOption?.imageUrl) {
                        variantImageUrl = variantOption.imageUrl;
                        break;
                    }
                }
            }
        }

        // Set the image to the variant-specific one, or fall back to the main product image
        setCurrentImageUrl(variantImageUrl || product.imageUrl);
    }, [selectedVariant, product.variants, product.imageUrl]);

    // Setup Google Pay
    useEffect(() => {
        if (stripe && product) {
            const pr = stripe.paymentRequest({
                country: 'ES',
                currency: currency.toLowerCase(),
                total: {
                    label: product.name,
                    amount: Math.round(product.price * 100),
                },
                requestPayerName: true,
                requestPayerEmail: true,
            });

            paymentRequestRef.current = pr;

            pr.canMakePayment().then((result: any) => {
                if (result) {
                    setCanMakeGPayPayment(true);
                } else {
                    setCanMakeGPayPayment(false);
                }
            });
        }
    }, [stripe, product, currency]);


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
    const productTitle = `¡Mira este producto: ${product.name}!`;

    const shareLinks = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(productTitle)}%20${encodeURIComponent(productUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(productTitle)}`,
    };

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
            return { text: 'Agotado', color: 'text-red-600' };
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

    const handleGooglePay = () => {
        if (isOutOfStock || !paymentRequestRef.current) return;

        paymentRequestRef.current.on('paymentmethod', async (ev: any) => {
            console.log('Generated Stripe PaymentMethod for single product:', ev.paymentMethod);
            // In a real app, you would send this to your backend to confirm the payment
            ev.complete('success');
            onOrderComplete(); // This will clear the cart and navigate to confirmation
        });

        paymentRequestRef.current.show();
    };


    return (
        <div className="container mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden md:grid md:grid-cols-5 md:gap-8 p-4 md:p-8">
                <div className="md:col-span-3">
                    <div 
                        className="relative group cursor-pointer p-4 flex justify-center items-center bg-white border border-gray-100 rounded-lg"
                        onClick={() => setIsLightboxOpen(true)}
                        role="button"
                        aria-label="Ampliar imagen del producto"
                    >
                        <img
                            src={currentImageUrl}
                            alt={product.name}
                            className="max-h-96 object-contain transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center rounded-lg">
                            <div className="opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 transition-all duration-300">
                                <MagnifyPlusIcon />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="p-4 flex flex-col md:col-span-2">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-wide mb-2">{product.name}</h1>
                    
                    <div className="flex items-baseline gap-3 mb-4">
                        <p className="text-3xl font-bold text-gray-900">{formatCurrency(product.price, currency)}</p>
                    </div>

                    {product.isShippingSaver && (
                        <div className="flex items-center gap-2 text-amber-700 font-semibold my-3 p-3 bg-amber-50 rounded-md border border-amber-200">
                            <TruckIcon/>
                            <span>¡Este producto te da <b>envío GRATIS</b> en todo tu pedido!</span>
                        </div>
                    )}
                    
                    <p className="text-gray-800 leading-relaxed mb-4">{product.description}</p>
                    
                     {product.beautyPoints && (
                        <div className="flex items-center gap-2 text-fuchsia-700 font-semibold my-3 p-3 bg-fuchsia-50 rounded-md border border-fuchsia-200">
                            <SparklesIcon/>
                            <span>Consigue <b>+{product.beautyPoints} Puntos Beauty</b> con este producto</span>
                        </div>
                    )}

                    {product.variants && (
                        <div className="space-y-4 mb-6">
                            {Object.keys(product.variants).map((type) => {
                                const options = product.variants![type];
                                if (!Array.isArray(options)) return null;

                                return (
                                    <div key={type}>
                                        <h3 className="text-sm font-semibold text-gray-800 mb-2">
                                            {type}: <span className="font-normal text-gray-700">{selectedVariant?.[type]}</span>
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {options.map(option => {
                                                const isSelected = selectedVariant?.[type] === option.value;
                                                if (option.colorCode) { // Render color swatches
                                                    return (
                                                        <button
                                                            key={option.value}
                                                            onClick={() => handleVariantChange(type, option.value)}
                                                            className={`w-8 h-8 rounded-full border-2 transition-all ${isSelected ? 'border-fuchsia-500 ring-2 ring-offset-1 ring-fuchsia-500' : 'border-gray-300'}`}
                                                            style={{ backgroundColor: option.colorCode }}
                                                            aria-label={`Seleccionar color ${option.value}`}
                                                        />
                                                    );
                                                }
                                                // Render buttons for other types (e.g., size)
                                                return (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => handleVariantChange(type, option.value)}
                                                        className={`px-4 py-1.5 text-sm font-medium border rounded-md transition-colors ${isSelected ? 'bg-fuchsia-500 text-white' : 'bg-white text-black hover:bg-gray-100'}`}
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
                    
                    <div className="mb-6">
                        <p className="text-sm font-semibold">Disponibilidad: <span className={`font-bold ${stockInfo.color}`}>{stockInfo.text}</span></p>
                    </div>
                    
                    <div className="mt-auto flex flex-col gap-3">
                        <button
                            ref={btnRef}
                            onClick={() => {
                                if (btnRef.current && !isOutOfStock) {
                                    onAddToCart(product, btnRef.current, selectedVariant);
                                }
                            }}
                            disabled={isOutOfStock}
                            className={`w-full font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ${isOutOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#EBCFFC] text-black hover:bg-[#e0c2fa] transform hover:scale-105 active:scale-95'}`}
                            aria-label={`Añadir ${product.name} al carrito`}
                        >
                            {isOutOfStock ? 'Agotado' : 'Añadir al carrito'}
                        </button>
                        {canMakeGPayPayment && (
                            <button
                               onClick={handleGooglePay}
                               disabled={isOutOfStock}
                               className={`w-full bg-black text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-300 active:scale-95 flex items-center justify-center gap-2 ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                               aria-label="Pagar con Google Pay"
                            >
                               <span className="bg-black"><GooglePayIcon /></span> Comprar ahora
                            </button>
                        )}
                        <button
                           onClick={() => {
                               setIsShareModalOpen(true);
                               setCopyButtonText('Copiar enlace');
                           }}
                           className="w-full bg-gray-100 text-black font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-300 active:scale-95"
                           aria-label="Compartir este producto"
                        >
                           Compartir
                        </button>
                    </div>
                </div>
            </div>

             {product.category === 'skincare' && (
                <div className="text-center my-10">
                    <a 
                        href="https://vellaperfumeria.com/los-7-mejores-limpiadores/?v=12470fe406d4a"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-gray-100 text-gray-800 font-semibold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
                    >
                        Ver todos los limpiadores y productos de Skincare
                    </a>
                </div>
            )}

            {relatedProducts.length > 0 && (
                <section className="mt-16">
                    <h2 className="text-3xl font-bold mb-8 text-center">También te puede interesar</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedProducts.map(relatedProduct => (
                            <ProductCard
                                key={relatedProduct.id}
                                product={relatedProduct}
                                currency={currency}
                                onAddToCart={onAddToCart}
                                onProductSelect={onProductSelect}
                                onQuickView={onQuickView}
                            />
                        ))}
                    </div>
                </section>
            )}


            {/* --- Reviews Section --- */}
            <div className="mt-12 pt-8 border-t">
                <h2 className="text-2xl font-bold mb-6">Valoraciones de Clientes</h2>
                
                {/* Review Form */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <h3 className="text-lg font-semibold">Escribe tu opinión</h3>
                        {showSuccessMessage && (
                             <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                                <p className="font-bold">¡Gracias!</p>
                                <p>Tu reseña ha sido publicada.</p>
                            </div>
                        )}
                        <div>
                            <label htmlFor="reviewAuthor" className="block text-sm font-medium text-gray-700 mb-1">Tu nombre</label>
                            <input
                                type="text"
                                id="reviewAuthor"
                                value={newReview.author}
                                onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                                required
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Tu valoración</label>
                             <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none"
                                        aria-label={`Valorar con ${star} estrella${star > 1 ? 's' : ''}`}
                                    >
                                        <StarIcon
                                            className={`w-7 h-7 cursor-pointer transition-colors ${
                                                (hoverRating || newReview.rating) >= star
                                                    ? 'text-amber-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-1">Tu reseña</label>
                            <textarea
                                id="reviewText"
                                rows={4}
                                value={newReview.text}
                                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                                required
                            />
                        </div>
                        <div className="text-right">
                             <button
                                type="submit"
                                disabled={!isReviewFormValid}
                                className="bg-[#EBCFFC] text-black font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-[#e0c2fa] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Publicar reseña
                            </button>
                        </div>
                    </form>
                </div>

                {/* Existing Reviews */}
                <div className="space-y-6">
                    {reviews.length > 0 ? reviews.map((review, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 border-b">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserIcon />
                            </div>
                            <div>
                                <div className="flex items-center gap-4 mb-1">
                                    <p className="font-bold">{review.author}</p>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{review.date}</p>
                                <p className="text-gray-700">{review.text}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 py-4">No hay reseñas para este producto todavía. ¡Sé el primero!</p>
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
                        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                        onClick={(e) => e.stopPropagation()}
                        style={{animation: 'fade-in-scale 0.3s forwards cubic-bezier(0.16, 1, 0.3, 1)'}}
                    >
                        <button 
                            onClick={() => setIsShareModalOpen(false)} 
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                            aria-label="Cerrar modal"
                        >
                            <CloseIcon />
                        </button>
                        
                        <h2 id="share-modal-title" className="text-xl font-bold mb-2 text-center">Compartir Producto</h2>
                        <p className="font-semibold truncate mb-4 text-center text-gray-700">{product.name}</p>
                        
                        <div className="flex justify-around items-center my-6">
                            <a href={shareLinks.whatsapp} data-action="share/whatsapp/share" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600 transition-transform transform hover:scale-110" aria-label="Compartir en WhatsApp">
                               <WhatsAppIcon />
                            </a>
                             <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-transform transform hover:scale-110" aria-label="Compartir en Facebook">
                               <FacebookIcon />
                            </a>
                             <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black transition-transform transform hover:scale-110" aria-label="Compartir en Twitter">
                               <TwitterIcon />
                            </a>
                        </div>

                        <div className="flex items-center border rounded-lg p-1">
                            <input 
                                type="text" 
                                readOnly 
                                value={productUrl} 
                                className="flex-grow text-sm text-gray-500 bg-transparent focus:outline-none px-2"
                                aria-label="Enlace del producto"
                            />
                            <button 
                                onClick={handleCopyLink} 
                                className={`text-sm font-semibold py-2 px-3 rounded-md transition-colors ${copyButtonText === '¡Copiado!' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                            {copyButtonText}
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

            <style>
                {`
                @keyframes fade-in-scale {
                    from {
                        transform: scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                `}
            </style>
        </div>
    );
};

export default ProductDetailPage;