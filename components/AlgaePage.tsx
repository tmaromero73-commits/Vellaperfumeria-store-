import React, { useState, useMemo, useEffect, useRef } from 'react';
import { type Currency, formatCurrency } from './currency';
import type { CartItem, View } from './types';
import ExpressPayment from './ExpressPayment';

// As a world-class senior frontend engineer, I must declare this so TypeScript knows about the Stripe script loaded in index.html.
declare global {
    interface Window {
        Stripe: any;
    }
}

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


interface ShippingOption {
    id: number;
    name: string;
    time: string;
    cost: number;
}

const shippingOptions: ShippingOption[] = [
    { id: 1, name: 'Envío Estándar', time: '2 días laborables', cost: 6.00 },
    { id: 3, name: 'Recogida en Tienda', time: 'Disponible en 24h', cost: 0.00 },
];

interface AlgaePageProps {
    cartItems: CartItem[];
    currency: Currency;
    onNavigate: (view: View) => void;
    onOrderComplete: () => void;
    stripe: any;
}

const AlgaePage: React.FC<AlgaePageProps> = ({ cartItems, currency, onNavigate, onOrderComplete, stripe }) => {
    const [selectedShippingId, setSelectedShippingId] = useState<number>(shippingOptions[0].id);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [stripeError, setStripeError] = useState<string | null>(null);

    // Stripe-related state
    const [cardElement, setCardElement] = useState<any>(null);
    const cardElementRef = useRef<HTMLDivElement>(null);

    // Initialize Stripe and mount the Card Element
    useEffect(() => {
        if (stripe) {
            const elements = stripe.elements();
            const card = elements.create('card', {
                style: {
                    base: {
                        color: '#32325d',
                        fontFamily: '"Raleway", sans-serif',
                        fontSmoothing: 'antialiased',
                        fontSize: '16px',
                        '::placeholder': {
                            color: '#aab7c4'
                        }
                    },
                    invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a'
                    }
                }
            });

            if (cardElementRef.current) {
                card.mount(cardElementRef.current);
            }
            setCardElement(card);
            
            return () => {
                card.destroy();
            };
        }
    }, [stripe]);

    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }, [cartItems]);

    const selectedShippingOption = shippingOptions.find(option => option.id === selectedShippingId) || shippingOptions[0];
    const total = subtotal - (subtotal * discount) + selectedShippingOption.cost;

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === 'DESCUENTO10') {
            setDiscount(0.10); // 10% discount
            alert('¡Cupón aplicado con éxito!');
        } else {
            alert('El código del cupón no es válido.');
            setDiscount(0);
        }
    };
    
    const handlePlaceOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        if (paymentMethod !== 'card' || !stripe || !cardElement) {
             // For non-card payments, use the original simulation flow
             setIsProcessing(true);
             setTimeout(() => {
                 onOrderComplete();
                 setIsProcessing(false);
             }, 1500);
            return;
        }

        setIsProcessing(true);
        setStripeError(null);

        const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                // You can collect name, email, address from the form fields
                name: 'Tsmara Moreno',
            },
        });

        if (error) {
            setStripeError(error.message);
            setIsProcessing(false);
            return;
        }

        //
        // --- BACKEND INTEGRATION POINT ---
        //
        // TODO: Send `stripePaymentMethod.id` to your backend server.
        // The backend server will use the Stripe secret key to create a charge
        // or a PaymentIntent to complete the transaction.
        //
        // Example backend call:
        //
        // const response = await fetch('/api/charge', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     paymentMethodId: stripePaymentMethod.id,
        //     amount: Math.round(total * 100), // Stripe expects amount in cents
        //     currency: currency.toLowerCase(),
        //     cart: cartItems
        //   }),
        // });
        // const paymentResult = await response.json();
        // if (paymentResult.success) {
        //   onOrderComplete();
        // } else {
        //   setStripeError("Payment failed. Please try again.");
        // }

        // --- SIMULATION FOR FRONTEND DEMO ---
        console.log('Generated Stripe PaymentMethod:', stripePaymentMethod);
        // We successfully tokenized the card. Now we simulate the backend call.
        setTimeout(() => {
            onOrderComplete();
            setIsProcessing(false);
        }, 2500);
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto text-center py-20">
                <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
                <p className="mt-4 text-gray-600">No puedes finalizar la compra sin productos.</p>
                <button
                    onClick={() => onNavigate('products')}
                    className="mt-6 bg-brand-lilac text-black font-semibold py-2 px-8 rounded-lg hover:bg-brand-lilac-dark transition-colors"
                >
                    Ir a la tienda
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto grid lg:grid-cols-5 gap-12 p-4 md:p-8">
                
                {/* Left Column: Forms */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-8 rounded-lg shadow-sm border space-y-8">
                        <ExpressPayment 
                            stripe={stripe} 
                            total={total} 
                            currency={currency} 
                            onOrderComplete={onOrderComplete}
                        />

                         <div className="flex items-center">
                            <span className="flex-grow border-t"></span>
                            <span className="px-4 text-sm font-semibold text-gray-500">O</span>
                            <span className="flex-grow border-t"></span>
                        </div>
                    
                        <form>
                             {/* Contact Information */}
                            <div>
                                <h3 className="text-xl font-bold mb-4 border-b pb-2">Información de contacto</h3>
                                <label htmlFor="checkout_email" className="block text-sm font-medium text-gray-700 mb-1">Dirección de email</label>
                                <input type="email" id="checkout_email" defaultValue="tmaromero73@gmail.com" className="w-full px-3 py-2 border rounded-md mb-3" />
                                <div className="flex items-center">
                                    <input type="checkbox" id="newsletter" className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black/50" />
                                    <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-900">Quiero recibir emails con descuentos e información.</label>
                                </div>
                            </div>

                             {/* Shipping Address */}
                             <div>
                                <h3 className="text-xl font-bold mt-8 mb-4 border-b pb-2">Dirección de envío</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">País</label>
                                        <select id="country" className="w-full px-3 py-2 border rounded-md bg-white">
                                            <option>España</option>
                                            <option>Portugal</option>
                                            <option>Andorra</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Nombre y apellidos</label>
                                        <input type="text" id="full_name" defaultValue="Tsmara Moreno" className="w-full px-3 py-2 border rounded-md" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                        <input type="text" id="address" className="w-full px-3 py-2 border rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                                        <input type="text" id="city" defaultValue="Madrid" className="w-full px-3 py-2 border rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                                        <input type="text" id="postal_code" defaultValue="28760" className="w-full px-3 py-2 border rounded-md" />
                                    </div>
                                    <div className="md:col-span-2">
                                         <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                        <input type="tel" id="phone" defaultValue="+34 661 20 26 16" className="w-full px-3 py-2 border rounded-md" />
                                    </div>
                                </div>
                            </div>
                            
                             {/* Shipping Method */}
                            <div>
                                <h3 className="text-xl font-bold mt-8 mb-4 border-b pb-2">Método de envío</h3>
                                <div className="space-y-3">
                                    {shippingOptions.map((option) => (
                                        <label
                                            key={option.id}
                                            htmlFor={`shipping-${option.id}`}
                                            className={`border rounded-md p-4 flex justify-between items-center cursor-pointer transition-all ${selectedShippingId === option.id ? 'border-brand-lilac-dark ring-2 ring-brand-lilac' : 'border-gray-200'}`}
                                        >
                                            <div>
                                                <span className="font-semibold">{option.name}</span>
                                                <p className="text-sm text-gray-700">{option.time}</p>
                                            </div>
                                            <span className="font-semibold">{formatCurrency(option.cost, currency, { decimals: 2 })}</span>
                                            <input
                                                type="radio"
                                                id={`shipping-${option.id}`}
                                                name="shipping"
                                                value={option.id}
                                                checked={selectedShippingId === option.id}
                                                onChange={() => setSelectedShippingId(option.id)}
                                                className="hidden"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                             {/* Payment Method */}
                            <div>
                                <h3 className="text-xl font-bold mt-8 mb-4 border-b pb-2">Pago</h3>
                                <div className="space-y-3">
                                    {/* Credit Card with Stripe */}
                                    <div className={`border rounded-md transition-all ${paymentMethod === 'card' ? 'border-brand-lilac-dark ring-2 ring-brand-lilac' : 'border-gray-200'}`}>
                                        <label htmlFor="card" className="p-4 flex items-center cursor-pointer">
                                            <input type="radio" id="card" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-4 w-4 text-black border-gray-300 focus:ring-black/50" />
                                            <span className="ml-3 font-semibold">Tarjeta de Crédito / Débito (Pago Seguro)</span>
                                        </label>
                                        {paymentMethod === 'card' && (
                                            <div className="border-t p-4 bg-gray-50">
                                                <div ref={cardElementRef} className="p-2 border rounded-md bg-white"></div>
                                                {stripeError && <div className="text-red-600 text-sm mt-2">{stripeError}</div>}
                                            </div>
                                        )}
                                    </div>
                                    {/* PayPal */}
                                    <label htmlFor="paypal" className={`border rounded-md p-4 flex items-center cursor-pointer ${paymentMethod === 'paypal' ? 'border-brand-lilac-dark ring-2 ring-brand-lilac' : 'border-gray-200'}`}>
                                        <input type="radio" id="paypal" name="payment" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} className="h-4 w-4 text-black border-gray-300 focus:ring-black/50" />
                                        <span className="ml-3 font-semibold">PayPal</span>
                                    </label>
                                    {/* Cash on Delivery */}
                                    <label htmlFor="cod" className={`border rounded-md p-4 flex items-center cursor-pointer ${paymentMethod === 'cod' ? 'border-brand-lilac-dark ring-2 ring-brand-lilac' : 'border-gray-200'}`}>
                                        <input type="radio" id="cod" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-4 w-4 text-black border-gray-300 focus:ring-black/50" />
                                        <span className="ml-3 font-semibold">Contra reembolso</span>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-2">
                     <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
                        <h3 className="text-xl font-bold mb-4 border-b pb-3">Resumen del pedido</h3>
                        
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="relative">
                                        <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-contain rounded-md border p-1" />
                                        <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{item.quantity}</span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-sm leading-tight">{item.product.name}</p>
                                    </div>
                                    <p className="font-semibold text-sm">{formatCurrency(item.product.price * item.quantity, currency)}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex gap-2 my-4">
                            <input 
                                type="text" 
                                placeholder="Código de descuento" 
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                            <button onClick={handleApplyCoupon} className="bg-gray-200 text-black font-semibold px-4 rounded-md hover:bg-gray-300 text-sm">Aplicar</button>
                        </div>

                        <div className="space-y-2 text-base border-t pt-4">
                            <div className="flex justify-between">
                                <span className="text-gray-700">Subtotal</span>
                                <span className="font-semibold">{formatCurrency(subtotal, currency)}</span>
                            </div>
                             {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Descuento ({discount * 100}%)</span>
                                    <span>-{formatCurrency(subtotal * discount, currency)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-700">Envío</span>
                                <span className="font-semibold">{formatCurrency(selectedShippingOption.cost, currency)}</span>
                            </div>
                            <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatCurrency(total, currency)}</span>
                            </div>
                        </div>

                        <div className="flex items-start mt-6">
                            <input type="checkbox" id="terms" className="h-4 w-4 mt-1 text-black border-gray-300 rounded focus:ring-black/50" />
                            <label htmlFor="terms" className="ml-2 block text-xs text-gray-700">He leído y acepto los <a href="#" className="font-semibold hover:underline">términos y condiciones</a> y la <a href="#" className="font-semibold hover:underline">política de privacidad</a>.</label>
                        </div>
                        
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                            className="flex items-center justify-center w-full bg-brand-lilac text-black font-bold py-3 rounded-lg mt-4 hover:bg-brand-lilac-dark transition-colors disabled:bg-gray-300 disabled:cursor-wait"
                        >
                            {isProcessing ? (
                                <>
                                    <SpinnerIcon />
                                    Procesando...
                                </>
                            ) : (
                                'Realizar Pedido'
                            )}
                        </button>
                         <p className="text-xs text-gray-600 mt-4 text-center flex items-center justify-center">
                            <LockIcon /> Pago 100% Seguro
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AlgaePage;