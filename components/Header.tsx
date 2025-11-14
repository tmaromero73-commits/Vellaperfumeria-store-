

import React, { useState } from 'react';
import type { View } from './types';
import type { Currency } from './currency';

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

const InstagramIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919A118.663 118.663 0 0112 2.163zm0 1.442c-3.143 0-3.509.011-4.72.067-2.694.123-3.997 1.433-4.12 4.12C3.109 9.12 3.098 9.486 3.098 12c0 2.514.011 2.88.067 4.72.123 2.686 1.427 3.996 4.12 4.12 1.21.055 1.577.067 4.72.067 3.143 0 3.509-.011 4.72-.067 2.694-.123 3.997-1.433 4.12-4.12.056-1.84.067-2.206.067-4.72 0-2.514-.011-2.88-.067-4.72-.123-2.686-1.427-3.996-4.12-4.12-1.21-.055-1.577.067-4.72-.067zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm0 1.44a2.31 2.31 0 110 4.62 2.31 2.31 0 010-4.62zM18.88 6.54a1.32 1.32 0 100-2.64 1.32 1.32 0 000 2.64z" clipRule="evenodd" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
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

    const NavLink: React.FC<{ view: View; children: React.ReactNode }> = ({ view, children }) => (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onNavigate(view);
                setIsMenuOpen(false); // Close menu on navigation
            }}
            className="text-gray-700 hover:text-brand-lilac-dark transition-colors font-semibold py-2 block md:inline-block hover-underline-effect"
        >
            {children}
        </a>
    );

    return (
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-30">
            {/* Top bar */}
            <div className="bg-brand-lilac text-white text-xs">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-1">
                    <div className="flex items-center space-x-4">
                        <a href="https://www.threads.com/@beautieshopvella?xmt=AQF0zHNrv2YdoCmolABWd5JZB7EQbzCLyYByCyzn5RIWN3E" target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors" aria-label="Threads"><InstagramIcon /></a>
                        <a href="https://www.facebook.com/vellaperfumeria" target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors" aria-label="Facebook"><FacebookIcon /></a>
                    </div>
                    <div>
                        <select
                            value={currency}
                            onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                            className="bg-transparent border border-white/50 rounded-md text-white py-0.5 px-1 focus:outline-none focus:ring-1 focus:ring-white/50"
                            aria-label="Seleccionar moneda"
                        >
                            <option value="EUR" className="text-black">EUR €</option>
                            <option value="USD" className="text-black">USD $</option>
                            <option value="GBP" className="text-black">GBP £</option>
                        </select>
                    </div>
                </div>
            </div>
            {/* Main Header */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 {/* Branding Section */}
                <div className="relative flex justify-center items-center py-4">
                     {/* Centered Logo and Title */}
                    <div className="text-center">
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="inline-block" aria-label="Vellaperfumeria - Inicio">
                            <img src="https://i0.wp.com/vellaperfumeria.com/wp-content/uploads/2025/06/1000003724-removebg-preview.png?fit=225%2C225&ssl=1" alt="Vellaperfumeria Logo" className="h-20 w-auto" />
                        </a>
                        <h1 className="text-xl font-bold tracking-wider text-gray-800 -mt-2">
                            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Vellaperfumeria</a>
                        </h1>
                    </div>

                    {/* Right side actions (cart, mobile menu) */}
                    <div className="absolute right-0 flex items-center space-x-2">
                        <button onClick={onCartClick} className="relative text-gray-700 hover:text-brand-lilac-dark p-2" aria-label={`Abrir carrito. Tienes ${cartCount} artículos.`}>
                            <CartIcon />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-black rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2" aria-expanded={isMenuOpen} aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}>
                                {isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Desktop Nav */}
                <nav className="hidden md:flex justify-center space-x-8 items-center border-t py-3">
                    <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('home')}} className="text-gray-700 hover:text-brand-lilac-dark transition-colors font-semibold py-2 block md:inline-block hover-underline-effect">Inicio</a>
                    <NavLink view="products">Tienda</NavLink>
                    <NavLink view="ofertas">Ofertas</NavLink>
                    <NavLink view="catalog">Catálogo</NavLink>
                    <NavLink view="blog">Blog</NavLink>
                    <NavLink view="ia">Asistente IA</NavLink>
                </nav>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2">
                         <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('home')}} className="text-gray-700 hover:text-brand-lilac-dark transition-colors font-semibold py-2 block md:inline-block hover-underline-effect">Inicio</a>
                        <NavLink view="products">Tienda</NavLink>
                        <NavLink view="ofertas">Ofertas</NavLink>
                        <NavLink view="catalog">Catálogo</NavLink>
                        <NavLink view="blog">Blog</NavLink>
                        <NavLink view="ia">Asistente IA</NavLink>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;