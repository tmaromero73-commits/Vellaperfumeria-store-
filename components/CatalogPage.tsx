import React from 'react';

// Use the PDF viewer with a working, recent PDF from the user's own domain.
const PDF_URL = 'https://vellaperfumeria.com/wp-content/uploads/2024/06/2024009.pdf';
const PDF_VIEWER_URL = `https://vellaperfumeria.com/wp-content/plugins/pdf-viewer-block/inc/pdfjs/web/viewer.html?file=${PDF_URL}`;
const PDF_DIRECT_LINK = PDF_URL;

interface CatalogPageProps {}

const CatalogPage: React.FC<CatalogPageProps> = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-black tracking-tight">Catálogo Digital</h1>
                <p className="mt-2 text-lg text-gray-600">Explora nuestro catálogo más reciente para descubrir ofertas y novedades.</p>
            </div>
            
            <div 
                className="relative w-full max-w-5xl mx-auto bg-gray-100 rounded-lg shadow-2xl overflow-hidden border border-gray-200" 
                style={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}
            >
                 <iframe
                    src={PDF_VIEWER_URL}
                    title="Catálogo Digital Vellaperfumeria"
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    aria-label="Visor del catálogo digital en PDF"
                 />
            </div>
             <div className="text-center mt-8">
                <a
                    href={PDF_DIRECT_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-black font-semibold hover:text-brand-primary transition-colors hover:underline"
                >
                    Abrir catálogo en una nueva pestaña &rarr;
                </a>
            </div>
        </div>
    );
};

export default CatalogPage;