
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { CartItem, View } from './types';
import type { Currency } from './currency';
import { formatCurrency } from './currency';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    currency: Currency;
    onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
    onRemoveItem: (cartItemId: string) => void;
    onCheckout: () => void; 
    isCheckingOut: boolean;
    checkoutError: string | null;
    onNavigate: (view: View, payload?: any) => void;
}

const FREE_SHIPPING_THRESHOLD = 35;
const DISCOUNT_THRESHOLD = 35; 
const DISCOUNT_PERCENTAGE = 0.15; 
const SHIPPING_COST = 6.00;

const CloseIcon = () => (
    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.475 5.422 5.571-1.469z" />
    </svg>
);

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, currency, onUpdateQuantity, onRemoveItem, onNavigate }) => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (!isOpen || !sidebarRef.current) return;
        // Focus management
        const focusableElements = sidebarRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const handleTabKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        event.preventDefault();
                    }
                }
            }
        };
        firstElement?.focus();
        sidebarRef.current.addEventListener('keydown', handleTabKeyPress);
        return () => sidebarRef.current?.removeEventListener('keydown', handleTabKeyPress);
    }, [isOpen]);

    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }, [cartItems]);

    const discountAmount = useMemo(() => {
        if (subtotal >= DISCOUNT_THRESHOLD) {
            return subtotal * DISCOUNT_PERCENTAGE;
        }
        return 0;
    }, [subtotal]);

    const totalBeautyPoints = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const points = item.product.beautyPoints || 0;
            return total + (points * item.quantity);
        }, 0);
    }, [cartItems]);

    const hasShippingSaver = useMemo(() => {
        return cartItems.some(item => item.product.isShippingSaver);
    }, [cartItems]);

    const shippingCost = useMemo(() => {
        if (hasShippingSaver || subtotal >= FREE_SHIPPING_THRESHOLD) {
            return 0;
        }
        return SHIPPING_COST;
    }, [subtotal, hasShippingSaver]);

    const total = subtotal - discountAmount + shippingCost;
    const amountForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

    const handleDirectCheckout = () => {
        if (cartItems.length === 0) return;
        setIsRedirecting(true);

        // Redirect to "Finalizar Compra" (Checkout) instead of Cart to streamline the process
        const CHECKOUT_BASE_URL = 'https://vellaperfumeria.com/finalizar-compra/';
        let finalUrl = CHECKOUT_BASE_URL;

        // Build URL parameters for items to add to cart
        const productIds: number[] = [];
        
        cartItems.forEach(item => {
            let idToAdd = item.product.id;
            
            // Check for variant ID first
            if (item.selectedVariant && item.product.variants) {
                Object.entries(item.selectedVariant).forEach(([key, value]) => {
                    const variantOptions = item.product.variants?.[key];
                    if (variantOptions) {
                        const selectedOption = variantOptions.find(opt => opt.value === value);
                        if (selectedOption && selectedOption.variationId) {
                            idToAdd = selectedOption.variationId;
                        }
                    }
                });
            }
            
            // Add ID for each quantity unit (Standard WooCommerce way to add multiple via URL)
            for (let i = 0; i < item.quantity; i++) {
                productIds.push(idToAdd);
            }
        });

        if (productIds.length > 0) {
             const queryParam = productIds.join(',');
             // add-to-cart param works on WooCommerce to populate cart before showing page
             finalUrl = `${CHECKOUT_BASE_URL}?add-to-cart=${queryParam}`;
        }

        // Maintain session if 'v' param exists (WooCommerce Geolocation hash)
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const vParam = urlParams.get('v');
            if (vParam) {
                // If we already have parameters, append with &, otherwise ?
                finalUrl += finalUrl.includes('?') ? `&v=${vParam}` : `?v=${vParam}`;
            }
        } catch (e) {
            // Ignore
        }

        // CRITICAL FIX: Force top level redirect using window.open with '_top' target.
        // This reliably breaks out of iframes (the "page appearing several times" issue).
        setTimeout(() => {
            window.open(finalUrl, '_top');
            // Fallback just in case
            if (window.top) {
                window.top.location.href = finalUrl;
            }
            setIsRedirecting(false);
        }, 500);
    };

    const handleWhatsAppCheckout = () => {
        if (cartItems.length === 0) return;
        
        let message = "Hola! Me gustaría hacer un pedido en Vellaperfumeria:\n\n";
        cartItems.forEach(item => {
            message += `- ${item.quantity}x ${item.product.name}`;
            if (item.selectedVariant) {
                const variants = Object.values(item.selectedVariant).join(', ');
                message += ` (${variants})`;
            }
            message += ` - ${formatCurrency(item.product.price * item.quantity, currency)}\n`;
        });
        
        message += `\nSubtotal: ${formatCurrency(subtotal, currency)}`;
        if (discountAmount > 0) message += `\nDescuento: -${formatCurrency(discountAmount, currency)}`;
        message += `\nEnvío: ${shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost, currency)}`;
        message += `\n*TOTAL: ${formatCurrency(total, currency)}*`;
        message += `\n\nQuedo a la espera para confirmar el pago y envío. ¡Gracias!`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-heading"
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

            <div
                ref={sidebarRef}
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b flex-shrink-0 bg-purple-50">
                    <h2 id="cart-heading" className="text-xl font-bold tracking-wide text-brand-primary">Tu Cesta</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white text-purple-800 transition-colors" aria-label="Cerrar carrito">
                        <CloseIcon />
                    </button>
                </div>

                {cartItems.length > 0 ? (
                    <>
                        {/* Items List */}
                        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-purple-50/20">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-4 items-start bg-white p-3 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 object-contain rounded-lg border border-gray-50 p-1 bg-white" />
                                    <div className="flex-grow flex flex-col">
                                        <h3 className="font-semibold text-sm leading-tight text-gray-900">{item.product.name}</h3>
                                        {item.selectedVariant && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {Object.entries(item.selectedVariant).map(([key, value]) => `${key}: ${value}`).join(', ')}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between mt-3">
                                             <p className="font-bold text-base text-brand-primary">{formatCurrency(item.product.price * item.quantity, currency)}</p>
                                             <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-brand-primary p-1 transition-colors" aria-label={`Eliminar ${item.product.name}`}>
                                                <TrashIcon />
                                            </button>
                                        </div>
                                        <div className="flex items-center border border-gray-200 rounded-lg w-fit mt-2 bg-white overflow-hidden">
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 font-semibold text-gray-600 hover:text-brand-primary hover:bg-purple-50 transition-colors" aria-label="Reducir cantidad">-</button>
                                            <span className="px-2 text-sm font-medium text-gray-800">{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 font-semibold text-gray-600 hover:text-brand-primary hover:bg-purple-50 transition-colors" aria-label="Aumentar cantidad">+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer / Summary */}
                        <div className="p-6 border-t bg-white space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
                             {discountAmount > 0 ? (
                                <div className="text-center text-sm font-semibold text-brand-primary p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-center gap-2">
                                    <span>🎉</span>
                                    <span>¡Felicidades! <b>15% de descuento</b> aplicado.</span>
                                </div>
                            ) : amountForFreeShipping > 0 ? (
                                <div className="text-center text-sm">
                                    <p className="text-gray-600 mb-2">Te faltan <span className="font-bold text-brand-primary">{formatCurrency(amountForFreeShipping, currency, { decimals: 2 })}</span> para envío <b>GRATIS</b>.</p>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-purple-300 to-purple-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-sm font-semibold text-green-700 p-3 bg-green-50 rounded-xl border border-green-100 flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span>¡Tienes envío GRATIS!</span>
                                </div>
                            )}
                            
                            {totalBeautyPoints > 0 && (
                                <div className="flex justify-center items-center gap-2 text-purple-800 font-semibold text-sm p-2 bg-purple-50 rounded-xl border border-purple-100">
                                    <span>✨</span>
                                    <span>¡Consigues <b>{totalBeautyPoints} Puntos Beauty</b>!</span>
                                </div>
                            )}

                            <div className="space-y-2 text-sm text-gray-700 pt-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">{formatCurrency(subtotal, currency)}</span>
                                </div>
                                {discountAmount > 0 && (
                                     <div className="flex justify-between text-brand-primary">
                                        <span>Descuento (15%)</span>
                                        <span className="font-semibold">-{formatCurrency(discountAmount, currency)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Envío</span>
                                    <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600' : ''}`}>{shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost, currency)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-end font-bold text-xl pt-3 border-t border-gray-100 text-gray-900">
                                <span>Total</span>
                                <span className="text-3xl text-brand-primary tracking-tight">{formatCurrency(total, currency)}</span>
                            </div>
                            
                            <div className="flex flex-col gap-3 pt-2">
                                 {/* Web Checkout Button */}
                                <button
                                    onClick={handleDirectCheckout}
                                    disabled={isRedirecting || cartItems.length === 0}
                                    className="w-full text-center bg-brand-primary hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-purple-200 transform hover:-translate-y-0.5 flex justify-center items-center disabled:opacity-70 disabled:cursor-wait disabled:transform-none"
                                >
                                     {isRedirecting ? (
                                         <span className="flex items-center gap-2">
                                             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                             </svg>
                                             Procesando...
                                         </span>
                                     ) : 'REALIZAR PEDIDO'}
                                </button>

                                {/* WhatsApp Checkout Button */}
                                <button
                                    onClick={handleWhatsAppCheckout}
                                    className="w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-green-100 flex justify-center items-center gap-2 transform hover:-translate-y-0.5"
                                >
                                    <WhatsAppIcon />
                                    <span>PEDIR POR WHATSAPP</span>
                                </button>
                                
                                <button
                                    onClick={() => {
                                        onClose();
                                        onNavigate('products', 'all');
                                    }}
                                    className="w-full bg-transparent text-gray-400 hover:text-brand-primary font-medium py-2 text-sm transition-colors underline decoration-transparent hover:decoration-brand-primary"
                                >
                                    Seguir Comprando
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-white">
                        <div className="bg-purple-50 p-6 rounded-full mb-6 animate-bounce-slow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h3>
                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">¡Llénalo de belleza y cosas bonitas!</p>
                        <button
                            onClick={() => {
                                onClose();
                                onNavigate('products', 'all');
                            }}
                            className="bg-brand-primary text-white font-bold py-3 px-10 rounded-full hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            Explorar Tienda
                        </button>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default CartSidebar;
