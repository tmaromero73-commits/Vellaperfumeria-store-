
import React, { useState, useEffect, useMemo } from 'react';
import type { CartItem, View } from './types';
import { type Currency, formatCurrency } from './currency';

interface CheckoutPageProps {
    cartItems: CartItem[];
    currency: Currency;
    onNavigate: (view: View, payload?: any) => void;
    onClearCart: () => void;
}

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

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, currency, onNavigate, onClearCart }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [vParam, setVParam] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        phone: ''
    });

    useEffect(() => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            setVParam(urlParams.get('v'));
        } catch (e) {
            console.error("Error extracting params", e);
        }
    }, []);

    const FREE_SHIPPING_THRESHOLD = 35;
    const DISCOUNT_THRESHOLD = 35;
    const DISCOUNT_PERCENTAGE = 0.15;
    const SHIPPING_COST = 6.00;

    const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    
    // Calculate automatic discount
    let discountAmount = subtotal >= DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_PERCENTAGE : 0;
    
    // Extra coupon discount (e.g., 5 fixed)
    if (couponApplied) {
        discountAmount += 5; 
    }

    const hasShippingSaver = cartItems.some(item => item.product.isShippingSaver);
    const shippingCost = (hasShippingSaver || subtotal >= FREE_SHIPPING_THRESHOLD) ? 0 : SHIPPING_COST;
    
    const total = Math.max(0, subtotal - discountAmount + shippingCost);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyCoupon = () => {
        if (couponCode.trim().toLowerCase() === 'vella5') {
            setCouponApplied(true);
        } else {
            alert('Cupón no válido. Prueba con "VELLA5"');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!acceptedTerms) {
            alert('Por favor, acepta los términos y condiciones para continuar.');
            return;
        }
        setIsProcessing(true);
        setStatusMessage("Conectando con la tienda segura...");

        const baseUrl = 'https://vellaperfumeria.com/';
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        
        // Determine final redirect URL
        let redirectUrl = 'https://vellaperfumeria.com/finalizar-compra/';
        if (vParam) redirectUrl += `?v=${vParam}`;

        // Process items sequentially to ensure WooCommerce catches all add-to-cart requests
        // We use a simple 'fetch' to trigger the server-side add to cart before redirecting.
        // Note: Due to CORS, we use mode 'no-cors'. We won't know if it succeeded, but it usually works for session-based carts.
        let count = 1;
        const totalItems = cartItems.length;

        for (const item of cartItems) {
            setStatusMessage(`Sincronizando producto ${count} de ${totalItems}...`);
            
            let idToAdd = item.product.id;
            
            // Check for variant ID
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

            // Construct the add-to-cart URL for this specific item
            // We add a random timestamp 't' to prevent caching
            let addToCartUrl = `${baseUrl}?add-to-cart=${idToAdd}&quantity=${item.quantity}&t=${Date.now()}`;
            if (vParam) addToCartUrl += `&v=${vParam}`;

            try {
                await fetch(addToCartUrl, { mode: 'no-cors' });
            } catch (err) {
                console.error("Error syncing item", idToAdd, err);
            }

            // Small delay to allow server to process session
            await delay(400);
            count++;
        }

        setStatusMessage("Redirigiendo al pago seguro...");
        await delay(500);
        
        // Redirect to external website for real payment
        window.location.href = redirectUrl;
    };

    if (cartItems.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen flex flex-col">
                <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-10">
                    <div className="container mx-auto px-4 flex justify-center">
                         <button onClick={() => onNavigate('home')}>
                            <img src="https://i0.wp.com/vellaperfumeria.com/wp-content/uploads/2025/06/1000003724-removebg-preview.png" alt="Vellaperfumeria Logo" className="h-20 w-auto" />
                        </button>
                    </div>
                </header>
                <div className="container mx-auto px-4 py-16 text-center flex-grow flex flex-col justify-center items-center">
                    <div className="max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu bolsa de compra está vacía</h2>
                        <p className="text-gray-500 mb-8">Parece que aún no has elegido tus productos de belleza favoritos.</p>
                        <button 
                            onClick={() => onNavigate('products', 'all')}
                            className="bg-brand-purple text-brand-primary font-bold py-3 px-8 rounded-lg hover:bg-brand-purple-dark transition-colors shadow-md w-full"
                        >
                            Ir a la Tienda
                        </button>
                    </div>
                </div>
                <footer className="bg-black border-t border-gray-800 py-12 mt-auto text-white">
                    <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-6">
                        <img 
                            src="https://i0.wp.com/vellaperfumeria.com/wp-content/uploads/2025/06/1000003724-removebg-preview.png" 
                            alt="Vellaperfumeria" 
                            className="h-12 w-auto" 
                        />
                        <p className="text-sm text-gray-400">© {new Date().getFullYear()} Vellaperfumeria. Todos los derechos reservados.</p>
                         <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-xs text-gray-400 uppercase tracking-wide text-center">
                            <button className="hover:text-white hover:underline transition-colors">Privacidad</button>
                            <button className="hover:text-white hover:underline transition-colors">Términos</button>
                            <button className="hover:text-white hover:underline transition-colors">Envíos</button>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
             {/* Dedicated Checkout Header - CENTRADO Y ARRIBA */}
            <header className="bg-white border-b border-gray-200 py-6 sticky top-0 z-20 shadow-sm">
                <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-3">
                    <button onClick={() => onNavigate('home')} className="hover:opacity-80 transition-opacity">
                        <img src="https://i0.wp.com/vellaperfumeria.com/wp-content/uploads/2025/06/1000003724-removebg-preview.png" alt="Vellaperfumeria Logo" className="h-32 w-auto" />
                    </button>
                    <div className="flex items-center text-sm font-medium text-gray-500">
                        <span className="mr-2">¿Necesitas ayuda?</span>
                        <button className="text-brand-purple-dark hover:underline font-semibold">Contactar</button>
                    </div>
                </div>
            </header>

            <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Finalizar Compra</h1>
                    <p className="text-gray-500 mt-2">Pago seguro y envío rápido.</p>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                    {/* Left Column: Forms */}
                    <div className="lg:w-2/3 space-y-6">
                        {/* Shipping Form */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center pb-4 border-b border-gray-100">
                                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</span>
                                Datos de Envío
                            </h2>
                            <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" name="firstName" required 
                                        value={formData.firstName} onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Apellidos <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" name="lastName" required 
                                        value={formData.lastName} onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none"
                                        placeholder="Tus apellidos"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección completa <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" name="address" required 
                                        value={formData.address} onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none"
                                        placeholder="Calle, número, piso..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" name="city" required 
                                        value={formData.city} onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Código Postal <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" name="zip" required 
                                        value={formData.zip} onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico <span className="text-red-500">*</span></label>
                                    <input 
                                        type="email" name="email" required 
                                        value={formData.email} onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none"
                                        placeholder="ejemplo@email.com"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono <span className="text-red-500">*</span></label>
                                    <input 
                                        type="tel" name="phone" required 
                                        value={formData.phone} onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all outline-none"
                                        placeholder="Para notificaciones de entrega"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
                             <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center pb-4 border-b border-gray-100">
                                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">2</span>
                                Método de Pago
                            </h2>
                            <div className="space-y-4">
                                <label className="relative flex items-center p-4 border-2 border-brand-purple bg-brand-purple/5 rounded-xl cursor-pointer transition-all hover:bg-brand-purple/10">
                                    <input type="radio" name="payment" defaultChecked className="h-5 w-5 text-brand-primary focus:ring-brand-purple border-gray-300" />
                                    <span className="ml-4 font-bold text-gray-900">Tarjeta de Crédito / Débito</span>
                                    <div className="ml-auto flex gap-2 grayscale-0">
                                        <VisaIcon />
                                        <MastercardIcon />
                                    </div>
                                </label>
                                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all hover:border-brand-purple">
                                    <input type="radio" name="payment" className="h-5 w-5 text-brand-primary focus:ring-brand-purple border-gray-300" />
                                    <span className="ml-4 font-medium text-gray-700">PayPal</span>
                                    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="ml-auto h-6" />
                                </label>
                                 <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all hover:border-brand-purple">
                                    <input type="radio" name="payment" className="h-5 w-5 text-brand-primary focus:ring-brand-purple border-gray-300" />
                                    <span className="ml-4 font-medium text-gray-700">Bizum</span>
                                    <span className="ml-auto font-bold text-brand-primary tracking-tight">bizum</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-32">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Resumen del Pedido</h3>
                            
                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-4 text-sm">
                                        <div className="relative flex-shrink-0">
                                            <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-contain rounded-lg border border-gray-100 bg-white" />
                                            <span className="absolute -top-2 -right-2 bg-brand-purple text-brand-primary font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium text-gray-800 line-clamp-2">{item.product.name}</p>
                                            <p className="text-gray-500 mt-1 text-xs">{item.selectedVariant ? Object.values(item.selectedVariant).join(', ') : ''}</p>
                                        </div>
                                        <div className="font-bold text-gray-900">
                                            {formatCurrency(item.product.price * item.quantity, currency)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Code */}
                            <div className="mb-6">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Código de cupón" 
                                        className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-purple focus:border-brand-purple outline-none"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleApplyCoupon}
                                        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-black transition-colors"
                                    >
                                        Aplicar
                                    </button>
                                </div>
                                {couponApplied && <p className="text-green-600 text-xs mt-2 font-medium">¡Cupón aplicado correctamente!</p>}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-3 text-sm mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(subtotal, currency)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-brand-purple-dark font-medium">
                                        <span>Descuentos</span>
                                        <span>-{formatCurrency(discountAmount, currency)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Envío</span>
                                    <span className="font-medium text-gray-900">{shippingCost === 0 ? 'GRATIS' : formatCurrency(shippingCost, currency)}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-base font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-extrabold text-brand-primary">{formatCurrency(total, currency)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 text-right">IVA incluido</p>
                            </div>

                             <div className="mb-6">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        className="mt-1 h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-purple" 
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    />
                                    <span className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors">
                                        He leído y acepto los <a href="#" className="underline hover:text-brand-purple-dark">Términos y Condiciones</a> y la <a href="#" className="underline hover:text-brand-purple-dark">Política de Privacidad</a>.
                                    </span>
                                </label>
                            </div>
                            
                            <button 
                                type="submit" 
                                form="checkout-form"
                                disabled={isProcessing}
                                className="w-full bg-black text-white font-bold py-4 px-6 rounded-xl hover:bg-gray-800 transition-all shadow-lg transform active:scale-95 flex justify-center items-center disabled:opacity-70 disabled:cursor-wait disabled:transform-none"
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {statusMessage || 'Procesando...'}
                                    </>
                                ) : 'Realizar el Pedido'}
                            </button>
                            
                            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-[10px] uppercase tracking-wider">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                <span>Pago Seguro SSL Encrypt</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Dedicated Checkout Footer */}
             <footer className="bg-black border-t border-gray-800 py-12 mt-auto text-white">
                <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-6">
                    <img 
                        src="https://i0.wp.com/vellaperfumeria.com/wp-content/uploads/2025/06/1000003724-removebg-preview.png" 
                        alt="Vellaperfumeria" 
                        className="h-12 w-auto" 
                    />
                    <p className="text-sm text-gray-400">© {new Date().getFullYear()} Vellaperfumeria. Todos los derechos reservados.</p>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-xs text-gray-400 uppercase tracking-wide text-center">
                        <button className="hover:text-white hover:underline transition-colors">Privacidad</button>
                        <button className="hover:text-white hover:underline transition-colors">Términos</button>
                        <button className="hover:text-white hover:underline transition-colors">Envíos</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CheckoutPage;
