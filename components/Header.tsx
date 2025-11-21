
import React, { useState, useRef, useEffect } from 'react';
import type { View } from './types';
import type { Currency } from './currency';

// Social Icons
const ThreadsIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8.01 3.51c-1.35 0-2.45 1.1-2.45 2.45v.38c0 .28.22.5.5.5h1.5c.28 0 .5-.22.5-.5v-.38c0-.69.56-1.25 1.25-1.25h.19c.69 0 1.25.56 1.25 1.25v2.87c0 1.35-1.1 2.45-2.45 2.45h-.87c-.28 0-.5.22-.5.5v1.5c0 .28.22.5.5.5h.87c2.21 0 4-1.79 4-4V5.96c0-1.35-1.1-2.45-2.45-2.45h-2.12zm-3.09 3.1h-1.5c-.28 0-.5.22-.5.5v.38c0 1.35 1.1 2.45 2.45 2.45h.19c.69 0 1.25-.56 1.25-1.25V5.96c0-1.35-1.1-2.45-2.45-2.45H3.01c-1.35 0-2.45 1.1-2.45 2.45v2.12c0 2.21 1.79 4 4 4h.87c.28 0 .5-.22.5-.5v-1.5c0-.28-.22-.5-.5-.5h-.87c-.69 0-1.25-.56-1.25-1.25v-.38c0-.28-.22-.5-.5-.5z"/>
    </svg>
);

const InstagramIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919A118.663 118.663 0 0112 2.163zm0 1.442c-3.143 0-3.509.011-4.72.067-2.694.123-3.997 1.433-4.12 4.12C3.109 9.12 3.098 9.486 3.098 9.486 3.098 12c0 2.514.011 2.88.067 4.72.123 2.686 1.427 3.996 4.12 4.12 1.21.055 1.577.067 4.72.067 3.143 0 3.509-.011 4.72-.067 2.694-.123 3.997-1.433 4.12-4.12.056-1.84.067-2.206.067-4.72 0-2.514-.011-2.88-.067-4.72-.123-2.686-1.427-3.996-4.12-4.12-1.21-.055-1.577.067-4.72-.067zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm0 1.44a2.31 2.31 0 110 4.62 2.31 2.31 0 010-4.62zM18.88 6.54a1.32 1.32 0 100-2.64 1.32 1.32 0 000 2.64z" clipRule="evenodd" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.475 5.422 5.571-1.469z" />
    </svg>
);

const MenuIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

const CartIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const NavLink: React.FC<{ onClick?: () => void, href?: string, children: React.ReactNode, className?: string }> = ({ onClick, href, children, className }) => {
    if (href) {
        return (
            <a href={href} target="_top" className={`text-base font-medium text-black hover:text-gray-700 transition-colors duration-200 ${className}`}>
                <span className="hover-underline-effect">{children}</span>
            </a>
        );
    }
    return (
        <button onClick={onClick} className={`text-base font-medium text-black hover:text-gray-700 transition-colors duration-200 ${className}`}>
            <span className="hover-underline-effect">{children}</span>
        </button>
    );
};


