

import React from 'react';
import type { View } from './types';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.475 5.422 5.571-1.469z" />
    </svg>
);

interface HeroBannerProps {
    onNavigate: (view: View) => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate }) => {
    return (
        <section className="bg-gradient-to-r from-fuchsia-50 via-rose-50 to-amber-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-8 items-center py-12 md:py-20">
                    <div className="text-center md:text-left">
                        <img 
                            src="https://storage.googleapis.com/aistudio-public/projects/33d6990c-15a5-4847-8a43-52a510525cb3/perfumeria-logo.jpeg" 
                            alt="Vellaperfumeria Logo" 
                            className="h-24 w-auto mx-auto md:mx-0 mb-6" 
                        />
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-black tracking-tight leading-tight">
                            Tu Esencia, Tu Belleza, <span className="text-fuchsia-600">Tu Tienda.</span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-800 max-w-lg mx-auto md:mx-0">
                            Descubre cosméticos, fragancias y productos de bienestar que realzan tu belleza natural. Calidad y exclusividad en cada artículo.
                        </p>
                        
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button
                                onClick={() => onNavigate('products')}
                                className="bg-[#EBCFFC] text-black font-bold py-3 px-8 rounded-lg shadow-md hover:bg-[#e0c2fa] transition-all duration-300 transform hover:scale-105"
                            >
                                Explorar Tienda
                            </button>
                            <a 
                                href="https://wa.me/661202616" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                                <WhatsAppIcon />
                                Asesoría VIP
                            </a>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <img 
                            src="https://storage.googleapis.com/aistudio-public/gallery/be92241c-959f-4f52-a218-97170a4128f7.jpg" 
                            alt="Modelo de Vellaperfumeria con un look de maquillaje sofisticado" 
                            className="rounded-lg shadow-2xl w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;