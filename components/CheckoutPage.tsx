
import React, { useState, useMemo } from 'react';
import type { CartItem } from './types';
import type { Currency } from './currency';
import { formatCurrency } from './currency';

interface CheckoutPageProps {
    cartItems: CartItem[];
    currency: Currency;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, currency }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');

    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }, [cartItems]);

    const shippingCost = subtotal >= 35 || cartItems.some(item => item.product.isShippingSaver) ? 0 : 6.00;
    const total = subtotal + shippingCost;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
             <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl font-extrabold text-brand-primary">Finalizar Compra</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Columna Izquierda: Detalles de Facturación */}
                <div className="w-full lg:w-7/12 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Detalles de facturación</h2>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                                <input type="text" className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-brand-purple focus:border-brand-purple" required />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                                <input type="text" className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-brand-purple focus:border-brand-purple" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de la calle *</label>
                                <input type="text" placeholder="Número de la casa y nombre de la calle" className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2 focus:ring-brand-purple focus:border-brand-purple" required />
                                <input type="text" placeholder="Apartamento, habitación, unidad, etc. (opcional)" className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-brand-purple focus:border-brand-purple" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Localidad / Ciudad *</label>
                                <input type="text" className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-brand-purple focus:border-brand-purple" required />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código postal *</label>
                                <input type="text" className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-brand-purple focus:border-brand-purple" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                                <input type="tel" className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-brand-purple focus:border-brand-purple" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de correo electrónico *</label>
                                <input type="email" className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-brand-purple focus:border-brand-purple" required />
                            </div>
                             <div className="md:col-span-2 mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notas del pedido (opcional)</label>
                                <textarea placeholder="Notas sobre tu pedido, por ejemplo, notas especiales para la entrega." rows={3} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-brand-purple focus:border-brand-purple"></textarea>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Columna Derecha: Tu Pedido */}
                <div className="w-full lg:w-5/12">
                    <div className="bg-gray-50 p-8 rounded-lg shadow-lg border border-gray-200 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-300 pb-2">Tu pedido</h2>
                        
                        {/* Lista de Productos */}
                        <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                         <div className="relative flex-shrink-0">
                                            <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-contain rounded bg-white border" />
                                            <span className="absolute -top-2 -right-2 bg-brand-purple text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                                                {item.quantity}
                                            </span>
                                         </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-800 line-clamp-2">{item.product.name}</p>
                                            {item.selectedVariant && <p className="text-xs text-gray-500 truncate">{Object.values(item.selectedVariant).join(', ')}</p>}
                                        </div>
                                    </div>
                                    <span className="font-semibold text-gray-700 whitespace-nowrap ml-2">
                                        {formatCurrency(item.product.price * item.quantity, currency)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Totales */}
                        <div className="space-y-3 border-t border-gray-300 pt-4 mb-6 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal, currency)}</span>
                            </div>
                             <div className="flex justify-between text-gray-600 items-center">
                                <span>Envío</span>
                                <span className="text-right">
                                    {shippingCost === 0 ? (
                                        <span className="text-green-600 font-bold">Gratis</span>
                                    ) : (
                                        formatCurrency(shippingCost, currency)
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-300 pt-3">
                                <span>Total</span>
                                <span>{formatCurrency(total, currency)}</span>
                            </div>
                        </div>

                        {/* Métodos de Pago */}
                        <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
                            <div className="space-y-3">
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        className="form-radio h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300"
                                        checked={paymentMethod === 'card'}
                                        onChange={() => setPaymentMethod('card')}
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-800">Pago con Tarjeta (Redsys / Stripe)</span>
                                    <div className="ml-auto flex gap-1">
                                        <div className="w-8 h-5 bg-gray-100 rounded border flex items-center justify-center text-[8px]">VISA</div>
                                        <div className="w-8 h-5 bg-gray-100 rounded border flex items-center justify-center text-[8px]">MC</div>
                                    </div>
                                </label>
                                {paymentMethod === 'card' && (
                                    <div className="pl-6 text-xs text-gray-500 bg-gray-50 p-2 rounded mb-2">
                                        Paga de forma segura con tu tarjeta de crédito o débito.
                                    </div>
                                )}
                                
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        className="form-radio h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300"
                                        checked={paymentMethod === 'bizum'}
                                        onChange={() => setPaymentMethod('bizum')}
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-800">Bizum</span>
                                </label>

                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        className="form-radio h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300"
                                        checked={paymentMethod === 'transfer'}
                                        onChange={() => setPaymentMethod('transfer')}
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-800">Transferencia bancaria directa</span>
                                </label>
                            </div>
                        </div>

                         <div className="text-xs text-gray-500 mb-6">
                            Tus datos personales se utilizarán para procesar tu pedido, mejorar tu experiencia en esta web y para otros propósitos descritos en nuestra <a href="#" className="underline">política de privacidad</a>.
                        </div>

                        <button className="w-full bg-brand-primary text-white font-bold py-4 rounded-md shadow-md hover:bg-gray-800 transition-colors text-lg">
                            Realizar el pedido
                        </button>
                        
                        <div className="mt-4 flex justify-center items-center gap-2 text-xs text-gray-400">
                            <span>🔒 Pago Seguro SSL</span>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db; 
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af; 
                }
            `}</style>
        </div>
    );
};

export default CheckoutPage;
