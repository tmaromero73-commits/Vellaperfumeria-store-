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
        <section className="bg-[var(--color-secondary)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-8 items-center py-12 md:py-20">
                    <div className="text-center md:text-left">
                         <h1 className="text-4xl lg:text-5xl font-extrabold text-black tracking-tight leading-tight">
                            Tu Esencia, Tu Belleza, <span className="text-[var(--color-primary)]">Tu Tienda.</span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-700 max-w-lg mx-auto md:mx-0">
                            Descubre cosméticos, fragancias y productos de bienestar que realzan tu belleza natural. Calidad y exclusividad en cada artículo.
                        </p>
                        
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button
                                onClick={() => onNavigate('products')}
                                className="btn-primary"
                            >
                                Explorar Tienda
                            </button>
                            <a 
                                href="https://wa.me/661202616" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn-secondary flex items-center justify-center gap-2"
                            >
                                <WhatsAppIcon />
                                Asesoría VIP
                            </a>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <img 
                            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                            alt="Una elegante composición de productos de belleza y cuidado de la piel sobre una superficie de mármol" 
                            className="rounded-lg shadow-2xl w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;