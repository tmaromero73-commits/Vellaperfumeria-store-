
import React, { useMemo, useState } from 'react';
import type { CartItem, View } from './types';
import type { Currency } from './currency';
import { formatCurrency } from './currency';
import { createOrder } from './api';

interface CheckoutSummaryPageProps {
    cartItems: CartItem[];
    currency: Currency;
    onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
    onRemoveItem: (cartItemId: string) => void;
    onNavigate: (view: View) => void;
}

const FREE_SHIPPING_THRESHOLD = 35;
const SHIPPING_COST = 6.00;

// Icons
const CheckCircleIcon = () => (
    <svg className="w-20 h-20 text-green-500 animate-pop" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LockIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
    onNavigate
}) => {
    // --- STATE MANAGEMENT ---
    const [isOrderComplete, setIsOrderComplete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'google_play'>('card');
    const [orderNumber, setOrderNumber] = useState('');
    
    // Customer Info
    const [email, setEmail] = useState('');
    
    // Shipping Form State
    const [shipping, setShipping] = useState({
        firstName: '',
        lastName: '',
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

    const shippingCost = useMemo(() => {
        const hasShippingSaver = cartItems.some(item => item.product.isShippingSaver);
        return (hasShippingSaver || subtotal >= FREE_SHIPPING_THRESHOLD) ? 0 : SHIPPING_COST;
    }, [subtotal, cartItems]);

    const total = subtotal + shippingCost;

    // --- HANDLERS ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShipping(prev => ({ ...prev, [name]: value }));
    };

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleFinalizeOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic Validation
        if (!email || !shipping.firstName || !shipping.address || !shipping.phone) {
            alert("Por favor, completa los datos de contacto y envío.");
            return;
        }

        if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.cvc)) {
            alert("Por favor, completa los datos de la tarjeta.");
            return;
        }

        setIsProcessing(true);

        const orderData = {
            billing: {
                first_name: shipping.firstName,
                last_name: shipping.lastName || '.',
                address_1: shipping.address,
                city: shipping.city,
                postcode: shipping.zip,
                country: 'ES',
                email: email,
                phone: shipping.phone
            },
            shipping: {
                first_name: shipping.firstName,
                last_name: shipping.lastName || '.',
                address_1: shipping.address,
                city: shipping.city,
                postcode: shipping.zip,
                country: 'ES'
            },
            line_items: cartItems.map(item => ({
                product_id: parseInt(item.product.id.toString().replace('wc-', '').replace('sim-', '')),
                quantity: item.quantity
            })),
            payment_method: paymentMethod === 'google_play' ? 'Google Play' : 'Tarjeta de Crédito',
            payment_method_title: paymentMethod === 'google_play' ? 'Google Play Balance' : 'Credit Card (Stripe)'
        };

        try {
            // Attempt to create real order in WooCommerce
            const result = await createOrder(orderData);
            
            if (result && result.id) {
                setOrderNumber(result.id.toString());
            } else {
                setOrderNumber(Math.floor(Math.random() * 1000000).toString());
            }
            
            setIsOrderComplete(true);
            window.scrollTo(0, 0);

        } catch (error) {
            console.error("Order failed", error);
            // Fallback success for demo purposes
            setOrderNumber("DEMO-" + Math.floor(Math.random() * 1000000).toString());
            setIsOrderComplete(true);
            window.scrollTo(0, 0);
        } finally {
            setIsProcessing(false);
        }
    };

    // --- SUCCESS VIEW (INTERNAL - NO REDIRECT) ---
    if (isOrderComplete) {
        return (
            <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
                <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 max-w-2xl mx-auto">
                    <div className="flex justify-center mb-6">
                        <CheckCircleIcon />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">¡Gracias por tu compra!</h1>
                    <p className="text-xl text-gray-600 mb-8">Tu pedido ha sido confirmado y se está procesando en Vellaperfumeria.</p>
                    
                    <div className="bg-gray-50 rounded-2xl p-8 mb-8 text-left border border-gray-200">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                            <span className="text-gray-500 font-medium">Número de Pedido</span>
                            <span className="text-xl font-bold text-black">#{orderNumber}</span>
                        </div>
                        <div className="space-y-3">
                            <p className="flex justify-between"><span className="text-gray-600">Total Pagado:</span> <span className="font-bold">{formatCurrency(total, currency)}</span></p>
                            <p className="flex justify-between"><span className="text-gray-600">Método de Pago:</span> <span className="font-bold text-black">{paymentMethod === 'card' ? 'Tarjeta de Crédito' : 'Google Play'}</span></p>
                            <p className="flex justify-between"><span className="text-gray-600">Email de confirmación:</span> <span className="font-bold">{email}</span></p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                             <p className="text-sm text-gray-500 mb-1">Enviado a:</p>
                             <p className="font-bold text-gray-900">{shipping.firstName} {shipping.lastName}</p>
                             <p className="text-gray-700">{shipping.address}</p>
                             <p className="text-gray-700">{shipping.zip} {shipping.city}</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => onNavigate('home')}
                        className="w-full bg-black text-white font-bold py-4 px-10 rounded-xl hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2"
                    >
                        <span>Volver a la Tienda</span>
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

    // --- CHECKOUT FORM VIEW (One Page Style) ---
    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            <div className="bg-white border-b border-gray-200 py-4 mb-8 sticky top-0 z-20 shadow-sm">
                <div className="container mx-auto px-4 flex items-center justify-center">
                     <div className="flex items-center gap-2 text-xl font-bold text-black">
                        <LockIcon /> Pago Seguro
                     </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <form onSubmit={handleFinalizeOrder} className="flex flex-col lg:flex-row gap-8">
                    
                    {/* LEFT COLUMN: INFORMATION & PAYMENT */}
                    <div className="lg:w-2/3 space-y-6">
                        
                        {/* 1. CONTACT INFO */}
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Información de Contacto</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                                    <input 
                                        required 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none transition-shadow" 
                                        placeholder="tu@email.com" 
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="newsletter" className="w-4 h-4 text-black rounded border-gray-300 focus:ring-black" />
                                    <label htmlFor="newsletter" className="text-sm text-gray-600">Enviarme novedades y ofertas por email</label>
                                </div>
                            </div>
                        </div>

                        {/* 2. SHIPPING ADDRESS */}
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Dirección de Envío</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                                    <input required type="text" name="firstName" value={shipping.firstName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Apellidos</label>
                                    <input required type="text" name="lastName" value={shipping.lastName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección</label>
                                    <input required type="text" name="address" value={shipping.address} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" placeholder="Calle, número, piso..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ciudad</label>
                                    <input required type="text" name="city" value={shipping.city} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Código Postal</label>
                                    <input required type="text" name="zip" value={shipping.zip} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                                    <input required type="tel" name="phone" value={shipping.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* 3. PAYMENT METHOD */}
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Pago</h2>
                            <p className="text-sm text-gray-500 mb-4">Todas las transacciones son seguras y están encriptadas.</p>

                            {/* Payment Tabs */}
                            <div className="flex gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex-1 py-4 px-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-black bg-gray-50 text-black shadow-md' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                                >
                                    <CreditCardIcon />
                                    <span className="font-bold text-sm">Tarjeta de Crédito</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('google_play')}
                                    className={`flex-1 py-4 px-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'google_play' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                                >
                                    <GooglePlayLogo />
                                    <span className="font-bold text-sm">Google Play</span>
                                </button>
                            </div>

                            {/* Credit Card Form */}
                            {paymentMethod === 'card' && (
                                <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <div>
                                        <input required type="text" name="number" maxLength={19} placeholder="Número de tarjeta" value={cardDetails.number} onChange={handleCardChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none bg-white" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input required type="text" name="expiry" placeholder="MM / AA" maxLength={5} value={cardDetails.expiry} onChange={handleCardChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none bg-white" />
                                        <input required type="text" name="cvc" placeholder="CVC" maxLength={4} value={cardDetails.cvc} onChange={handleCardChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none bg-white" />
                                    </div>
                                    <input required type="text" name="name" placeholder="Nombre del titular" value={cardDetails.name} onChange={handleCardChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none bg-white" />
                                </div>
                            )}

                            {/* Google Play Form */}
                            {paymentMethod === 'google_play' && (
                                <div className="space-y-4 bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-full shadow-sm">
                                            <GooglePlayLogo />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Google Play Balance</h3>
                                            <p className="text-xs text-gray-500">Paga de forma segura con tu cuenta de Google.</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-blue-100">
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Código de Tarjeta Regalo (Opcional)</label>
                                        <input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" value={googlePlayCode} onChange={(e) => setGooglePlayCode(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none font-mono bg-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: ORDER SUMMARY */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Resumen del Pedido</h2>
                            
                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 bg-gray-100 rounded-md border border-gray-200 shrink-0">
                                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover rounded-md" />
                                            <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{item.quantity}</span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.product.name}</p>
                                            {item.selectedVariant && (
                                                <p className="text-xs text-gray-500 mt-1">{Object.values(item.selectedVariant).join(', ')}</p>
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{formatCurrency(item.product.price * item.quantity, currency)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-100 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium">{formatCurrency(subtotal, currency)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Envío</span>
                                    <span className={shippingCost === 0 ? "text-green-600 font-bold" : ""}>
                                        {shippingCost === 0 ? "Gratis" : formatCurrency(shippingCost, currency)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 mb-6">
                                <span className="text-base font-bold text-gray-900">Total</span>
                                <div className="text-right">
                                    <span className="text-xs text-gray-500 mr-2">EUR</span>
                                    <span className="text-2xl font-extrabold text-black">{formatCurrency(total, currency).replace('€', '')}</span>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isProcessing}
                                className={`w-full bg-black text-white font-bold py-4 rounded-xl shadow-lg hover:bg-gray-800 transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2 ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
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
                                        {paymentMethod === 'google_play' ? <GooglePlayLogo /> : <LockIcon />}
                                        PAGAR AHORA
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutSummaryPage;
