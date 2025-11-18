import React, { useState, useRef, useEffect } from 'react';

// Icons extracted from the provided Oriflame HTML
const EditorialIcon = () => (
    <svg className="h-6 w-6" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M9.5 9a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z"></path>
        <path d="M7.5 4A2.5 2.5 0 0 0 5 6.5v11A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 16.5 4zM6 6.5A1.5 1.5 0 0 1 7.5 5h9A1.5 1.5 0 0 1 18 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 17.5z"></path>
    </svg>
);

const DashboardIcon = () => (
    <svg className="h-6 w-6" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2m6 1a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2m6 1a2 2 0 1 0 0-4 2 2 0 0 0 0 4M6 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2m8-1a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-1 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m5 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-1 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m5 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2m8-1a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-1 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0"></path>
    </svg>
);

const EnlargeIcon = () => (
    <svg className="h-6 w-6" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M5 5.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 0 0-1h-3A1.5 1.5 0 0 0 4 5.5v3a.5.5 0 0 0 1 0zm0 13a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 4 18.5v-3a.5.5 0 0 1 1 0zM18.5 5a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 1 0v-3A1.5 1.5 0 0 0 18.5 4h-3a.5.5 0 0 0 0 1zm.5 13.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 0 0 1h3a1.5 1.5 0 0 0 1.5-1.5v-3a.5.5 0 0 0-1 0z"></path>
    </svg>
);

const DownloadIcon = () => (
    <svg className="h-6 w-6" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12.5 4a.5.5 0 0 0-1 0v9.793l-2.646-2.647a.5.5 0 0 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l3.5-3.5a.5.5 0 0 0-.708-.708L12.5 13.793z"></path>
        <path d="M5 15.5a.5.5 0 0 0-1 0v3A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-3a.5.5 0 0 0-1 0v3a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5z"></path>
    </svg>
);

const ShareIcon = () => (
     <svg className="h-6 w-6" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M14.297 6.043a.5.5 0 0 1 .537.085l5 4.5a.5.5 0 0 1 0 .744l-5 4.5A.5.5 0 0 1 14 15.5v-1.967c-2.165.157-3.714.497-5.04 1.113-1.43.664-2.642 1.668-4.098 3.199a.5.5 0 0 1-.823-.538c1.144-2.734 2.303-4.819 3.916-6.278 1.54-1.395 3.452-2.181 6.045-2.48V6.5a.5.5 0 0 1 .297-.457M15 7.623V9a.5.5 0 0 1-.455.498c-2.673.243-4.492.98-5.92 2.272-.983.89-1.803 2.063-2.583 3.575.798-.662 1.603-1.192 2.497-1.607 1.593-.74 3.427-1.096 5.933-1.237A.5.5 0 0 1 15 13v1.377L18.753 11z"></path>
    </svg>
);

const CatalogPage: React.FC = () => {
    const [isOverview, setIsOverview] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const catalogContainerRef = useRef<HTMLDivElement>(null);

    const handleToggleFullScreen = () => {
        const elem = catalogContainerRef.current;
        if (!elem) return;

        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const onFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', onFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
    }, []);

    const catalogUrl = "https://es-catalogue.oriflame.com/oriflame/es/2025015-brp?HideStandardUI=true&Page=1";
    const pdfUrl = "https://es-catalogue.oriflame.com/oriflame/es/2025015/GetPDF.ashx";

    return (
        <div ref={catalogContainerRef} className="bg-white fullscreen:bg-white w-full">
            <h1 className="sr-only">eCatalogue Oriflame</h1>
            
            {/* Toolbar */}
            <div role="toolbar" className="bg-white flex items-center justify-between p-2 border-b sticky top-[128px] z-20">
                {/* Left controls */}
                <div className="flex items-center gap-4">
                    <label 
                      className="relative inline-flex items-center cursor-pointer p-1 bg-gray-200 rounded-lg text-gray-700"
                      title="Una página / Visión general"
                    >
                        <input type="checkbox" checked={isOverview} onChange={() => setIsOverview(!isOverview)} className="sr-only"/>
                        <span className={`p-1.5 rounded-md transition-all ${!isOverview ? 'bg-white shadow' : 'text-gray-500'}`}>
                            <EditorialIcon />
                        </span>
                        <span className={`p-1.5 rounded-md transition-all ${isOverview ? 'bg-white shadow' : 'text-gray-500'}`}>
                            <DashboardIcon />
                        </span>
                    </label>
                    <p className="text-sm font-semibold text-gray-700">1 / 148</p>
                </div>
                
                {/* Right controls */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleToggleFullScreen}
                        className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                        title={isFullScreen ? "Salir de pantalla completa" : "Entrar en pantalla completa"}
                    >
                        <EnlargeIcon />
                    </button>
                    <a 
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                        title="Descargar"
                    >
                        <DownloadIcon />
                    </a>
                    <button 
                        onClick={() => alert('Función de compartir no implementada.')}
                        className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                        title="Compartir el eCatalogue"
                    >
                        <ShareIcon />
                    </button>
                </div>
            </div>
            
            {/* iFrame Content */}
            <div className="w-full h-[calc(100vh-200px)] md:h-[calc(100vh-185px)] fullscreen:h-screen">
                 <iframe
                    src={catalogUrl}
                    title="eCatalogue Oriflame"
                    className="w-full h-full border-0"
                ></iframe>
            </div>
        </div>
    );
};

export default CatalogPage;
