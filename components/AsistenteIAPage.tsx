import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";

interface Message {
    role: 'user' | 'model';
    text: string;
}

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m1-9l2-2 2 2m-2 4v6m2-6l2 2-2 2M15 3l2 2-2 2m-2-4v4m2 4l2 2-2 2m-8 4h12" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


const AsistenteIAPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chat, setChat] = useState<Chat | null>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize the AI chat session
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'Eres un asistente de belleza y experto en perfumes para la tienda online "Vellaperfumeria". Tu objetivo es ayudar a los clientes a encontrar los productos perfectos. Sé amable, servicial y conocedor de los productos de la tienda. Ofrece recomendaciones personalizadas basadas en las preferencias del cliente. Utiliza un lenguaje cercano y profesional. Bajo ninguna circunstancia menciones marcas de la competencia o productos que no se vendan en Vellaperfumeria. Céntrate exclusivamente en el catálogo de Vellaperfumeria.',
                },
            });
            setChat(newChat);
        } catch (e) {
            console.error("Error initializing Gemini:", e);
            setError("No se pudo inicializar el asistente de IA. Por favor, revisa la configuración.");
        }
    }, []);

    useEffect(() => {
        // Scroll to the bottom of the chat on new message
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading || !chat) return;

        setError(null);
        setIsLoading(true);

        const userMessage: Message = { role: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            const responseStream = await chat.sendMessageStream({ message: messageText });

            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '...' }]);

            for await (const chunk of responseStream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (e) {
            console.error("Error sending message to Gemini:", e);
            setError("Lo siento, ha ocurrido un error al procesar tu solicitud.");
            setMessages(prev => prev.slice(0, -1)); // Remove the placeholder
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
    };

    const examplePrompts = [
        "Recomiéndame un perfume para una cita",
        "¿Qué rutina de skincare es mejor para piel grasa?",
        "Busco un regalo para mi madre",
        "¿Cuál es el labial más vendido?",
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-10">
                <img src="https://storage.googleapis.com/aistudio-public/projects/33d6990c-15a5-4847-8a43-52a510525cb3/perfumeria-logo.jpeg" alt="Logo de Vellaperfumeria" className="w-24 h-24 mx-auto mb-4" />
                <h1 className="text-4xl font-extrabold text-black tracking-tight">Asistente de Belleza IA</h1>
                <p className="mt-2 text-lg text-gray-600">¿Necesitas ayuda? Pide recomendaciones y consejos sobre nuestros productos.</p>
            </div>

            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col h-[70vh]">
                <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                             {msg.role === 'model' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-fuchsia-100 flex items-center justify-center">
                                    <SparklesIcon />
                                </div>
                            )}
                            <div className={`max-w-md p-4 rounded-2xl ${msg.role === 'user' ? 'bg-gray-100 text-gray-800 rounded-br-none' : 'bg-fuchsia-50 text-gray-800 rounded-bl-none'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            {msg.role === 'user' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <UserIcon />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-fuchsia-100 flex items-center justify-center">
                                <SparklesIcon />
                            </div>
                            <div className="max-w-md p-4 rounded-2xl bg-fuchsia-50 text-gray-800 rounded-bl-none">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    {error && <p className="text-center text-red-500">{error}</p>}
                </div>

                {messages.length === 0 && !isLoading && (
                    <div className="p-6 text-center text-gray-500">
                        <p className="mb-4">Prueba a preguntar algo como:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {examplePrompts.map(prompt => (
                                <button
                                    key={prompt}
                                    onClick={() => handleSendMessage(prompt)}
                                    className="bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1.5 rounded-full transition-colors"
                                >
                                    "{prompt}"
                                </button>
                            ))}
                        </div>
                    </div>
                )}


                <div className="p-4 border-t bg-gray-50">
                    <form onSubmit={handleFormSubmit} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escribe tu mensaje..."
                            aria-label="Escribe tu mensaje"
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()}
                            className="bg-[#EBCFFC] text-black font-semibold rounded-full p-2.5 shadow-sm hover:bg-[#e0c2fa] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            aria-label="Enviar mensaje"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AsistenteIAPage;