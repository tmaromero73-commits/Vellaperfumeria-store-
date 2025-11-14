import React from 'react';
import type { View } from './types';

interface VideoSectionProps {
    onNavigate: (view: View) => void;
}

const VideoSection: React.FC<VideoSectionProps> = ({ onNavigate }) => {
    return (
        <section>
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-black tracking-tight">Más que Productos, una Comunidad</h2>
                <p className="mt-2 text-lg text-gray-600">Descubre, aprende y crece con nosotros.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Video 1: Tutorial */}
                <div className="flex flex-col items-center">
                    <div className="w-full bg-black rounded-lg shadow-xl overflow-hidden mb-4">
                        <video
                            src="https://storage.googleapis.com/aistudio-public/projects/285319a8-e92c-4235-82e4-92f7b8d41549/oriflame_makeup_tutorial.mp4"
                            className="w-full h-full object-cover"
                            playsInline
                            autoPlay
                            muted
                            loop
                            controls
                        ></video>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Aprende con Expertos</h3>
                    <p className="text-gray-600 text-center mb-4">
                        Visita nuestro blog para encontrar tutoriales, consejos de belleza y las últimas tendencias.
                    </p>
                    <button 
                        onClick={() => onNavigate('blog')}
                        className="border border-black text-black font-semibold py-2 px-6 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        Ver Tutoriales
                    </button>
                </div>

                {/* Video 2: Brand/Community */}
                <div className="flex flex-col items-center">
                    <div className="w-full bg-black rounded-lg shadow-xl overflow-hidden mb-4">
                        <video
                            src="https://storage.googleapis.com/aistudio-public/projects/285319a8-e92c-4235-82e4-92f7b8d41549/oriflame_brand_video.mp4"
                            className="w-full h-full object-cover"
                            playsInline
                            autoPlay
                            muted
                            loop
                            controls
                        ></video>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Únete a Nuestro Equipo</h3>
                     <p className="text-gray-600 text-center mb-4">
                        Forma parte de una comunidad apasionada por la belleza y el bienestar.
                    </p>
                    <button 
                        onClick={() => onNavigate('contact')}
                        className="bg-brand-lilac text-black font-semibold py-2 px-6 rounded-md hover:bg-brand-lilac-dark transition-colors"
                    >
                        Únete al Equipo
                    </button>
                </div>
            </div>
        </section>
    );
};

export default VideoSection;