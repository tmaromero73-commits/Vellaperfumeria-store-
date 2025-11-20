
import React, { useEffect, useMemo, useState } from 'react';
import type { CartItem, View } from './types';
import type { Currency } from './currency';
import { formatCurrency } from './currency';

interface CheckoutPageProps {
    cartItems: CartItem[];
    currency: Currency;
    onClearCart: () => void;
    onNavigate: (view: View, payload?: any) => void;
}

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
        <path d="M22.5 8h1.3v8h-1.3V8zM25.6 8h3.3c.7 0 1.3.2 1.7.5.4.3.6.9.6 1.5 0 .7-.2 1.3-.7 1.6-.5.4-1.1.5-1.9.5h-1.8v3.9h-1.3V8zm1.3 3.1h1.9c.4 0 .7-.1.9-.2.2-.2.3-.4.3-.8s-.1-.6-.3-.8c-.2-.2-.5-.2-.9-.2h-1.9v2zM35.4 16h-1.4l-.5-1.3h-2.7l-.4 1.3H29l2.3-5.8h1.5l2.6 5.8zm-2.3-2.4l-.9-2.6-.9 2.6h1.8z" fill="black"/>
    </svg>
);


const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, currency, onNavigate }) => {
    const [vParam, setVParam] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        try {
            const urlParams = new URLSearchParams(window.location.search);
            setVParam(urlParams.get('v'));
        } catch (e) {
            console.error("Error extracting params", e);
        }
    }, []);

    const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const hasShippingSaver = cartItems.some(item => item.product.isShippingSaver);
    const shippingCost = subtotal >= 35 || hasShippingSaver ? 0 : 6.00;
    const total = subtotal + shippingCost;

    const productIdsString = useMemo(() => {
        const ids: number[] = [];
        cartItems.forEach(item => {
            let idToAdd = item.product.id;
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
            for (let i = 0; i < item.quantity; i++) {
                ids.push(idToAdd);
            }
        });
        return ids.join(',');
    }, [cartItems]);

    const checkoutUrl = useMemo(() => {
         return `https://vellaperfumeria.com/carrito/?add-to-cart=${productIdsString}${vParam ? `&v=${vParam}` : ''}`;
    }, [productIdsString, vParam]);

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="mb-4 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
                <button 
                    onClick={() => onNavigate('products', 'all')}
                    className="bg-[#E9D5FF] text-black px-6 py-3 rounded-lg hover:bg-[#D8B4FE] transition-colors font-bold shadow-md"
                >
                    Volver a la tienda
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl mx-auto text-center mb-10">
                <h1 className="text-3xl font-extrabold text-brand-primary mb-4">Finalizar Compra</h1>
                <p className="text-gray-600">Serás redirigido a tu carrito en Vellaperfumeria.com para completar el pago de forma segura.</p>
            </div>
            
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                <div className="p-6 md:p-8 bg-gray-50 border-b">
                    <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                         {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-lg border shadow-sm">
                                <div className="relative flex-shrink-0">
                                    <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-contain" />
                                    <span className="absolute -top-2 -right-2 bg-brand-purple text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-semibold text-gray-900 text-sm">{item.product.name}</h3>
                                    {item.selectedVariant && (
                                        <p className="text-xs text-gray-500">{Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(', ')}</p>
                                    )}
                                </div>
                                <div className="text-right font-bold text-brand-primary text-sm whitespace-nowrap">
                                    {formatCurrency(item.product.price * item.quantity, currency)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="p-6 md:p-8">
                    <div className="space-y-2 mb-8 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatCurrency(subtotal, currency)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Envío</span>
                            <span className={shippingCost === 0 ? "text-green-600 font-bold" : ""}>
                                {shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost, currency)}
                            </span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-black pt-4 border-t mt-2">
                            <span>Total Estimado</span>
                            <span>{formatCurrency(total, currency)}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Direct link for robust redirection */}
                        <a 
                            href={checkoutUrl}
                            target="_top"
                            rel="noopener noreferrer"
                            className="w-full bg-[#E9D5FF] text-black font-bold py-4 rounded-xl text-lg shadow-lg hover:bg-[#D8B4FE] hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-3"
                        >
                            <span>Pagar en Vellaperfumeria.com</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                        
                        <div className="flex justify-center items-center gap-3 mt-6 opacity-75 hover:opacity-100 transition-opacity">
                             <VisaIcon />
                             <MastercardIcon />
                             <GooglePayIcon />
                             <ApplePayIcon />
                             <PayPalIcon />
                        </div>
                        
                        <div className="text-center mt-4">
                            <p className="text-xs text-gray-500 mb-2">
                                Tus productos se transferirán automáticamente al carrito oficial.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
