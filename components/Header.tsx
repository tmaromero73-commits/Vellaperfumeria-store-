
import React, { useState, useRef, useEffect } from 'react';
import type { View } from './types';
import type { Currency } from './currency';

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

    const NavLink: React.FC<{ view: View; children: React.ReactNode }> = ({ view, children }) => (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onNavigate(view);
                setIsMenuOpen(false); // Close menu on navigation
            }}
            className="text-gray-700 hover:text-brand-primary transition-colors font-semibold py-2 block hover-underline-effect"
        >
            {children}
        </a>
    );
    
    const DesktopNavLink: React.FC<{ view: View; children: React.ReactNode }> = ({ view, children }) => (
         <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate(view); }}
            className="text-gray-700 hover:text-brand-primary transition-colors font-semibold py-2 hover-underline-effect text-sm uppercase tracking-wider"
        >
            {children}
        </a>
    );

    return (
        <header className="bg-white shadow-sm sticky top-0 z-30">
            <div className="h-1 bg-brand-purple"></div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Left Side (for hamburger on mobile, and spacing on desktop) */}
                    <div className="flex-1 flex justify-start">
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-brand-primary" aria-expanded={isMenuOpen} aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}>
                                {isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
                            </button>
                        </div>
                    </div>

                    {/* Centered Logo */}
                    <div className="flex-1 flex justify-center">
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="flex flex-col items-center" aria-label="Vellaperfumeria - Inicio">
                            <img src="https://i0.wp.com/vellaperfumeria.com/wp-content/uploads/2025/06/1000003724-removebg-preview.png?fit=225%2C225&ssl=1" alt="Vellaperfumeria Logo" className="h-20 w-auto" />
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
                    <DesktopNavLink view="home">Inicio</DesktopNavLink>
                    <DesktopNavLink view="products">Tienda</DesktopNavLink>
                    <DesktopNavLink view="ofertas">Ofertas</DesktopNavLink>
                    <DesktopNavLink view="catalog">Catálogo</DesktopNavLink>
                    <DesktopNavLink view="blog">Blog</DesktopNavLink>
                    <DesktopNavLink view="ia">Asistente IA</DesktopNavLink>
                </nav>
            </div>


            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2">
                        <NavLink view="home">Inicio</NavLink>
                        <NavLink view="products">Tienda</NavLink>
                        <NavLink view="ofertas">Ofertas</NavLink>
                        <NavLink view="catalog">Catálogo</NavLink>
                        <NavLink view="blog">Blog</NavLink>
                        <NavLink view="ia">Asistente IA</NavLink>
                        <div className="pt-4 border-t border-gray-200">
                            <select
                                value={currency}
                                onChange={(e) => {
                                    onCurrencyChange(e.target.value as Currency);
                                    setIsMenuOpen(false);
                                }}
                                className="w-full bg-gray-100 border border-gray-300 rounded-md text-brand-primary text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-purple"
                                aria-label="Seleccionar moneda"
                            >
                                <option value="EUR">EUR €</option>
                                <option value="USD">USD $</option>
                                <option value="GBP">GBP £</option>
                            </select>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
