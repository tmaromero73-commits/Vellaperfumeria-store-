
import React, { useMemo, useState, useEffect } from 'react';
import type { CartItem, View } from './types';
import type { Currency } from './currency';
import { formatCurrency } from './currency';

interface CheckoutSummaryPageProps {
    cartItems: CartItem[];
    currency: Currency;
    onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
    onRemoveItem: (cartItemId: string) => void;
    onNavigate: (view: View) => void;
}

const FREE_SHIPPING_THRESHOLD = 35;
const DISCOUNT_THRESHOLD = 35; 
const DISCOUNT_PERCENTAGE = 0.15; 
const SHIPPING_COST = 6.00;

// Icono de Verificado para la tienda
const VerifiedBadge = () => (
    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

// Payment Icons
const GooglePayIcon = () => (
    <svg className="h-6" viewBox="0 0 44 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.964 8.203h2.64V12.9h-2.64V8.203zm1.32-4.14c.917 0 1.66.716 1.66 1.6 0 .883-.743 1.6-1.66 1.6-.917 0-1.66-.717-1.66-1.6 0-.884.743-1.6 1.66-1.6zM24.777 8.203h2.64v9.64h-1.39l-1.45-1.12c-1.13.91-2.35 1.48-3.98 1.48-3.03 0-5.18-2.36-5.18-5.7 0-3.37 2.18-5.69 5.21-5.69 1.66 0 2.91.6 4.15 1.54v-.15zm-2.43 7.51c1.94 0 3.25-1.54 3.25-3.48 0-1.94-1.31-3.51-3.25-3.51-1.97 0-3.28 1.57-3.28 3.51 0 1.94 1.31 3.48 3.28 3.48zM31.298 8.203h2.51l3.54 9.64h-2.71l-.54-1.68h-4.06l-.57 1.68h-2.66l4.49-9.64zm2.66 5.86l-1.37-4.12-1.43 4.12h2.8zM41.05 15.343l-2.88-8.91h-1.29v-1.14c1.11-.23 2.91-.57 4.17-.57 1.34 0 3.03.34 4.14.57v1.14h-1.2l-2.86 8.91h-2.86z" fill="currentColor"/>
        <path d="M11.96 6.843c-1.6-.74-3.46-.86-4.94-.29-1.49.57-2.63 1.8-3.09 3.37-.46 1.57-.09 3.29 1 4.54 1.09 1.26 2.74 2.03 4.43 2.03 1.23 0 2.4-.4 3.34-1.09.26-.2.54-.4.77-.63l.03-.03c.51-.57.89-1.23 1.09-1.97l.63 2.37h2.4V6.263h-2.69v1.94c-1-1.06-2.09-1.46-3.03-1.46zm.4 6.17c-1.4.91-3.23.8-4.51-.29-1.29-1.09-1.6-3.03-.71-4.51.89-1.49 2.77-2 4.31-1.26 1.54.74 2.37 2.6 1.83 4.23-.17.66-.51 1.26-.91 1.83z" fill="currentColor"/>
        <path d="M7.05 6.743C6.68 6.6 6.28 6.54 5.88 6.54c-2.4 0-4.63 1.49-5.49 3.77-1.11 3.03.4 6.37 3.43 7.49 3.03 1.11 6.37-.4 7.49-3.43.14-.37.26-.74.31-1.11l-2.46-.6c-.03.26-.09.49-.17.74-.63 1.71-2.51 2.57-4.23 1.94-1.71-.63-2.57-2.51-1.94-4.23.51-1.43 1.83-2.29 3.23-2.29.37 0 .74.06 1.11.2l-.11-2.29z" fill="currentColor"/>
        <path d="M12.93 2.803C12.16 1.113 10.33.2 8.64.97c-1.69.77-2.43 2.77-1.66 4.46l2.37-.89c-.31-.77.06-1.63.83-1.97.77-.34 1.66.03 1.97.8l.8 1.69L15.39 3.97l-.92-1.66-.09-.17-.11-.26c-.4-.54-.89-1.09-1.34-1.09z" fill="currentColor"/>
    </svg>
);

const ApplePayIcon = () => (
    <svg className="h-6" viewBox="0 0 38 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.45 6.66c0-1.84 1.52-2.77 1.59-2.82-.87-1.12-2.23-1.27-2.71-1.29-1.15-.12-2.25.68-2.83.68-.59 0-1.99-.66-3.28-.64-1.69.02-3.25.99-4.11 2.51-1.76 3.03-.45 7.53 1.25 9.99.84 1.21 1.83 2.56 3.14 2.51 1.25-.05 1.73-.81 3.25-.81 1.51 0 1.94.81 3.26.78 1.35-.02 2.21-1.22 3.03-2.44.95-1.38 1.34-2.72 1.36-2.79-.03-.02-2.61-1.01-2.61-4.01-.01-2.51 2.04-3.71 2.13-3.77-.12-.27-.19-.41-1.47-2.27z" fill="currentColor"/>
        <path d="M22.56 7.64c0 3.06 2.65 4.1 2.68 4.12-.02.09-.41 1.45-1.37 2.87-.84 1.24-1.71 2.48-3.09 2.5-1.35.03-1.79-.81-3.34-.81-1.55 0-2.04.79-3.33.84-1.33.05-2.35-1.34-3.2-2.55-1.74-2.51-3.07-7.1-.03-10.74 1.51-1.81 4.2-1.92 5.67-1.92.36 0 .73 0 1.09.04.14-1.72 1.53-3.23 3.49-3.23 1.84 0 3.18 1.51 3.18 3.32 0 .28-.03.55-.09.81 1.14.77 2.37 1.73 2.45 1.76-.14.28-4.11 1.5-4.11 2.99zM22.6 3.02c.79-.98 1.32-2.34 1.18-3.7-.49.07-2.68 1.45-3.52 3.65.91.81 1.71.69 2.34.05z" fill="currentColor"/>
    </svg>
);


// Métodos de Pago Tradicionales (Visa, MC, PayPal)
const VisaIcon = () => (
    <svg className="w-10 h-6" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <svg className="w-10 h-6" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="38" height="24" rx="2" fill="white"/>
        <circle cx="13" cy="12" r="7" fill="#EB001B"/>
        <circle cx="25" cy="12" r="7" fill="#F79E1B"/>
        <path d="M19 16.4C20.3 15.4 21.2 13.8 21.2 12C21.2 10.2 20.3 8.6 19 7.6C17.7 8.6 16.8 10.2 16.8 12C16.8 13.8 17.7 15.4 19 16.4Z" fill="#FF5F00"/>
    </svg>
);

const PayPalIcon = () => (
    <svg className="w-10 h-6" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const CheckoutSummaryPage: React.FC<CheckoutSummaryPageProps> = ({ 
    cartItems, 
    currency, 
    onUpdateQuantity, 
    onRemoveItem,
    onNavigate
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

    // Initialize selection when cart items load - Mark ALL by default
    useEffect(() => {
        const allIds = new Set(cartItems.map(item => item.id));
        setSelectedItemIds(allIds);
    }, [cartItems]);

    const handleToggleSelect = (id: string) => {
        const newSelected = new Set(selectedItemIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItemIds(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedItemIds.size === cartItems.length) {
            setSelectedItemIds(new Set());
        } else {
            setSelectedItemIds(new Set(cartItems.map(item => item.id)));
        }
    };

    const selectedItemsList = useMemo(() => {
        return cartItems.filter(item => selectedItemIds.has(item.id));
    }, [cartItems, selectedItemIds]);

    const subtotal = useMemo(() => {
        return selectedItemsList.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }, [selectedItemsList]);

    const discountAmount = useMemo(() => {
        if (subtotal >= DISCOUNT_THRESHOLD) {
            return subtotal * DISCOUNT_PERCENTAGE;
        }
        return 0;
    }, [subtotal]);

    const hasShippingSaver = useMemo(() => {
        return selectedItemsList.some(item => item.product.isShippingSaver);
    }, [selectedItemsList]);

    const shippingCost = useMemo(() => {
        if (selectedItemsList.length === 0) return 0;
        if (hasShippingSaver || subtotal >= FREE_SHIPPING_THRESHOLD) {
            return 0;
        }
        return SHIPPING_COST;
    }, [subtotal, hasShippingSaver, selectedItemsList]);

    const total = subtotal - discountAmount + shippingCost;
    const amountForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

    // Lógica principal de checkout (común para Google Pay, Apple Pay y Checkout Normal)
    const proceedToCheckout = (method: 'standard' | 'google' | 'apple') => {
        if (selectedItemsList.length === 0) return;
        
        setIsProcessing(true);

        const idsToAdd: string[] = [];
        selectedItemsList.forEach(item => {
            let idToAdd = item.product.id;
             
            if (item.selectedVariant && item.product.variants) {
                for (const type in item.selectedVariant) {
                    const value = item.selectedVariant[type];
                    const variantOptions = item.product.variants[type];
                    const option = variantOptions?.find(opt => opt.value === value);
                    if (option?.variationId) {
                        idToAdd = option.variationId;
                        break;
                    }
                }
            }
            
            for (let i = 0; i < item.quantity; i++) {
                idsToAdd.push(idToAdd.toString());
            }
        });
        
        const urlParams = new URLSearchParams(window.location.search);
        const vParam = urlParams.get('v');
            
        let redirectUrl = `https://vellaperfumeria.com/finalizar-compra/?add-to-cart=${idsToAdd.join(',')}`;
        
        // Si es un método express, podríamos añadir un flag (simulado aquí)
        if (method === 'google') console.log("Procesando con Google Pay...");
        if (method === 'apple') console.log("Procesando con Apple Pay...");

        if (vParam) {
            redirectUrl += `&v=${vParam}`;
        }
        
        // Simular pequeño delay para UX
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 800);
    };

    const handleLoadSimulation = () => {
        window.location.href = window.location.pathname + '?v=12470fe406d4';
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-fuchsia-50 max-w-2xl mx-auto">
                    <svg className="w-24 h-24 text-fuchsia-200 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Tu carrito está vacío</h2>
                    <p className="text-gray-600 mb-8 text-lg">Parece que aún no has añadido nada a tu cesta.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => onNavigate('products')}
                            className="bg-black text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-800 transition-all transform hover:-translate-y-1"
                        >
                            Ir a la Tienda
                        </button>
                        
                        <button 
                            onClick={handleLoadSimulation}
                            className="bg-fuchsia-100 text-fuchsia-800 font-bold py-3 px-8 rounded-full hover:bg-fuchsia-200 transition-colors border border-fuchsia-200"
                        >
                            Ver Ejemplo de Carrito
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center md:text-left">Finalizar Compra</h1>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items List */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header with Select All */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                            <div className="relative flex items-center">
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 text-fuchsia-600 rounded focus:ring-fuchsia-500 border-gray-300 cursor-pointer"
                                    checked={selectedItemIds.size === cartItems.length && cartItems.length > 0}
                                    onChange={handleSelectAll}
                                    id="select-all"
                                />
                            </div>
                            <label htmlFor="select-all" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                                Seleccionar todos los productos ({cartItems.length})
                            </label>
                        </div>

                        <div className="p-6 space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className={`flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0 transition-all duration-300 ${selectedItemIds.has(item.id) ? 'opacity-100' : 'opacity-50 grayscale-[0.5]'}`}>
                                    {/* Item Checkbox */}
                                    <div className="flex items-start pt-2 pr-2">
                                        <input 
                                            type="checkbox" 
                                            className="w-6 h-6 text-fuchsia-600 rounded-md focus:ring-fuchsia-500 border-gray-300 cursor-pointer transition-transform transform active:scale-95"
                                            checked={selectedItemIds.has(item.id)}
                                            onChange={() => handleToggleSelect(item.id)}
                                            aria-label={`Seleccionar ${item.product.name}`}
                                        />
                                    </div>

                                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-white rounded-xl p-2 border border-gray-200 shadow-sm">
                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain" />
                                    </div>
                                    
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight hover:text-fuchsia-600 cursor-pointer">{item.product.name}</h3>
                                                <p className="text-lg font-bold text-[var(--color-primary-solid)] whitespace-nowrap">{formatCurrency(item.product.price * item.quantity, currency)}</p>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-1 font-medium">{item.product.brand}</p>
                                            
                                            {/* Etiqueta Unificada */}
                                            <div className="flex items-center gap-1.5 mb-2 bg-blue-600 w-fit px-2 py-1 rounded-md shadow-sm">
                                                <VerifiedBadge />
                                                <p className="text-xs text-white font-bold tracking-wide uppercase">Vendido por Vellaperfumeria</p>
                                            </div>

                                            {item.selectedVariant && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {Object.entries(item.selectedVariant).map(([key, value]) => (
                                                        <span key={key} className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded-md border border-gray-200">
                                                            {key}: {value}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex justify-between items-end mt-4 sm:mt-0">
                                            <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
                                                <button 
                                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition-colors border-r border-gray-200"
                                                >
                                                    -
                                                </button>
                                                <span className="w-10 text-center font-semibold text-gray-900 text-sm">{item.quantity}</span>
                                                <button 
                                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition-colors border-l border-gray-200"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button 
                                                onClick={() => onRemoveItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors flex items-center gap-1"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-3xl shadow-lg border border-fuchsia-100 p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>
                        <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                            <span className="font-bold text-black">{selectedItemsList.length}</span> productos seleccionados
                        </p>
                        
                        <div className="space-y-4 mb-6 text-gray-600 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold text-gray-900">{formatCurrency(subtotal, currency)}</span>
                            </div>
                            
                            {discountAmount > 0 ? (
                                <div className="flex justify-between text-fuchsia-600 bg-fuchsia-50 p-2 rounded-lg">
                                    <span>Descuento (15%)</span>
                                    <span className="font-semibold">-{formatCurrency(discountAmount, currency)}</span>
                                </div>
                            ) : (
                                selectedItemsList.length > 0 && (
                                    <div className="text-xs bg-gray-50 p-2 rounded-lg text-center text-gray-500">
                                        ¡Añade {formatCurrency(Math.max(0, DISCOUNT_THRESHOLD - subtotal), currency)} más para obtener un 15% de descuento!
                                    </div>
                                )
                            )}

                            <div className="flex justify-between items-center">
                                <span>Envío</span>
                                {shippingCost === 0 ? (
                                    <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded">GRATIS</span>
                                ) : (
                                    <span className="font-semibold text-gray-900">{formatCurrency(shippingCost, currency)}</span>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 mb-6">
                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold text-gray-900">Total a Pagar</span>
                                <span className="text-3xl font-extrabold text-[var(--color-primary-solid)]">{formatCurrency(total, currency)}</span>
                            </div>
                            <p className="text-xs text-gray-400 text-right mt-1">Impuestos incluidos</p>
                        </div>

                        {/* Express Checkout Section */}
                        <div className="mb-6 space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2">Pago Rápido</p>
                            <button 
                                onClick={() => proceedToCheckout('google')}
                                disabled={isProcessing || selectedItemsList.length === 0}
                                className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
                            >
                                <GooglePayIcon /> 
                            </button>
                            <button 
                                onClick={() => proceedToCheckout('apple')}
                                disabled={isProcessing || selectedItemsList.length === 0}
                                className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
                            >
                                <ApplePayIcon />
                            </button>
                        </div>

                        <div className="relative flex py-2 items-center mb-6">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase">O paga con tarjeta</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <button 
                            onClick={() => proceedToCheckout('standard')}
                            disabled={isProcessing || selectedItemsList.length === 0}
                            className="w-full bg-[var(--color-primary)] text-black font-bold py-4 rounded-xl shadow-lg hover:shadow-fuchsia-200 hover:bg-white hover:text-[var(--color-primary-solid)] border-2 border-[var(--color-primary-solid)] transition-all transform hover:-translate-y-1 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                        >
                            {isProcessing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Redirigiendo...
                                </span>
                            ) : (
                                `PAGAR EN VELLAPERFUMERIA.COM`
                            )}
                        </button>
                        
                         {/* Payment Icons Footer */}
                         <div className="mt-6 pt-4 border-t border-gray-50 flex justify-center gap-2 opacity-60 grayscale">
                            <VisaIcon />
                            <MastercardIcon />
                            <PayPalIcon />
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Checkout Seguro SSL 256-bit
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSummaryPage;
