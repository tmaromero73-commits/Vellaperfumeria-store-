import React from 'react';
import type { View } from './types';

interface OrderConfirmationPageProps {
    onNavigate: (view: View) => void;
}

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ onNavigate }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center border border-gray-200">
                <div className="flex justify-center mb-4">
                    <CheckCircleIcon />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Gracias por tu pedido!</h1>
                <p className="text-gray-700 mb-6">
                    Hemos recibido tu pedido y lo estamos procesando. Recibirás una confirmación por correo electrónico en breve.
                </p>
                <button
                    onClick={() => onNavigate('products')}
                    className="w-full bg-[#EBCFFC] text-black font-bold py-3 rounded-lg hover:bg-[#e0c2fa] transition-colors"
                >
                    Seguir Comprando
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
