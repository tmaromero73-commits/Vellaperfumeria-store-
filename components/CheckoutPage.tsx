
import React, { useEffect, useMemo } from 'react';
import type { CartItem, View } from './types';
import type { Currency } from './currency';
import { formatCurrency } from './currency';

interface CheckoutPageProps {
    cartItems: CartItem[];
    currency: Currency;
    onClearCart: () => void;
    onNavigate: (view: View, payload?: any) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, currency, onNavigate }) => {
    // Usamos /carrito/ porque procesa mejor los parámetros add-to-cart vía URL que el checkout directo
    const CHECKOUT_BASE_URL = 'https://vellaperfumeria.com/carrito/';

    // Generar la URL con los parámetros para añadir al carrito y mantener la sesión (parámetro v)
    const checkoutUrl = useMemo(() => {
        if (cartItems.length === 0) return CHECKOUT_BASE_URL;

        // 1. Recopilar IDs de productos
        const productIds: number[] = [];
        
        cartItems.forEach(item => {
            let idToAdd = item.product.id;

            // Priorizar ID de la variante si existe (para tallas, tonos, etc.)
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

            // Añadir el ID tantas veces como la cantidad solicitada
            for (let i = 0; i < item.quantity; i++) {
                productIds.push(idToAdd);
            }
        });
        
        const queryParam = productIds.join(',');
        
        // Construir URL base con los productos
        let finalUrl = `${CHECKOUT_BASE_URL}?add-to-cart=${queryParam}`;

        // 2. Lógica para mantener el código de sesión "v" (WooCommerce Geolocation Hash)
        // Si la URL actual tiene ?v=xxxx, lo pasamos al checkout para no perder la sesión
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const vParam = urlParams.get('v');
            if (vParam) {
                finalUrl += `&v=${vParam}`;
            }
        } catch (e) {
            console.warn('No se pudo recuperar el parámetro de sesión v', e);
        }
        
        return finalUrl;
    }, [cartItems]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleProceedToCheckout = () => {
        if (window.top) {
            window.top.location.href = checkoutUrl;
        } else {
            window.location.href = checkoutUrl;
        }
    };

    const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const hasShippingSaver = cartItems.some(item => item.product.isShippingSaver);
    const shippingCost = subtotal >= 35 || hasShippingSaver ? 0 : 6.00;
    const total = subtotal + shippingCost;

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
                    className="bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-black transition-colors"
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
                        <button 
                            onClick={handleProceedToCheckout}
                            className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-3"
                        >
                            <span>Pagar en Vellaperfumeria.com</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </button>
                        
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
