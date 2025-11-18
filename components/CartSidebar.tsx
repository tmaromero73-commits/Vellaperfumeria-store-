

import React, { useEffect, useMemo, useRef } from 'react';
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
const DISCOUNT_THRESHOLD = 35; // Same threshold for discount
const DISCOUNT_PERCENTAGE = 0.15; // 15%
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

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, currency, onUpdateQuantity, onRemoveItem, onCheckout, isCheckingOut, checkoutError, onNavigate }) => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    
    // Close sidebar on "Escape" key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Trap focus within the sidebar when open for accessibility
    useEffect(() => {
        if (!isOpen || !sidebarRef.current) return;

        const focusableElements = sidebarRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                if (event.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else { // Tab
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

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-heading"
            className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} aria-hidden="true" />

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                    <h2 id="cart-heading" className="text-xl font-bold tracking-wide">Tu Carrito</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Cerrar carrito">
                        <CloseIcon />
                    </button>
                </div>

                {/* Cart Content */}
                {cartItems.length > 0 ? (
                    <div className="flex-grow flex flex-col overflow-hidden">
                        <div className="flex-grow overflow-y-auto p-4 space-y-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-4 items-start">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-contain rounded-md border p-1" />
                                    <div className="flex-grow flex flex-col">
                                        <h3 className="font-semibold text-sm leading-tight">{item.product.name}</h3>
                                        {item.selectedVariant && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {Object.entries(item.selectedVariant).map(([key, value]) => `${key}: ${value}`).join(', ')}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between mt-2">
                                             <p className="font-bold text-base">{formatCurrency(item.product.price * item.quantity, currency)}</p>
                                             <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-600 p-1" aria-label={`Eliminar ${item.product.name}`}>
                                                <TrashIcon />
                                            </button>
                                        </div>
                                        <div className="flex items-center border rounded-md w-fit mt-2">
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 font-semibold text-lg" aria-label="Reducir cantidad">-</button>
                                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 font-semibold text-lg" aria-label="Aumentar cantidad">+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t bg-gray-50 space-y-4 flex-shrink-0">
                             {discountAmount > 0 ? (
                                <p className="text-center text-sm font-semibold text-green-600 p-2 bg-green-50 rounded-md border border-green-200">
                                    ¡Felicidades! Se ha aplicado un <b>15% de descuento</b> a tu compra.
                                </p>
                            ) : amountForFreeShipping > 0 ? (
                                <div className="text-center text-sm">
                                    <p>Te faltan <span className="font-bold">{formatCurrency(amountForFreeShipping, currency, { decimals: 2 })}</span> para el envío <b>GRATIS</b> y un <b>15% de descuento</b>.</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div className="bg-brand-purple-dark h-2 rounded-full" style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}></div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-sm font-semibold text-green-600 p-2 bg-green-50 rounded-md border border-green-200">¡Felicidades! Tienes envío GRATIS.</p>
                            )}
                            
                            {totalBeautyPoints > 0 && (
                                <div className="flex justify-center items-center gap-2 text-black font-semibold p-2 bg-brand-purple/20 rounded-md border border-brand-purple/50">
                                    <span>✨</span>
                                    <span>¡Conseguirás <b>{totalBeautyPoints} Puntos Beauty</b> con esta compra!</span>
                                </div>
                            )}

                            <div className="space-y-1 text-base">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Subtotal</span>
                                    <span className="font-semibold">{formatCurrency(subtotal, currency)}</span>
                                </div>
                                {discountAmount > 0 && (
                                     <div className="flex justify-between text-green-600">
                                        <span className="font-semibold">Descuento (15%)</span>
                                        <span className="font-semibold">-{formatCurrency(discountAmount, currency)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Envío</span>
                                    <span className="font-semibold">{shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost, currency)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between font-bold text-xl border-t pt-3 mt-2">
                                <span>Total</span>
                                <span>{formatCurrency(total, currency)}</span>
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-3">
                                {checkoutError && (
                                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm" role="alert">
                                        <p className="font-bold">Error al procesar</p>
                                        <p>{checkoutError}</p>
                                    </div>
                                )}
                                <button
                                    onClick={onCheckout}
                                    disabled={isCheckingOut || cartItems.length === 0}
                                    className="w-full text-center bg-brand-purple text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-brand-purple-dark transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-wait"
                                >
                                     {isCheckingOut ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Procesando...
                                        </>
                                    ) : 'Finalizar Compra'}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-transparent text-brand-primary font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Seguir Comprando
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-800">Tu carrito está vacío</h3>
                        <p className="text-gray-500 mt-2">Parece que aún no has añadido nada.</p>
                        <button
                            onClick={() => {
                                onClose();
                                onNavigate('products', 'all');
                            }}
                            className="mt-6 bg-brand-purple text-brand-primary font-semibold py-2 px-8 rounded-lg hover:bg-brand-purple-dark transition-colors"
                        >
                            Seguir comprando
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSidebar;
