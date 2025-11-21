
import React, { useState, useEffect, useCallback } from 'react';
// Types
import type { View, Product, CartItem } from './components/types';
import type { Currency } from './components/currency';
import { blogPosts } from './components/blogData';
// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ShopPage from './components/ShopPage';
import ProductDetailPage from './components/ProductDetailPage';
import CartSidebar from './components/CartSidebar';
import OfertasPage from './components/OfertasPage';
import AsistenteIAPage from './components/AsistenteIAPage';
import CatalogPage from './components/CatalogPage';
import BlogPage from './components/BlogPage';
import BlogPostPage from './components/BlogPostPage';
import QuickViewModal from './components/QuickViewModal';
import CheckoutPage from './components/CheckoutPage';
import Breadcrumbs, { type BreadcrumbItem } from './components/Breadcrumbs';
import BottomNavBar from './components/BottomNavBar';

type AppView = {
    current: View;
    payload?: any;
};

const App: React.FC = () => {
    const [view, setView] = useState<AppView>({ current: 'home' });
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [currency, setCurrency] = useState<Currency>('EUR');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [vParam, setVParam] = useState<string | null>(null);

    // Extract 'v' parameter to maintain session
    useEffect(() => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            setVParam(urlParams.get('v'));
        } catch (e) {
            console.error("Error extracting params", e);
        }
    }, []);

    // Load cart from local storage on initial render
    useEffect(() => {
        try {
            const storedCart = localStorage.getItem('vellaperfumeria_cart');
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error("Failed to load cart from localStorage", error);
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('vellaperfumeria_cart', JSON.stringify(cartItems));
        } catch (error) {
            console.error("Failed to save cart to localStorage", error);
        }
    }, [cartItems]);
    
    // Scroll to top on view change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [view]);

    const handleNavigate = useCallback((newView: View, payload?: any) => {
        setView({ current: newView, payload });
    }, []);

    const handleProductSelect = (product: Product) => {
        handleNavigate('productDetail', product);
    };

    const showAddToCartConfirmation = (buttonElement: HTMLButtonElement | null) => {
        if (!buttonElement) return;
        // Standard confirmation logic if needed
    };

    const handleAddToCart = (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => {
        const cartItemId = selectedVariant 
            ? `${product.id}-${Object.values(selectedVariant).join('-')}`
            : `${product.id}`;
            
        const existingItem = cartItems.find(item => item.id === cartItemId);

        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCartItems([...cartItems, { id: cartItemId, product, quantity: 1, selectedVariant }]);
        }
        
        setIsCartOpen(true);
    };
    
    const handleQuickAddToCart = (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => {
        handleAddToCart(product, buttonElement, selectedVariant);
        if (!isCartOpen) setIsCartOpen(true);
    };

    const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveItem(cartItemId);
        } else {
            setCartItems(cartItems.map(item =>
                item.id === cartItemId ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    const handleRemoveItem = (cartItemId: string) => {
        setCartItems(cartItems.filter(item => item.id !== cartItemId));
    };

    const handleCheckout = () => {
        setIsCartOpen(true);
    };

    const handleSelectPost = (post: any) => {
        handleNavigate('blogPost', post);
    };

    const renderContent = () => {
        switch (view.current) {
            case 'home':
                return <ProductList onNavigate={handleNavigate} onProductSelect={handleProductSelect} onAddToCart={handleAddToCart} onQuickAddToCart={handleQuickAddToCart} currency={currency} onQuickView={setQuickViewProduct} />;
            case 'products':
                return <ShopPage initialCategory={view.payload || 'all'} currency={currency} onAddToCart={handleAddToCart} onQuickAddToCart={handleQuickAddToCart} onProductSelect={handleProductSelect} onQuickView={setQuickViewProduct} />;
            case 'productDetail':
                return <ProductDetailPage product={view.payload} currency={currency} onAddToCart={handleAddToCart} onQuickAddToCart={handleQuickAddToCart} onProductSelect={handleProductSelect} onQuickView={setQuickViewProduct} />;
            case 'ofertas':
                return <OfertasPage currency={currency} onAddToCart={handleAddToCart} onQuickAddToCart={handleQuickAddToCart} onProductSelect={handleProductSelect} onQuickView={setQuickViewProduct} />;
            case 'ia':
                return <AsistenteIAPage />;
            case 'catalog':
                return <CatalogPage onAddToCart={handleAddToCart} onQuickAddToCart={handleQuickAddToCart} onProductSelect={handleProductSelect} onQuickView={setQuickViewProduct} currency={currency} />;
            case 'blog':
                 return <BlogPage posts={blogPosts} onSelectPost={handleSelectPost} />;
            case 'blogPost':
                 return <BlogPostPage post={view.payload} allPosts={blogPosts} onSelectPost={handleSelectPost} onBack={() => handleNavigate('blog')} />;
            case 'checkout':
                return <CheckoutPage cartItems={cartItems} currency={currency} onClearCart={() => setCartItems([])} onNavigate={handleNavigate} />;
            default:
                return <ProductList onNavigate={handleNavigate} onProductSelect={handleProductSelect} onAddToCart={handleAddToCart} onQuickAddToCart={handleQuickAddToCart} currency={currency} onQuickView={setQuickViewProduct} />;
        }
    };
    
    const categories = [
        { key: 'all', name: 'Todos los productos' },
        { key: 'skincare', name: 'Cuidado Facial' },
        { key: 'makeup', name: 'Maquillaje' },
        { key: 'perfume', name: 'Fragancias' },
        { key: 'wellness', name: 'Wellness' },
        { key: 'hair', name: 'Cuidado del Cabello' },
        { key: 'personal-care', name: 'Cuidado Personal' },
        { key: 'men', name: 'Hombre' },
        { key: 'accessories', name: 'Accesorios' },
    ];

    const buildBreadcrumbs = (): BreadcrumbItem[] => {
        // Construct Home URL preserving the 'v' parameter if it exists using URLSearchParams
        const baseUrl = 'https://vellaperfumeria.com';
        const params = new URLSearchParams();
        if (vParam) params.append('v', vParam);
        const queryString = params.toString();
        const homeUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
        
        const homeCrumb: BreadcrumbItem = { 
            label: 'Inicio', 
            href: homeUrl,
            target: '_top'
        };
        const crumbs = [homeCrumb];

        switch(view.current) {
            case 'home':
                crumbs.push({ label: 'Tienda' });
                break;
            case 'products':
                crumbs.push({ label: 'Tienda', onClick: () => handleNavigate('products', 'all') });
                if (view.payload && view.payload !== 'all') {
                    const categoryName = categories.find(c => c.key === view.payload)?.name || view.payload;
                    crumbs.push({ label: categoryName });
                }
                break;
            case 'productDetail':
                {
                    const product = view.payload as Product;
                    const categoryName = categories.find(c => c.key === product.category)?.name || product.category;
                    crumbs.push({ label: 'Tienda', onClick: () => handleNavigate('products', 'all') });
                    crumbs.push({ label: categoryName, onClick: () => handleNavigate('products', product.category) });
                    crumbs.push({ label: product.name });
                }
                break;
            case 'ofertas':
                crumbs.push({ label: 'Ideas Regalo' });
                break;
             case 'ia':
                crumbs.push({ label: 'Asistente IA' });
                break;
            case 'catalog':
                crumbs.push({ label: 'Catálogo' });
                break;
            case 'blog':
                crumbs.push({ label: 'Blog' });
                break;
            case 'blogPost':
                crumbs.push({ label: 'Blog', onClick: () => handleNavigate('blog') });
                crumbs.push({ label: view.payload.title });
                break;
            case 'checkout':
                crumbs.push({ label: 'Finalizar Compra' });
                break;
        }

        return crumbs;
    };

    return (
        <div className="flex flex-col min-h-screen bg-purple-50/30 font-sans">
            <Header
                onNavigate={handleNavigate}
                currency={currency}
                onCurrencyChange={setCurrency}
                cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
            />
             {/* Added padding-bottom (mb-20) to prevent content being hidden behind the bottom nav on mobile */}
             <main className="flex-grow py-8 mb-20 md:mb-0">
                <Breadcrumbs items={buildBreadcrumbs()} />
                {renderContent()}
            </main>
            <Footer onNavigate={handleNavigate} />

            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                currency={currency}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
                isCheckingOut={false}
                checkoutError={null}
                onNavigate={handleNavigate}
            />

            <BottomNavBar onNavigate={handleNavigate} currentView={view.current} />

            {quickViewProduct && (
                <QuickViewModal
                    product={quickViewProduct}
                    currency={currency}
                    onClose={() => setQuickViewProduct(null)}
                    onAddToCart={handleAddToCart}
                    onProductSelect={(p) => {
                        setQuickViewProduct(null);
                        handleProductSelect(p);
                    }}
                />
            )}
            
            <style>{`
                :root {
                    /* Purple Palette */
                    --color-primary: #9333EA; /* Purple 600 */
                    --color-secondary: #E9D5FF; /* Purple 200 */
                    --color-accent: #FDBA74; /* Orange 300 */
                }
                /* Global Selection Color - Soft Purple */
                ::selection {
                    background-color: #A855F7; /* Purple 500 */
                    color: white;
                }
                
                .btn-primary {
                    background-color: #E9D5FF; /* Purple 200 */
                    color: black;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.75rem;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .btn-primary:hover {
                    background-color: #D8B4FE; /* Purple 300 */
                    transform: translateY(-1px);
                }
                 .bg-brand-primary { background-color: #9333EA; } /* Purple 600 */
                 .text-brand-primary { color: #9333EA; }
                 
                 /* Brand Purple Classes */
                 .bg-brand-purple { background-color: #F3E8FF; } /* Purple 100 */
                 .text-brand-purple { color: #9333EA; } /* Purple 600 */
                 
                 .bg-brand-purple-dark { background-color: #D499F5; } /* The Header Color */
                 .text-brand-purple-dark { color: #6B21A8; } /* Purple 800 */
                 
                 .border-brand-purple { border-color: #F3E8FF; }
                 .border-brand-purple-dark { border-color: #D499F5; }
                 
                 .ring-brand-purple { --tw-ring-color: #F3E8FF; }
                 .ring-brand-purple-dark { --tw-ring-color: #D499F5; }

                 .hover-underline-effect {
                    display: inline-block;
                    position: relative;
                 }
                 .hover-underline-effect::after {
                    content: '';
                    position: absolute;
                    width: 100%;
                    transform: scaleX(0);
                    height: 2px;
                    bottom: -2px;
                    left: 0;
                    background-color: #A855F7; /* Purple 500 */
                    transform-origin: bottom right;
                    transition: transform 0.25s ease-out;
                 }
                 .hover-underline-effect:hover::after {
                    transform: scaleX(1);
                    transform-origin: bottom left;
                 }
                 .logo-inverted { filter: brightness(0) invert(1); }
                 @keyframes pop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                 }
                 .animate-pop {
                    animation: pop 0.3s ease-out;
                 }
            `}</style>
        </div>
    );
};

export default App;
