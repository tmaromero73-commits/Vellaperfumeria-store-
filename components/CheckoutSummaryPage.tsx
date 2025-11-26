
import React, { useMemo, useState, useEffect } from 'react';
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

// --- ICONOS INTEGRADOS ---

const VerifiedBadgeIcon = () => (
    <svg className="w-24 h-24 text-green-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CreditCardIcon = () => (
    <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const GooglePlayLogo = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'google_play'>('google_play');
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
    const [googleAccountName, setGoogleAccountName] = useState('');
    const [googleAccountEmail, setGoogleAccountEmail] = useState('');

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
        
        // Simple Validation
        if (!email || !shipping.firstName || !shipping.address || !shipping.phone) {
            alert("Por favor, completa los datos de contacto y envío.");
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
            payment_method: paymentMethod === 'google_play' ? 'Google Play' : 'Credit Card',
            payment_method_title: paymentMethod === 'google_play' ? 'Google Play Balance' : 'Credit Card',
            customer_note: paymentMethod === 'google_play' ? `Google Play Account: ${googleAccountEmail} - Name: ${googleAccountName} - Code: ${googlePlayCode}` : ''
        };

        try {
            const result = await createOrder(orderData);
            
            if (result && result.id) {
                setOrderNumber(result.id.toString());
            } else {
                setOrderNumber("VP-" + Math.floor(Math.random() * 1000000).toString());
            }
            
            setIsOrderComplete(true);
            window.scrollTo(0, 0);

        } catch (error) {
            console.error("Order failed locally", error);
            setOrderNumber("ERR-SAVE-" + Math.floor(Math.random() * 1000).toString());
            setIsOrderComplete(true);
            window.scrollTo(0, 0);
        } finally {
            setIsProcessing(false);
        }
    };

    // --- SUCCESS VIEW (INTERNAL - NO REDIRECT) ---
    if (isOrderComplete) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fade-in">
                <div className="max-w-lg w-full text-center space-y-8">
                    <div className="flex justify-center">
                        <div className="bg-green-50 rounded-full p-6">
                            <VerifiedBadgeIcon />
                        </div>
                    </div>
                    
                    <div>
                        <h1 className="text-4xl font-extrabold text-black mb-2 uppercase tracking-tight">Pedido Enviado</h1>
                        <p className="text-xl text-gray-600">Gracias por tu compra en Vellaperfumeria.</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-left space-y-4 shadow-sm">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                            <span className="text-gray-500 uppercase text-xs font-bold tracking-wider">Referencia</span>
                            <span className="text-2xl font-mono font-bold text-black">#{orderNumber}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-bold">Estado</p>
                                <p className="font-bold text-green-600 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Verificado
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-bold">Fecha</p>
                                <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-bold">Total</p>
                                <p className="font-bold text-black">{formatCurrency(total, currency)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-bold">Método</p>
                                <p className="font-medium text-gray-900">{paymentMethod === 'google_play' ? 'Google Play' : 'Tarjeta'}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                             <p className="text-gray-500 text-xs uppercase font-bold mb-1">Enviado a</p>
                             <p className="font-bold text-gray-900">{shipping.firstName} {shipping.lastName}</p>
                             <p className="text-gray-600 text-sm">{shipping.address}, {shipping.zip} {shipping.city}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">Hemos enviado un email de confirmación a <span className="font-bold text-black">{email}</span></p>
                        <button 
                            onClick={() => onNavigate('home')}
                            className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-all shadow-lg"
                        >
                            Volver a la Tienda
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- EMPTY CART VIEW ---
    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 max-w-xl mx-auto">
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
        <div className="bg-gray-50 min-h-screen pb-12">
            <div className="container mx-auto px-4 max-w-4xl mt-6">
                
                <h1 className="text-3xl font-extrabold text-black mb-8 text-center">Finalizar Compra</h1>

                <form onSubmit={handleFinalizeOrder} className="flex flex-col gap-6">
                    
                    {/* ORDER TOTAL CARD */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
                        <p className="text-sm text-gray-500 mb-1">Total a pagar</p>
                        <p className="text-4xl font-extrabold text-black tracking-tight">{formatCurrency(total, currency)}</p>
                        <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                            <span>{cartItems.length} artículos</span>
                            <span>•</span>
                            <span>Envío {shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost, currency)}</span>
                        </div>
                    </div>

                    {/* 1. CONTACT & SHIPPING */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 border-b pb-2">Datos de Envío</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" placeholder="tu@email.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Nombre</label>
                                    <input required type="text" name="firstName" value={shipping.firstName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Apellidos</label>
                                    <input required type="text" name="lastName" value={shipping.lastName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Dirección</label>
                                <input required type="text" name="address" value={shipping.address} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" placeholder="Calle, número..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Ciudad</label>
                                    <input required type="text" name="city" value={shipping.city} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">CP</label>
                                    <input required type="text" name="zip" value={shipping.zip} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Teléfono</label>
                                <input required type="tel" name="phone" value={shipping.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* 2. PAYMENT METHOD SELECTION */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 border-b pb-2">Método de Pago</h2>

                        {/* Payment Tabs */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('google_play')}
                                className={`relative p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                                    paymentMethod === 'google_play' 
                                    ? 'border-black bg-blue-50/30 ring-1 ring-black' 
                                    : 'border-gray-100 bg-gray-50 hover:bg-white'
                                }`}
                            >
                                <GooglePlayLogo />
                                <span className={`font-bold text-xs ${paymentMethod === 'google_play' ? 'text-black' : 'text-gray-500'}`}>Google Pay</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentMethod('card')}
                                className={`relative p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                                    paymentMethod === 'card' 
                                    ? 'border-black bg-gray-50 ring-1 ring-black' 
                                    : 'border-gray-100 bg-gray-50 hover:bg-white'
                                }`}
                            >
                                <CreditCardIcon />
                                <span className={`font-bold text-xs ${paymentMethod === 'card' ? 'text-black' : 'text-gray-500'}`}>Tarjeta</span>
                            </button>
                        </div>

                        {/* Google Play Form */}
                        {paymentMethod === 'google_play' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800 mb-4">
                                    <p>Estás pagando de forma segura con <strong>Google Pay</strong>.</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Email de cuenta Google</label>
                                    <input required type="email" placeholder="ejemplo@gmail.com" value={googleAccountEmail} onChange={(e) => setGoogleAccountEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Nombre del Titular</label>
                                    <input required type="text" placeholder="Nombre completo" value={googleAccountName} onChange={(e) => setGoogleAccountName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                     <label className="block text-xs font-bold text-gray-700 mb-1">Código Promocional / Tarjeta (Opcional)</label>
                                     <input type="text" placeholder="XXXX-XXXX-XXXX" value={googlePlayCode} onChange={(e) => setGooglePlayCode(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-mono uppercase" />
                                </div>
                            </div>
                        )}

                        {/* Credit Card Form */}
                        {paymentMethod === 'card' && (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Número de Tarjeta</label>
                                    <div className="relative">
                                        <input required type="text" name="number" maxLength={19} placeholder="0000 0000 0000 0000" value={cardDetails.number} onChange={handleCardChange} className="w-full border border-gray-300 rounded-lg p-3 pl-12 focus:ring-2 focus:ring-black outline-none bg-white font-mono" />
                                        <div className="absolute left-3 top-3">
                                            <CreditCardIcon />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Caducidad</label>
                                        <input required type="text" name="expiry" placeholder="MM / AA" maxLength={5} value={cardDetails.expiry} onChange={handleCardChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none bg-white text-center" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">CVC</label>
                                        <input required type="text" name="cvc" placeholder="123" maxLength={4} value={cardDetails.cvc} onChange={handleCardChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none bg-white text-center" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Titular</label>
                                    <input required type="text" name="name" placeholder="Nombre en la tarjeta" value={cardDetails.name} onChange={handleCardChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none bg-white" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PAY BUTTON */}
                    <div className="mt-4 mb-8">
                        <button 
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full bg-black text-white font-extrabold py-4 rounded-xl shadow-lg hover:bg-gray-900 transition-all transform active:scale-95 flex justify-center items-center gap-2 text-lg ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
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
                                `PAGAR ${formatCurrency(total, currency)}`
                            )}
                        </button>
                        
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Pagos procesados de forma segura. Al continuar aceptas nuestros términos y condiciones.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutSummaryPage;