interface HeaderProps {
    onNavigate: (view: View, payload?: any) => void;
    currency: Currency;
    onCurrencyChange: (currency: Currency) => void;
    cartCount: number;
    onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currency, onCurrencyChange, cartCount, onCartClick }) => {
    const [cartPulse, setCartPulse] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [vParam, setVParam] = useState<string | null>(null);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            setVParam(urlParams.get('v'));
        } catch (e) {
            console.error("Error extracting params", e);
        }
    }, []);

    const homeUrl = (() => {
        const baseUrl = 'https://vellaperfumeria.com';
        const params = new URLSearchParams();
        if (vParam) params.append('v', vParam);
        const queryString = params.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    })();

    useEffect(() => {
        if (cartCount > 0) {
            setCartPulse(true);
            const timer = setTimeout(() => setCartPulse(false), 500);
            return () => clearTimeout(timer);
        }
    }, [cartCount]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMobileNav = (view: View, payload?: any) => {
        onNavigate(view, payload);
        setIsMobileMenuOpen(false);
    }

    return (
        <header className="bg-white shadow-sm sticky top-0 z-30">
            {/* Updated to Lighter Lilac (#F3E8FF) */}
            <div className="bg-[#F3E8FF] text-black py-2 text-sm font-medium">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <span className="cursor-pointer hover:opacity-75 transition-opacity text-black" aria-label="Threads"><ThreadsIcon /></span>
                        <span className="cursor-pointer hover:opacity-75 transition-opacity text-black" aria-label="Instagram"><InstagramIcon /></span>
                        <span className="cursor-pointer hover:opacity-75 transition-opacity text-black" aria-label="Facebook"><FacebookIcon /></span>
                        <span className="cursor-pointer hover:opacity-75 transition-opacity text-black" aria-label="WhatsApp"><WhatsAppIcon /></span>
                    </div>
                    <div className="hidden md:block text-center text-black">
                        <span>
                            <span className="font-bold">BLACK FRIDAY</span> | Envío GRATIS en pedidos +35€
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center py-4 relative">
                     {/* Standard anchor tag with target=_top for reliable redirection */}
                    <a 
                        href={homeUrl}
                        target="_top"
                        className="hover:opacity-80 transition-opacity inline-block"
                        aria-label="Volver a Vellaperfumeria.com"
                    >
                        <img src="https://i0.wp.com/vellaperfumeria.com/wp-content/uploads/2025/06/1000003724-removebg-preview.png" alt="Vellaperfumeria Logo" className="h-32 md:h-44 w-auto" />
                    </a>
                </div>

                <div className="flex justify-between items-center pb-4 border-t border-gray-100 pt-2">
                    <div className="flex-1 hidden md:flex items-center space-x-4">
                        <select
                            value={currency}
                            onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                            className="text-sm font-medium bg-transparent border-none focus:ring-0 cursor-pointer"
                            aria-label="Seleccionar moneda"
                        >
                            <option value="EUR">EUR €</option>
                            <option value="USD">USD $</option>
                            <option value="GBP">GBP £</option>
                        </select>
                         <button onClick={() => onNavigate('contact')} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                            Conviértete en Brand Partner
                        </button>
                    </div>

                    <nav className="hidden md:flex flex-auto justify-center items-center space-x-6">
                        <NavLink href={homeUrl}>Inicio</NavLink>
                        <NavLink onClick={() => onNavigate('products', 'all')}>Tienda</NavLink>
                        <NavLink onClick={() => onNavigate('products', 'skincare')}>Cuidado Facial</NavLink>
                        <NavLink onClick={() => onNavigate('products', 'makeup')}>Maquillaje</NavLink>
                        <NavLink onClick={() => onNavigate('products', 'hair')}>Cuidado Capilar</NavLink>
                        <NavLink onClick={() => onNavigate('products', 'perfume')}>Fragancias</NavLink>
                        <NavLink onClick={() => onNavigate('products', 'wellness')}>Wellness</NavLink>
                        <NavLink onClick={() => onNavigate('ofertas')}>Ideas Regalo</NavLink>
                        <NavLink onClick={() => onNavigate('catalog')}>Catálogo</NavLink>
                        <NavLink onClick={() => onNavigate('ia')}>Asistente IA</NavLink>
                    </nav>

                    <div className="flex-1 flex justify-end items-center space-x-4">
                        <button onClick={onCartClick} className="relative text-black hover:text-gray-700 transition-colors" aria-label={`Ver carrito, ${cartCount} artículos`}>
                            <CartIcon />
                            {cartCount > 0 && (
                                <span key={cartCount} className={`absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white shadow-sm ${cartPulse ? 'animate-pop' : ''}`}>
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Abrir menú">
                                <MenuIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                 <div ref={navRef} className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t z-20">
                     <nav className="flex flex-col space-y-1 p-4">
                         <NavLink href={homeUrl} className="py-2">Inicio</NavLink>
                         <NavLink onClick={() => handleMobileNav('products', 'all')} className="py-2">Tienda</NavLink>
                         <NavLink onClick={() => handleMobileNav('products', 'skincare')} className="py-2">Cuidado Facial</NavLink>
                         <NavLink onClick={() => handleMobileNav('products', 'makeup')} className="py-2">Maquillaje</NavLink>
                         <NavLink onClick={() => handleMobileNav('products', 'hair')} className="py-2">Cuidado Capilar</NavLink>
                         <NavLink onClick={() => handleMobileNav('products', 'perfume')} className="py-2">Fragancias</NavLink>
                         <NavLink onClick={() => handleMobileNav('products', 'wellness')} className="py-2">Wellness</NavLink>
                         <NavLink onClick={() => handleMobileNav('ofertas')} className="py-2">Ideas Regalo</NavLink>
                         <NavLink onClick={() => handleMobileNav('catalog')} className="py-2">Catálogo</NavLink>
                         <NavLink onClick={() => handleMobileNav('ia')} className="py-2">Asistente IA</NavLink>
                     </nav>
                     <div className="p-4 border-t border-gray-100 flex flex-col space-y-4">
                        <button onClick={() => { handleMobileNav('contact'); }} className="text-sm font-medium text-gray-600 hover:text-black transition-colors text-left">
                            Conviértete en Brand Partner
                        </button>
                        <select
                            value={currency}
                            onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                            className="text-sm font-medium bg-transparent border-none focus:ring-0 w-full"
                            aria-label="Seleccionar moneda"
                        >
                            <option value="EUR">EUR €</option>
                            <option value="USD">USD $</option>
                            <option value="GBP">GBP £</option>
                        </select>
                     </div>
                </div>
            )}
        </header>
    );
};

export default Header;
