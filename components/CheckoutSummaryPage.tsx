
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

// Icons
const CheckCircleIcon = () => (
    <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CreditCardIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const GooglePlayLogo = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 3.5L13.5 12L4.5 20.5V3.5Z" fill="#2196F3"/>
        <path d="M13.5 12L18.5 17L21.5 12L18.5 7L13.5 12Z" fill="#FFC107"/>
        <path d="M18.5 17L13.5 12L4.5 20.5L18.5 17Z" fill="#F44336"/>
        <path d="M4.5 3.5L13.5 12L18.5 7L4.5 3.5Z" fill="#4CAF50"/>
    </svg>
);

const CheckoutSummaryPage: React.FC<CheckoutSummaryPageProps> = ({ 
    cartItems, 
    currency, 
    onUpdateQuantity, 
    onRemoveItem,
    onNavigate
}) => {
    // --- STATE MANAGEMENT ---
    const [isOrderComplete, setIsOrderComplete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'google_play'>('card');
    
    // Shipping Form State
    const [shipping, setShipping] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        phone: ''
    });

    // Payment Form State
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    const [googlePlayCode, setGooglePlayCode] = useState('');

    // --- CALCULATIONS ---
    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }, [cartItems]);

    const discountAmount = useMemo(() => {
        return subtotal >= DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_PERCENTAGE : 0;
    }, [subtotal]);

    const shippingCost = useMemo(() => {
        const hasShippingSaver = cartItems.some(item => item.product.isShippingSaver);
        return (hasShippingSaver || subtotal >= FREE_SHIPPING_THRESHOLD) ? 0 : SHIPPING_COST;
    }, [subtotal, cartItems]);

    const total = subtotal - discountAmount + shippingCost;

    // --- HANDLERS ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShipping(prev => ({ ...prev, [name]: value }));
    };

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleFinalizeOrder = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic Validation
        if (!shipping.name || !shipping.address || !shipping.phone) {
            alert("Por favor, completa los datos de envío.");
            return;
        }

        if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.cvc)) {
            alert("Por favor, completa los datos de la tarjeta.");
            return;
        }

        setIsProcessing(true);

        // Simulate API call / Payment Processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsOrderComplete(true);
            window.scrollTo(0, 0);
        }, 2500);
    };

    // --- SUCCESS VIEW ---
    if (isOrderComplete) {
        return (
            <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
                <div className="bg-white rounded-3xl p-12 shadow-xl border border-fuchsia-50 max-w-2xl mx-auto">
                    <div className="flex justify-center mb-6">
                        <CheckCircleIcon />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">¡Pedido Confirmado!</h1>
                    <p className="text-xl text-gray-600 mb-8">Gracias por tu compra en Vellaperfumeria Store.</p>
                    
                    <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Detalles del pedido</h3>
                        <p className="mb-2"><span className="font-semibold">Nº Pedido:</span> #VP-{Math.floor(Math.random() * 100000)}</p>
                        <p className="mb-2"><span className="font-semibold">Total Pagado:</span> {formatCurrency(total, currency)}</p>
                        <p className="mb-2"><span className="font-semibold">Método de Pago:</span> {paymentMethod === 'card' ? 'Tarjeta de Crédito' : 'Google Play'}</p>
                        <p className="mb-2"><span className="font-semibold">Enviar a:</span> {shipping.name}, {shipping.address}</p>
                    </div>

                    <button 
                        onClick={() => onNavigate('home')}
                        className="bg-black text-white font-bold py-4 px-10 rounded-full hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-lg"
                    >
                        Volver a la Tienda
                    </button>
                </div>
            </div>
        );
    }

    // --- EMPTY CART VIEW ---
    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-fuchsia-50 max-w-xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
                    <button 
                        onClick={() => onNavigate('products')}
                        className="bg-black text-white font-bold py-3 px-8 rounded-full shadow-lg"
                    >
                        Ir a Comprar
                    </button>
                </div>
            </div>
        );
    }

    // --- CHECKOUT FORM VIEW ---
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-lg">1</span>
                Finalizar Compra
            </h1>

            <form onSubmit={handleFinalizeOrder} className="flex flex-col lg:flex-row gap-8">
                
                {/* LEFT COLUMN: FORMS */}
                <div className="lg:w-2/3 space-y-8">
                    
                    {/* 1. SHIPPING ADDRESS */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-fuchsia-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Dirección de Envío
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre Completo</label>
                                <input required type="text" name="name" value={shipping.name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" placeholder="Ej: Ana García" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dirección</label>
                                <input required type="text" name="address" value={shipping.address} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" placeholder="Calle, Número, Piso..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ciudad</label>
                                <input required type="text" name="city" value={shipping.city} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Código Postal</label>
                                <input required type="text" name="zip" value={shipping.zip} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Teléfono Móvil</label>
                                <input required type="tel" name="phone" value={shipping.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" placeholder="600 000 000" />
                            </div>
                        </div>
                    </div>

                    {/* 2. PAYMENT METHOD */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <CreditCardIcon />
                            Método de Pago
                        </h2>

                        {/* Payment Tabs */}
                        <div className="flex gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('card')}
                                className={`flex-1 py-4 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}
                            >
                                <CreditCardIcon />
                                <span className="font-bold">Tarjeta</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('google_play')}
                                className={`flex-1 py-4 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === 'google_play' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
                            >
                                <GooglePlayLogo />
                                <span className="font-bold">Google Play</span>
                            </button>
                        </div>

                        {/* Credit Card Form */}
                        {paymentMethod === 'card' && (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Número de Tarjeta</label>
                                    <div className="relative">
                                        <input required type="text" name="number" maxLength={19} placeholder="0000 0000 0000 0000" value={cardDetails.number} onChange={handleCardChange} className="w-full border border-gray-300 rounded-lg p-3 pl-12 focus:ring-2 focus:ring-black outline-none font-mono" />
                                        <div className="absolute left-3 top-3 text-gray-400">
                                            <CreditCardIcon />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Caducidad (MM/YY)</label>
                                        <input required type="text" name="expiry" placeholder="MM/YY" maxLength={5} value={cardDetails.expiry} onChange={handleCardChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none font-mono text-center" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CVC</label>
                                        <input required type="text" name="cvc" placeholder="123" maxLength={4} value={cardDetails.cvc} onChange={handleCardChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none font-mono text-center" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Titular de la Tarjeta</label>
                                    <input required type="text" name="name" placeholder="Como aparece en la tarjeta" value={cardDetails.name} onChange={handleCardChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" />
                                </div>
                            </div>
                        )}

                        {/* Google Play Form */}
                        {paymentMethod === 'google_play' && (
                            <div className="space-y-4 animate-fade-in bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <GooglePlayLogo />
                                    <h3 className="font-bold text-gray-800">Saldo de Google Play</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">Utiliza tu saldo de Google Play o canjea una tarjeta regalo.</p>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Código de Tarjeta Regalo / Play</label>
                                    <input type="text" placeholder="Introducir código (opcional)" value={googlePlayCode} onChange={(e) => setGooglePlayCode(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <input type="checkbox" id="gp-balance" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                                    <label htmlFor="gp-balance" className="text-sm text-gray-700">Usar saldo disponible</label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: SUMMARY */}
                <div className="lg:w-1/3">
                    <div className="bg-gray-50 p-6 rounded-2xl sticky top-24 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen</h2>
                        
                        {/* Compact Product List */}
                        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <div className="flex gap-2">
                                        <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                                            {item.quantity}
                                        </div>
                                        <span className="text-gray-600 line-clamp-1 w-40">{item.product.name}</span>
                                    </div>
                                    <span className="font-medium">{formatCurrency(item.product.price * item.quantity, currency)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal, currency)}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-fuchsia-600">
                                    <span>Descuento</span>
                                    <span>-{formatCurrency(discountAmount, currency)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Envío</span>
                                <span className={shippingCost === 0 ? "text-green-600 font-bold" : ""}>
                                    {shippingCost === 0 ? "GRATIS" : formatCurrency(shippingCost, currency)}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-end mb-6">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-3xl font-extrabold text-[var(--color-primary-solid)]">{formatCurrency(total, currency)}</span>
                        </div>

                        <button 
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full bg-black text-white font-bold py-4 rounded-xl shadow-lg hover:bg-gray-800 transition-all transform hover:-translate-y-1 flex justify-center items-center gap-2 ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    PAGAR {formatCurrency(total, currency)}
                                </>
                            )}
                        </button>

                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            <span>Pago Seguro SSL 256-bit</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutSummaryPage;
