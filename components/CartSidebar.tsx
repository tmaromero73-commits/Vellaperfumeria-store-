
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
// Gift Threshold > 35
const GIFT_THRESHOLD = 35;

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

const GiftBoxIcon = ({ color = "black" }: { color?: string }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 12V22H4V12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 7H2V12H22V7Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22V7" stroke={color === 'white' ? 'black' : 'white'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// Payment Icons
const VisaIcon = () => (
    <svg className="w-8 h-5" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
       <rect width="38" height="24" rx="2" fill="white"/>
       <path d="M15.5 15.5L13.5 4.5H11.5L9 10.5L7.5 6.5L7 4.5H5L8.5 15.5H11L13 9.5L14.5 4.5H15.5V15.5Z" fill="#1A1F71"/>
       <path d="M20.5 15.5L22.5 4.5H20.5L19.5 9L18.5 4.5H16.5L18.5 15.5H20.5Z" fill="#1A1F71"/>
       <path d="M26.5 15.5L28.5 4.5H26.5L25 8.5L23.5 4.5H21.5L23.5 15.5H26.5Z" fill="#1A1F71"/>
       <path d="M32.5 4.5H29.5L28.5 9L27.5 4.5H25.5L28.5 15.5H30.5L34.5 4.5H32.5Z" fill="#1A1F71"/>
       <path d="M11 15.5L13 4.5H15L13 15.5H11Z" fill="#1A1F71"/>
       <path d="M25.7 6.8C25.2 6.6 24.6 6.5 24 6.5C22.6 6.5 21.5 7.2 21.5 8.6C21.5 9.6 22.4 10.2 23.1 10.5C23.8 10.8 24 11 24 11.3C24 11.7 23.6 11.9 23.1 11.9C22.5 11.9 22 11.8 21.6 11.6L21.3 12.8C21.8 13 22.5 13.1 23.1 13.1C24.7 13.1 25.8 12.3 25.8 10.9C25.8 9.8 25.1 9.2 24.3 8.9C23.6 8.6 23.3 8.3 23.3 8C23.3 7.7 23.7 7.5 24.1 7.5C24.6 7.5 25 7.6 25.4 7.8L25.7 6.8Z" fill="#1A1F71"/>
       <path d="M30.6 6.5H28.9L28 11.5L28.9 6.5Z" fill="#1A1F71"/>
       <path d="M32.9 6.5L32.5 8.6C32.3 7.9 32.1 7.2 31.8 6.5H30.2L30.6 8.6L30.2 11.5L31.1 6.5Z" fill="#1A1F71"/>
    </svg>
);

const MastercardIcon = () => (
    <svg className="w-8 h-5" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="38" height="24" rx="2" fill="white"/>
        <circle cx="13" cy="12" r="7" fill="#EB001B"/>
        <circle cx="25" cy="12" r="7" fill="#F79E1B"/>
        <path d="M19 16.4C20.3 15.4 21.2 13.8 21.2 12C21.2 10.2 20.3 8.6 19 7.6C17.7 8.6 16.8 10.2 16.8 12C16.8 13.8 17.7 15.4 19 16.4Z" fill="#FF5F00"/>
    </svg>
);

const PayPalIcon = () => (
    <svg className="w-8 h-5" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="38" height="24" rx="2" fill="white"/>
        <path d="M26.5 7.5L23.5 7.5L22.5 13.5L26.5 7.5Z" fill="#003087"/>
        <path d="M22.5 13.5L20.5 13.5L21.5 7.5L24.5 7.5L22.5 13.5Z" fill="#003087"/>
        <path d="M14.5 7.5C15.5 7.5 16.5 8 16.5 9.5C16.5 10.5 16 11.5 15 11.5H13.5L14.5 7.5Z" fill="#003087"/>
        <path d="M10.5 7.5H13.5L12.5 13.5H9.5L10.5 7.5Z" fill="#003087"/>
        <path d="M13 12.5H11.5L12 9.5L13 12.5Z" fill="#009CDE"/>
        <path d="M16 10.5C16 11.5 15.5 12.5 14.5 12.5H13L13.5 9.5H15C15.5 9.5 16 9.8 16 10.5Z" fill="#009CDE"/>
        <path d="M20 7.5L18 13.5H16.5L18.5 7.5H20Z" fill="#009CDE"/>
    </svg>
);

const GooglePayIcon = () => (
    <svg className="w-8 h-5" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="38" height="24" rx="2" fill="white" />
        <path d="M10.9 10.4V16h-1.3v-9.5h4c1.3 0 2.3.4 3 .9.7.6 1.1 1.3 1.1 2.2 0 .9-.4 1.6-1.1 2.2-.7.6-1.6.9-3 .9h-2.7zm1.3-4.2v3.1h1.3c.9 0 1.4-.4 1.4-1.5 0-1.1-.5-1.6-1.4-1.6h-1.3zM19.3 7.8h1.3v8.2h-1.3V7.8zM22.8 7.8h1.4l2.8 5.7c.1.2.1.3.2.5h.1c.1-.2.1-.4.2-.5l2.7-5.7h1.4l-4.3 8.4h-1.4l-3.1-8.4z" fill="#5F6368"/>
        <path d="M6.7 11.5c0 .6-.2 1.2-.5 1.7l-.2.3c-.6.8-1.6 1.3-2.7 1.3-1.5 0-2.8-.9-3.2-2.3-.1-.3-.1-.6-.1-1 0-1.6 1-3.1 2.6-3.6.5-.2 1.1-.2 1.7-.1.6.1 1.2.4 1.6.8l-1 1c-.3-.3-.6-.5-1-.6-.4-.1-.8 0-1.1.2-.8.3-1.3 1.1-1.2 2 0 .4.1.8.3 1.1.4.6 1.1.9 1.8.8.5-.1.9-.3 1.2-.6.2-.2.3-.5.4-.8H3.3V10h3.4v1.5z" fill="#5F6368"/>
    </svg>
);

const ApplePayIcon = () => (
    <svg className="w-8 h-5" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="38" height="24" rx="2" fill="white" />
        <path d="M16.1 11.3c0 2.7 2.3 3.7 2.4 3.7-.1 0-.2.5-.4.9-.4.8-.8 1.7-1.5 1.7-.7 0-1-.4-1.8-.4-.9 0-1.2.4-1.9.4-.7 0-1.3-1-1.9-2-1.8-2.6-1.5-6.5 1.9-6.5 1.1 0 1.9.7 2.4.7.6 0 1.6-.9 2.8-.9.5 0 1.9.2 2.6 1.2-.1.1-1.6 1-1.6 3.2zM15.8 6.7c.6-.7.9-1.6.8-2.4-.8 0-1.8.5-2.3 1.2-.5.6-.9 1.5-.8 2.4.8.1 1.7-.5 2.3-1.2z" fill="black"/>
        <path d="M22.5 8h1.3v8h-1.3V8zM25.6 8h3.3c.7 0 1.3.2 1.7.5.4.3.6.9.6 1.5 0 .7-.2 1.3-.7 1.6-.5.4-1.1.5-1.9.5h-1.8v3.9h-1.3V8zm1.3 3.1h1.9c.4 0 .7-.1.9-.2.2-.3.4.3-.8s-.1-.6-.3-.8c-.2-.2-.5-.2-.9-.2h-1.9v2zM35.4 16h-1.4l-.5-1.3h-2.7l-.4 1.3H29l2.3-5.8h1.5l2.6 5.8zm-2.3-2.4l-.9-2.6-.9 2.6h1.8z" fill="black"/>
    </svg>
);

const BizumIcon = () => (
    <svg className="w-8 h-5" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="38" height="24" rx="2" fill="#00D1E5"/>
        <path d="M9 12L14 17L29 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, currency, onUpdateQuantity, onRemoveItem, onCheckout, onNavigate }) => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    
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

    // Check if gift box should be shown (Orders > 35 euros)
    const hasGift = subtotal > GIFT_THRESHOLD;

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
        
        if (hasGift) {
            message += `- 1x Caja de Regalo Mediana (Negra) - GRATIS\n`;
        }

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
                <div className="flex items-center justify-between p-4 border-b flex-shrink-0 bg-[#FAF5FF]">
                    <h2 id="cart-heading" className="text-xl font-bold tracking-wide text-purple-700">Tu Cesta</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white text-purple-800 transition-colors" aria-label="Cerrar carrito">
                        <CloseIcon />
                    </button>
                </div>

                {cartItems.length > 0 ? (
                    <>
                        {/* Items List */}
                        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#FAF5FF]/50">
                            {/* Free Gift Item Logic */}
                            {hasGift && (
                                <div className="flex gap-4 items-center bg-black text-white p-3 rounded-xl border border-gray-800 shadow-sm transition-shadow animate-pop">
                                    {/* Icono negro, fondo blanco (image/icon container) */}
                                    <div className="w-20 h-20 flex items-center justify-center bg-white rounded-lg border border-gray-200 p-1">
                                        <GiftBoxIcon color="black" />
                                    </div>
                                    <div className="flex-grow flex flex-col">
                                        <h3 className="font-semibold text-sm leading-tight text-white">Caja de Regalo Mediana (Negra)</h3>
                                        <p className="text-xs text-gray-400 mt-1">¡Regalo BLACK FRIDAY (+35€)!</p>
                                        <div className="flex items-center justify-between mt-2">
                                             <p className="font-bold text-base text-green-400">GRATIS</p>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                             <p className="font-bold text-base text-purple-600">{formatCurrency(item.product.price * item.quantity, currency)}</p>
                                             <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-purple-500 p-1 transition-colors" aria-label={`Eliminar ${item.product.name}`}>
                                                <TrashIcon />
                                            </button>
                                        </div>
                                        <div className="flex items-center border border-gray-200 rounded-lg w-fit mt-2 bg-white overflow-hidden">
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 font-semibold text-gray-600 hover:text-purple-500 hover:bg-purple-50 transition-colors" aria-label="Reducir cantidad">-</button>
                                            <span className="px-2 text-sm font-medium text-gray-800">{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 font-semibold text-gray-600 hover:text-purple-500 hover:bg-purple-50 transition-colors" aria-label="Aumentar cantidad">+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer / Summary */}
                        <div className="p-6 border-t bg-white space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10">
                             {discountAmount > 0 ? (
                                <div className="text-center text-sm font-semibold text-purple-700 p-3 bg-[#FAF5FF] rounded-xl border border-purple-100 flex items-center justify-center gap-2">
                                    <span>🎉</span>
                                    <span>¡Felicidades! <b>15% de descuento</b> aplicado.</span>
                                </div>
                            ) : amountForFreeShipping > 0 ? (
                                <div className="text-center text-sm">
                                    <p className="text-gray-600 mb-2"><span className="font-bold text-black">BLACK FRIDAY:</span> Te faltan <span className="font-bold text-purple-600">{formatCurrency(amountForFreeShipping, currency, { decimals: 2 })}</span> para envío <b>GRATIS</b>.</p>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-purple-300 to-purple-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-sm font-semibold text-green-700 p-3 bg-green-50 rounded-xl border border-green-100 flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path></svg>
                                    <span>¡BLACK FRIDAY: Envío GRATIS activado!</span>
                                </div>
                            )}
                            
                            {totalBeautyPoints > 0 && (
                                <div className="flex justify-center items-center gap-2 text-purple-800 font-semibold text-sm p-2 bg-[#FAF5FF] rounded-xl border border-purple-100">
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
                                     <div className="flex justify-between text-purple-600">
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
                                <span className="text-3xl text-purple-600 tracking-tight">{formatCurrency(total, currency)}</span>
                            </div>
                            
                            <div className="flex flex-col gap-3 pt-2">
                                 {/* Updated to call onCheckout instead of direct redirect */}
                                <button 
                                    onClick={onCheckout}
                                    className="w-full text-center bg-[#f78df685] hover:bg-white text-black hover:text-black border-2 border-[#f78df6] font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-purple-200 transform hover:-translate-y-0.5 flex justify-center items-center cursor-pointer no-underline"
                                >
                                     FINALIZAR COMPRA EN WEB
                                </button>
                                
                                <div className="flex justify-center items-center gap-3 mt-1 pb-1">
                                    <VisaIcon />
                                    <MastercardIcon />
                                    <GooglePayIcon />
                                    <ApplePayIcon />
                                    <PayPalIcon />
                                    <BizumIcon />
                                </div>

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
                                    className="w-full bg-transparent text-gray-400 hover:text-purple-500 font-medium py-2 text-sm transition-colors underline decoration-transparent hover:decoration-purple-500"
                                >
                                    Seguir Comprando
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-white">
                        <div className="bg-[#FAF5FF] p-6 rounded-full mb-6 animate-bounce-slow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">¡Llénalo de belleza y cosas bonitas!</p>
                        <button
                            onClick={() => {
                                onClose();
                                onNavigate('products', 'all');
                            }}
                            className="bg-[#f78df685] text-black border-2 border-[#f78df6] font-bold py-3 px-10 rounded-full hover:bg-white hover:text-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
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
