
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

    const handleDirectCheckout = () => {
        if (selectedItemsList.length === 0) return;
        
        setIsProcessing(true);

        // --- LÓGICA DE URL MULTI-PRODUCTO PARA WOOCOMMERCE ---
        const idsToAdd: string[] = [];

        selectedItemsList.forEach(item => {
            let idToAdd = item.product.id;
             
            // Comprobamos si es una variante específica
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
            
            // Añadimos el ID tantas veces como cantidad haya
            for (let i = 0; i < item.quantity; i++) {
                idsToAdd.push(idToAdd.toString());
            }
        });
        
        const urlParams = new URLSearchParams(window.location.search);
        const vParam = urlParams.get('v');
            
        // Creamos la URL final que LLEVA A LA PÁGINA DE PAGO DE WOOCOMMERCE
        let redirectUrl = `https://vellaperfumeria.com/finalizar-compra/?add-to-cart=${idsToAdd.join(',')}`;
        
        if (vParam) {
            redirectUrl += `&v=${vParam}`;
        }
        
        // Redirigimos
        console.log("Redirigiendo a:", redirectUrl);
        window.location.href = redirectUrl;
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

                         {/* Métodos de Pago Visuales */}
                         <div className="mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide text-center">Aceptamos</p>
                            <div className="flex justify-center gap-3 items-center">
                                <VisaIcon />
                                <MastercardIcon />
                                <PayPalIcon />
                            </div>
                        </div>

                        <button 
                            onClick={handleDirectCheckout}
                            disabled={isProcessing || selectedItemsList.length === 0}
                            className="w-full bg-[var(--color-primary)] text-black font-bold py-4 rounded-xl shadow-lg hover:shadow-fuchsia-200 hover:bg-white hover:text-[var(--color-primary-solid)] border-2 border-[var(--color-primary-solid)] transition-all transform hover:-translate-y-1 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                        >
                            {isProcessing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando pago...
                                </span>
                            ) : (
                                `PAGAR AHORA`
                            )}
                        </button>
                        
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
