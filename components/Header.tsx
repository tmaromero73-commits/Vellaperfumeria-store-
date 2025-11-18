

import React, { useState, useRef, useEffect } from 'react';
import type { View } from './types';
import type { Currency } from './currency';

// Social Icons
const ThreadsIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8.01 3.51c-1.35 0-2.45 1.1-2.45 2.45v.38c0 .28.22.5.5.5h1.5c.28 0 .5-.22.5-.5v-.38c0-.69.56-1.25 1.25-1.25h.19c.69 0 1.25.56 1.25 1.25v2.87c0 1.35-1.1 2.45-2.45 2.45h-.87c-.28 0-.5.22-.5.5v1.5c0 .28.22.5.5.5h.87c2.21 0 4-1.79 4-4V5.96c0-1.35-1.1-2.45-2.45-2.45h-2.12zm-3.09 3.1h-1.5c-.28 0-.5.22-.5.5v.38c0 1.35 1.1 2.45 2.45 2.45h.19c.69 0 1.25-.56 1.25-1.25V5.96c0-1.35-1.1-2.45-2.45-2.45H3.01c-1.35 0-2.45 1.1-2.45 2.45v2.12c0 2.21 1.79 4 4 4h.87c.28 0 .5-.22.5-.5v-1.5c0-.28-.22-.5-.5-.5h-.87c-.69 0-1.25-.56-1.25-1.25v-.38c0-.28-.22-.5-.5-.5z"/>
    </svg>
);

const InstagramIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919A118.663 118.663 0 0112 2.163zm0 1.442c-3.143 0-3.509.011-4.72.067-2.694.123-3.997 1.433-4.12 4.12C3.109 9.12 3.098 9.486 3.098 12c0 2.514.011 2.88.067 4.72.123 2.686 1.427 3.996 4.12 4.12 1.21.055 1.577.067 4.72.067 3.143 0 3.509-.011 4.72-.067 2.694-.123 3.997-1.433 4.12-4.12.056-1.84.067-2.206.067-4.72 0-2.514-.011-2.88-.067-4.72-.123-2.686-1.427-3.996-4.12-4.12-1.21-.055-1.577.067-4.72-.067zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm0 1.44a2.31 2.31 0 110 4.62 2.31 2.31 0 010-4.62zM18.88 6.54a1.32 1.32 0 100-2.64 1.32 1.32 0 000 2.64z" clipRule="evenodd" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.475 5.422 5.571-1.469z" />
    </svg>
);


