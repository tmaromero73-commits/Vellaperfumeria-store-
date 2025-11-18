

import React from 'react';
import type { View } from './types';

const ThreadsIcon = () => (
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8.01 3.51c-1.35 0-2.45 1.1-2.45 2.45v.38c0 .28.22.5.5.5h1.5c.28 0 .5-.22.5-.5v-.38c0-.69.56-1.25 1.25-1.25h.19c.69 0 1.25.56 1.25 1.25v2.87c0 1.35-1.1 2.45-2.45 2.45h-.87c-.28 0-.5.22-.5.5v1.5c0 .28.22.5.5.5h.87c2.21 0 4-1.79 4-4V5.96c0-1.35-1.1-2.45-2.45-2.45h-2.12zm-3.09 3.1h-1.5c-.28 0-.5.22-.5.5v.38c0 1.35 1.1 2.45 2.45 2.45h.19c.69 0 1.25-.56 1.25-1.25V5.96c0-1.35-1.1-2.45-2.45-2.45H3.01c-1.35 0-2.45 1.1-2.45 2.45v2.12c0 2.21 1.79 4 4 4h.87c.28 0 .5-.22.5-.5v-1.5c0-.28-.22-.5-.5-.5h-.87c-.69 0-1.25-.56-1.25-1.25v-.38c0-.28-.22-.5-.5-.5z"/>
    </svg>
);

const InstagramIcon = () => (
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919A118.663 118.663 0 0112 2.163zm0 1.442c-3.143 0-3.509.011-4.72.067-2.694.123-3.997 1.433-4.12 4.12C3.109 9.12 3.098 9.486 3.098 12c0 2.514.011 2.88.067 4.72.123 2.686 1.427 3.996 4.12 4.12 1.21.055 1.577.067 4.72.067 3.143 0 3.509-.011 4.72-.067 2.694-.123 3.997-1.433 4.12-4.12.056-1.84.067-2.206.067-4.72 0-2.514-.011-2.88-.067-4.72-.123-2.686-1.427-3.996-4.12-4.12-1.21-.055-1.577.067-4.72-.067zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm0 1.44a2.31 2.31 0 110 4.62 2.31 2.31 0 010-4.62zM18.88 6.54a1.32 1.32 0 100-2.64 1.32 1.32 0 000 2.64z" clipRule="evenodd" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.475 5.422 5.571-1.469z" />
    </svg>
);

interface FooterProps {
    onNavigate: (view: View) => void;
}

const FooterLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <li>
        <button 
            onClick={onClick}
            className="text-gray-400 hover:text-white transition-colors hover:underline"
        >
            {children}
        </button>
    </li>
);

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-brand-primary text-white border-t border-gray-800">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">
                    {/* Column 1: Branding */}
                    <div className="sm:col-span-2 lg:col-span-1">
                         <a href="https://vellaperfumeria.com" target="_top" className="inline-block hover:opacity-80 transition-opacity mb-4 cursor-pointer">
                             <img src="https://i0.wp.com/vellaperfumeria.com/wp-content/uploads/2025/06/1000003724-removebg-preview.png?fit=225%2C225&ssl=1" alt="Vellaperfumeria Logo" className="h-28 w-auto mx-auto md:mx-0" />
                        </a>
                        <h2 className="text-xl font-bold tracking-wider text-white">Vellaperfumeria</h2>
                        <p className="text-gray-400 text-sm mt-2">
                            Tu esencia, tu belleza, tu tienda.
                        </p>
                    </div>

                    {/* Column 2: Navegación */}
                    <div>
                        <h3 className="text-base font-bold tracking-widest uppercase mb-4 text-white">Navegación</h3>
                        <ul className="space-y-2 text-sm">
                           <li>
                                <a 
                                    href="https://vellaperfumeria.com"
                                    target="_top"
                                    className="text-gray-400 hover:text-white transition-colors hover:underline"
                                >
                                    Inicio
                                </a>
                            </li>
                           <FooterLink onClick={() => onNavigate('products')}>Tienda</FooterLink>
                           <FooterLink onClick={() => onNavigate('skincare')}>Cuidado Facial</FooterLink>
                           <FooterLink onClick={() => onNavigate('makeup')}>Maquillaje</FooterLink>
                           <FooterLink onClick={() => onNavigate('fragrance')}>Fragancias</FooterLink>
                           <FooterLink onClick={() => onNavigate('wellness')}>Wellness</FooterLink>
                           <FooterLink onClick={() => onNavigate('ofertas')}>Ideas Regalo</FooterLink>
                           <FooterLink onClick={() => onNavigate('catalog')}>Catálogo</FooterLink>
                           <FooterLink onClick={() => onNavigate('ia')}>Asistente IA</FooterLink>
                        </ul>
                    </div>

                    {/* Column 3: Ayuda */}
                     <div>
                        <h3 className="text-base font-bold tracking-widest uppercase mb-4 text-white">Ayuda</h3>
                        <ul className="space-y-2 text-sm">
                            <FooterLink onClick={() => onNavigate('about')}>Sobre Nosotros</FooterLink>
                            <FooterLink onClick={() => onNavigate('contact')}>Contacto</FooterLink>
                            <FooterLink onClick={() => onNavigate('blog')}>Blog</FooterLink>
                            <li className="text-gray-400">Política de Privacidad</li>
                        </ul>
                    </div>

                    {/* Column 4: Redes Sociales */}
                     <div>
                        <h3 className="text-base font-bold tracking-widest uppercase mb-4 text-white">Síguenos</h3>
                        <div className="flex justify-center md:justify-start space-x-4 text-gray-400">
                           <span className="cursor-pointer hover:text-white transition-all duration-300 transform hover:scale-110" aria-label="Threads"><ThreadsIcon /></span>
                           <span className="cursor-pointer hover:text-white transition-all duration-300 transform hover:scale-110" aria-label="Instagram"><InstagramIcon /></span>
                           <span className="cursor-pointer hover:text-white transition-all duration-300 transform hover:scale-110" aria-label="Facebook"><FacebookIcon /></span>
                           <span className="cursor-pointer hover:text-white transition-all duration-300 transform hover:scale-110" aria-label="WhatsApp"><WhatsAppIcon /></span>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;