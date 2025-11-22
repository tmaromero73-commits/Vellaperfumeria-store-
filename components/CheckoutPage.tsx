
import React, { useState } from 'react';
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
    const [syncProgress, setSyncProgress] = useState(0);
    const [syncMessage, setSyncMessage] = useState('Sincronizando...');

    const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const total = subtotal; 

    const handleSubmit = async () => {
        if (!acceptedTerms) {
            alert('Por favor, acepta los términos y condiciones para continuar.');
            return;
        }

        setIsProcessing(true);
        setSyncProgress(0);

        // Step 1: Clear the remote cart to avoid duplicates.
        setSyncMessage('Preparando tu pedido...');
        await new Promise<void>(resolve => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            // Common WooCommerce endpoint to empty the cart.
            iframe.src = 'https://vellaperfumeria.com/carrito/?empty-cart';
            
            const cleanup = () => {
                if (document.body.contains(iframe)) document.body.removeChild(iframe);
                resolve();
            };

            iframe.onload = cleanup;
            setTimeout(cleanup, 2000); // Timeout fallback
            document.body.appendChild(iframe);
        });

        // Step 2: Add each item to the cart sequentially for better reliability.
        setSyncMessage('Añadiendo productos a tu cesta...');
        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            // Note: This adds the product ID. If variations are complex they might need variation_id, but for simple products ID is sufficient.
            const addToCartUrl = `https://vellaperfumeria.com/?add-to-cart=${item.product.id}&quantity=${item.quantity}`;
            
            await new Promise<void>(resolve => {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = addToCartUrl;
                
                const cleanup = () => {
                    if (document.body.contains(iframe)) document.body.removeChild(iframe);
                    resolve();
                };

                iframe.onload = () => {
                    setSyncProgress(Math.round(((i + 1) / cartItems.length) * 100));
                    cleanup();
                };
                setTimeout(cleanup, 3000); // More generous fallback timeout per item
                document.body.appendChild(iframe);
            });
        }
        
        setSyncMessage('¡Todo listo! Redirigiendo al pago...');
        onClearCart();

        // Step 3: Redirect the user to the specific Checkout Page ID provided (19037)
        // Using window.top.location to break out of any frames and ensure full page load.
        window.top.location.href = 'https://vellaperfumeria.com/?page_id=19037';
    };

    if (cartItems.length === 0 && !isProcessing) {
        return (
            <div className="bg-gray-50 min-h-screen flex flex-col">
                <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-10">
                    <div className="container mx-auto px-4 flex justify-center">
                         <button onClick={() => onNavigate('home')}>
                            <img src="https://i0.wp.com/vellaperfumeria.com/wp-content/uploads/2025/06/1000003724-removebg-preview.png" alt="Vellaperfumeria Logo" className="h-24 w-auto object-contain" />
                        </button>
                    </div>
                </header>
                <div className="container mx-auto px-4 py-16 text-center flex-grow flex flex-col justify-center items-center">
                    <div className="max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu bolsa de compra está vacía</h2>
                        <p className="text-gray-500 mb-8">Parece que aún no has elegido tus productos de belleza favoritos.</p>
                        <button 
                            onClick={() => onNavigate('products', 'all')}
                            className="bg-[var(--color-primary)] text-black border-2 border-[var(--color-primary-solid)] font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-[var(--color-primary-solid)] transition-colors shadow-md w-full"
                        >
                            Ir a la Tienda
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
            <header className="bg-white border-b border-gray-200 py-6 sticky top-0 z-20 shadow-sm">
                <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-3">
                    <button onClick={() => onNavigate('home')} className="hover:opacity-80 transition-opacity">
                        <img src="https://i0.wp.com/vellaperfumeria.com/wp-content/uploads/2025/06/1000003724-removebg-preview.png" alt="Vellaperfumeria Logo" className="h-40 w-auto object-contain" />
                    </button>
                </div>
            </header>

            <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Resumen del Pedido</h1>
                    <p className="text-gray-500 mt-2">Confirma tus productos para proceder al pago.</p>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                    {/* Left Column: Summary Detail */}
                    <div className="lg:w-2/3 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
                                Artículos seleccionados ({cartItems.length})
                            </h2>
                            <div className="space-y-6">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-4 sm:gap-6 items-start">
                                        <div className="relative flex-shrink-0">
                                            <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-contain rounded-lg border border-gray-100 bg-white" />
                                            <span className="absolute -top-2 -right-2 bg-rose-500 text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-sm border border-white">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-gray-900 text-base sm:text-lg">{item.product.name}</h3>
                                            <p className="text-sm text-gray-500 mb-2">{item.product.brand}</p>
                                            {item.selectedVariant && (
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {Object.entries(item.selectedVariant).map(([key, value]) => (
                                                        <span key={key} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                            {key}: {value}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 text-lg">{formatCurrency(item.product.price * item.quantity, currency)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Total */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-32">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Total Estimado</h3>

                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-base font-bold text-gray-900">Total a Pagar</span>
                                    <span className="text-2xl font-extrabold text-rose-600">{formatCurrency(total, currency)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 text-right">Impuestos incluidos</p>
                            </div>

                             <div className="mb-6">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        className="mt-1 h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500" 
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    />
                                    <span className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors">
                                        Acepto los <a href="#" className="underline hover:text-rose-600">Términos y Condiciones</a>.
                                    </span>
                                </label>
                            </div>

                            <button 
                                onClick={handleSubmit}
                                disabled={isProcessing || !acceptedTerms}
                                className="w-full bg-[var(--color-primary)] text-black border-2 border-[var(--color-primary-solid)] font-bold py-3 px-6 rounded-xl hover:bg-white hover:text-[var(--color-primary-solid)] transition-all shadow-lg transform active:scale-95 flex justify-center items-center disabled:opacity-70 disabled:cursor-wait"
                            >
                                {isProcessing ? (
                                    <div className="flex flex-col items-center gap-2 w-full">
                                        <div className="flex items-center gap-2 text-sm">
                                            <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>{syncMessage}</span>
                                        </div>
                                        <div className="w-full bg-white/50 rounded-full h-1.5 mt-1">
                                            <div className="bg-black h-1.5 rounded-full transition-all duration-300" style={{ width: `${syncProgress}%` }}></div>
                                        </div>
                                    </div>
                                ) : 'REALIZAR PEDIDO (PAGO SEGURO)'}
                            </button>
                            
                            <div className="mt-6 flex justify-center gap-3 opacity-60">
                                <VisaIcon />
                                <MastercardIcon />
                            </div>
                        </div>
                    </div>
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
                </div>
            </footer>
        </div>
    );
};

export default CheckoutPage;