const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const HamburgerIcon = () => (
     <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon = () => (
    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface HeaderProps {
    onNavigate: (view: View) => void;
    currency: Currency;
    onCurrencyChange: (currency: Currency) => void;
    cartCount: number;
    onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currency, onCurrencyChange, cartCount, onCartClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const cartCountRef = useRef<HTMLSpanElement>(null);
    const prevCartCountRef = useRef<number>(cartCount);

    useEffect(() => {
        // Animate cart count only when items are added, not removed
        if (cartCount > prevCartCountRef.current) {
            cartCountRef.current?.classList.add('animate-pop');
            const timer = setTimeout(() => {
                cartCountRef.current?.classList.remove('animate-pop');
            }, 300); // Duration should match the animation duration
            return () => clearTimeout(timer);
        }
        prevCartCountRef.current = cartCount;
    }, [cartCount]);
    
    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const NavLink: React.FC<{ view: View; children: React.ReactNode }> = ({ view, children }) => (
        <button
            onClick={() => {
                onNavigate(view);
                setIsMenuOpen(false); // Close menu on navigation
            }}
            className="text-3xl font-bold text-brand-primary hover:text-brand-purple-dark transition-colors duration-300"
        >
            {children}
        </button>
    );
    
    const DesktopNavLink: React.FC<{ view: View; children: React.ReactNode }> = ({ view, children }) => (
         <button
            onClick={() => onNavigate(view)}
            className="text-gray-700 hover:text-brand-primary transition-colors font-semibold py-2 hover-underline-effect text-sm uppercase tracking-wider"
        >
            {children}
        </button>
    );

    return (
        <header className="bg-white shadow-sm sticky top-0 z-30">
            {/* Top Bar */}
            <div className="bg-brand-purple border-b border-brand-purple-dark">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center sm:justify-between items-center h-10">
                    <p className="text-xs text-brand-primary font-medium uppercase tracking-wider hidden sm:block">
                        Envío GRATIS a partir de 35€
                    </p>
                    <div className="flex items-center space-x-4">
                        <span className="text-brand-primary" aria-label="Threads"><ThreadsIcon /></span>
                        <span className="text-brand-primary" aria-label="Instagram"><InstagramIcon /></span>
                        <span className="text-brand-primary" aria-label="Facebook"><FacebookIcon /></span>
                        <span className="text-brand-primary" aria-label="WhatsApp"><WhatsAppIcon /></span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Left Side (for hamburger on mobile, and spacing on desktop) */}
                    <div className="flex-1 flex justify-start">
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(true)} className="p-2 text-brand-primary" aria-expanded={isMenuOpen} aria-label="Abrir menú">
                                <HamburgerIcon />
                            </button>
                        </div>
                    </div>

                    {/* Centered Logo */}
                    <div className="flex-1 flex justify-center">
                        <a href="https://vellaperfumeria.com" target="_top" className="flex flex-col items-center" aria-label="Vellaperfumeria - Inicio">
                            <img src="https://i0.wp.com/vellaperfumeria.com/wp-content/uploads/2025/06/1000003724-removebg-preview.png?fit=225%2C225&ssl=1" alt="Vellaperfumeria Logo" className="h-24 w-auto" />
                            <span className="text-2xl font-bold tracking-wider text-brand-primary mt-1">
                                Vellaperfumeria
                            </span>
                        </a>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex-1 flex justify-end items-center space-x-2">
                        <div className="hidden md:block">
                            <select
                                value={currency}
                                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                                className="bg-gray-100 border border-gray-300 rounded-md text-brand-primary text-sm py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-brand-purple"
                                aria-label="Seleccionar moneda"
                            >
                                <option value="EUR">EUR €</option>
                                <option value="USD">USD $</option>
                                <option value="GBP">GBP £</option>
                            </select>
                        </div>

                        <button onClick={onCartClick} className="relative text-brand-primary hover:text-gray-600 p-2" aria-label={`Abrir carrito. Tienes ${cartCount} artículos.`}>
                            <CartIcon />
                            {cartCount > 0 && (
                                <span ref={cartCountRef} className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex justify-center space-x-8 items-center py-2 border-t border-gray-100">
                    <a href="https://vellaperfumeria.com" target="_top" className="text-gray-700 hover:text-brand-primary transition-colors font-semibold py-2 hover-underline-effect text-sm uppercase tracking-wider">Inicio</a>
                    <DesktopNavLink view="products">Tienda</DesktopNavLink>
                    <DesktopNavLink view="skincare">Cuidado Facial</DesktopNavLink>
                    <DesktopNavLink view="makeup">Maquillaje</DesktopNavLink>
                    <DesktopNavLink view="fragrance">Fragancias</DesktopNavLink>
                    <DesktopNavLink view="wellness">Wellness</DesktopNavLink>
                    <DesktopNavLink view="ofertas">Ideas Regalo</DesktopNavLink>
                    <DesktopNavLink view="catalog">Catálogo</DesktopNavLink>
                    <DesktopNavLink view="blog">Blog</DesktopNavLink>
                    <DesktopNavLink view="ia">Asistente IA</DesktopNavLink>
                </nav>
            </div>


            {/* Mobile Menu - Fullscreen Overlay */}
            <div className={`md:hidden fixed inset-0 bg-white z-50 flex flex-col items-center justify-center transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                 <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 p-2 text-brand-primary" aria-label="Cerrar menú">
                    <CloseIcon />
                </button>
                <nav className="flex flex-col items-center space-y-8 text-center">
                    <a href="https://vellaperfumeria.com" target="_top" className="text-3xl font-bold text-brand-primary hover:text-brand-purple-dark transition-colors duration-300">Inicio</a>
                    <NavLink view="products">Tienda</NavLink>
                    <NavLink view="skincare">Cuidado Facial</NavLink>
                    <NavLink view="makeup">Maquillaje</NavLink>
                    <NavLink view="fragrance">Fragancias</NavLink>
                    <NavLink view="wellness">Wellness</NavLink>
                    <NavLink view="ofertas">Ideas Regalo</NavLink>
                    <NavLink view="catalog">Catálogo</NavLink>
                    <NavLink view="blog">Blog</NavLink>
                    <NavLink view="ia">Asistente IA</NavLink>
                    <div className="pt-8 w-full max-w-xs">
                        <select
                            value={currency}
                            onChange={(e) => {
                                onCurrencyChange(e.target.value as Currency);
                                setIsMenuOpen(false);
                            }}
                            className="w-full bg-gray-100 border border-gray-300 rounded-md text-brand-primary text-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-brand-purple"
                            aria-label="Seleccionar moneda"
                        >
                            <option value="EUR">EUR €</option>
                            <option value="USD">USD $</option>
                            <option value="GBP">GBP £</option>
                        </select>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;