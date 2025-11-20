
import React, { useState, useEffect, useCallback } from 'react';
import type { View } from './types';

interface HeroCarouselProps {
    onNavigate: (view: View) => void;
}

const slides = [
    {
        imageUrl: 'https://media-cdn.oriflame.com/digitalPromotionsMedia/images/banner-media/ES/20899847/20866148.jpg',
        title: 'Un aroma muy femenino para vivir la noche',
        subtitle: '¡NUEVO! EAU DE PARFUM DIVINE DARK VELVET',
        buttonText: 'VER AHORA',
        view: 'fragrance' as View,
    },
    {
        imageUrl: 'https://media-cdn.oriflame.com/digitalPromotionsMedia/images/banner-media/ES/20900001/20866153.jpg',
        title: 'La mejor belleza para lucirte',
        subtitle: '¡Favoritos con hasta un 50% dto!',
        buttonText: 'VER LOS PRODUCTOS',
        view: 'ofertas' as View,
    },
    {
        imageUrl: 'https://media-cdn.oriflame.com/digitalPromotionsMedia/images/banner-media/ES/20899692/21035391.jpg',
        title: '12 días. 12 sorpresas. La emoción de la Navidad',
        subtitle: 'Calendario de Adviento 2025',
        buttonText: 'Comprar',
        view: 'ofertas' as View,
    },
];

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);


const HeroCarousel: React.FC<HeroCarouselProps> = ({ onNavigate }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex(prevIndex => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, []);

    const prevSlide = () => {
        setCurrentIndex(prevIndex => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    };

    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 5000);
        return () => clearInterval(slideInterval);
    }, [nextSlide]);
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
             <div className="w-full h-[60vh] max-h-[500px] m-auto relative group rounded-lg overflow-hidden shadow-lg">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundImage: `url(${slide.imageUrl})` }}
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <div className="text-center text-white p-4">
                                <h2 className="text-4xl md:text-5xl font-extrabold font-heading drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.6)'}}>{slide.title}</h2>
                                <p className="mt-4 text-lg md:text-xl drop-shadow-md" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.6)'}}>{slide.subtitle}</p>
                                <button
                                    onClick={() => onNavigate(slide.view)}
                                    className="mt-8 bg-[#E9D5FF] text-black font-bold py-3 px-8 rounded-lg shadow-md hover:bg-[#D8B4FE] transition-all duration-300 transform hover:scale-105"
                                >
                                    {slide.buttonText}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Left Arrow */}
                <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-colors">
                    <button onClick={prevSlide} aria-label="Anterior diapositiva"><ChevronLeftIcon /></button>
                </div>
                {/* Right Arrow */}
                <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-colors">
                    <button onClick={nextSlide} aria-label="Siguiente diapositiva"><ChevronRightIcon /></button>
                </div>

                {/* Dots */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
                            aria-label={`Ir a diapositiva ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroCarousel;
