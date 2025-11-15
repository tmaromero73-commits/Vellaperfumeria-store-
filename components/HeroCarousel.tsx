

import React, { useRef, useState, useEffect } from 'react';
import type { Product } from './types';
import { allProducts } from './products';

interface HeroBannerProps {
    onProductSelect: (product: Product) => void;
}

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const slides = [
    {
        productId: 46801,
        imageUrl: "https://media-cdn.oriflame.com/digitalPromotionsMedia/images/banner-media/ES/20899847/20866148.jpg?version=3",
        tagline: "¡NUEVO! EAU DE PARFUM DIVINE DARK VELVET",
        headline: "Un aroma muy femenino para vivir la noche",
        buttonText: "VER AHORA",
    },
    {
        productId: 46319,
        imageUrl: "https://media-cdn.oriflame.com/contentImage?externalMediaId=b3ab03fd-b0ec-4e4f-877b-344df824b985&name=4_Promo_split_Novage_600x450&inputFormat=jpg",
        tagline: "CUIDADO AVANZADO",
        headline: "Descubre la luminosidad con la Niacinamida",
        buttonText: "DESCUBRIR",
    },
    {
        productId: 46901,
        imageUrl: "https://media-cdn.oriflame.com/contentImage?externalMediaId=af7899cd-4872-478b-a836-b22fdd1b8358&name=5_Promo_split_Pearls_600x450+copy&inputFormat=jpg",
        tagline: "ICÓNICO",
        headline: "El toque final para un look radiante",
        buttonText: "COMPRAR",
    },
];

const HeroBanner: React.FC<HeroBannerProps> = ({ onProductSelect }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility.
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
            () =>
                setCurrentIndex((prevIndex) =>
                    prevIndex === slides.length - 1 ? 0 : prevIndex + 1
                ),
            5000 // Change slide every 5 seconds
        );

        return () => {
            resetTimeout();
        };
    }, [currentIndex]);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };
    
    const handleCTAClick = (productId: number) => {
        const product = allProducts.find(p => p.id === productId);
        if (product) {
            onProductSelect(product);
        }
    }

    return (
        <div className="h-[60vh] max-h-[600px] w-full m-auto relative group rounded-lg overflow-hidden shadow-lg">
            <div
                style={{ backgroundImage: `url(${slides[currentIndex].imageUrl})` }}
                className="w-full h-full bg-center bg-cover duration-500"
            >
                 <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 text-white p-8 text-center">
                    <p className="text-sm md:text-base font-bold uppercase tracking-widest mb-2 animate-fade-in-down">
                        {slides[currentIndex].tagline}
                    </p>
                    <h2 className="text-3xl md:text-5xl font-extrabold leading-tight max-w-2xl mb-6 animate-fade-in-up">
                        {slides[currentIndex].headline}
                    </h2>
                    <button 
                        onClick={() => handleCTAClick(slides[currentIndex].productId)}
                        className="bg-white text-black font-bold py-3 px-8 rounded-md hover:bg-gray-200 transition-colors transform hover:scale-105 animate-fade-in-up"
                        style={{animationDelay: '0.3s'}}
                    >
                        {slides[currentIndex].buttonText}
                    </button>
                </div>
            </div>
            {/* Left Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition">
                <button onClick={prevSlide} aria-label="Diapositiva anterior">
                    <ArrowLeftIcon />
                </button>
            </div>
            {/* Right Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition">
                <button onClick={nextSlide} aria-label="Siguiente diapositiva">
                    <ArrowRightIcon />
                </button>
            </div>
            <div className="flex top-4 justify-center py-2 absolute bottom-5 left-0 right-0">
                {slides.map((slide, slideIndex) => (
                    <div
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`text-2xl cursor-pointer p-1 ${currentIndex === slideIndex ? 'text-white' : 'text-white/50'}`}
                        role="button"
                        aria-label={`Ir a la diapositiva ${slideIndex + 1}`}
                    >
                        ●
                    </div>
                ))}
            </div>
             <style>
                {`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.6s ease-out forwards;
                }
                 @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }
                `}
            </style>
        </div>
    );
};

export default HeroBanner;
