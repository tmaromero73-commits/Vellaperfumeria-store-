import React, { useState, useMemo, useEffect } from 'react';
import ProductList from './components/ProductList';
import AlgaePage from './components/AlgaePage';
import ProductDetailPage from './components/ProductDetailPage';
import CartSidebar from './components/CartSidebar';
import type { Currency } from './components/currency';
import type { Product, CartItem, View } from './components/types';
import OfertasPage from './components/OfertasPage';
import AsistenteIAPage from './components/AsistenteIAPage';
import Header from './components/Header';
import Footer from './components/Footer';
import BlogPage from './components/BlogPage';
import BlogPostPage from './components/BlogPostPage';
import { blogPosts, type BlogPost } from './components/blogData';
import ProductListPage from './components/ProductListPage';
import Breadcrumbs from './components/Breadcrumbs';
import type { BreadcrumbItem } from './components/Breadcrumbs';
import CatalogPage from './components/CatalogPage';
import QuickViewModal from './components/QuickViewModal';
import BottomNavBar from './components/BottomNavBar';
import OrderConfirmationPage from './components/OrderConfirmationPage';

// As a world-class senior frontend engineer, I must declare this so TypeScript knows about the Stripe script loaded in index.html.
declare global {
    interface Window {
        Stripe: any;
    }
}


const App: React.FC = () => {
    const [view, setView] = useState<View>('home');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [currency, setCurrency] = useState<Currency>('EUR');
    const [stripe, setStripe] = useState<any>(null);
    
    // Centralized Stripe Initialization
    useEffect(() => {
        if (window.Stripe) {
            // Using a public test key. This should be stored in an environment variable.
            const stripeInstance = window.Stripe('pk_test_51BTUDGJAJfZb9HEBwDgAbM1GgN2eWp3ZkU8j29D4InTmdS7i8zHADIx2sFLg2vjTSMyl1zCnCmM4MOgC14z0Y4v10080f4q1jM');
            setStripe(stripeInstance);
        }
    }, []);

    const handleNavigate = (newView: View) => {
        // When navigating away from product detail, clear the selected product
        if (view === 'productDetail' && newView !== 'productDetail') {
            setSelectedProduct(null);
        }
        setView(newView);
        window.scrollTo(0, 0); // Scroll to top on page change
    };

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        setView('productDetail');
        window.scrollTo(0, 0);
    };

    const handleSelectPost = (post: BlogPost) => {
        setSelectedPost(post);
        setView('blogPost');
        window.scrollTo(0, 0);
    };

    const handleBackToBlog = () => {
        setSelectedPost(null);
        setView('blog');
    };

    const handleAddToCart = (product: Product, buttonElement: HTMLButtonElement | null, selectedVariant: Record<string, string> | null) => {
        const variantString = selectedVariant ? Object.values(selectedVariant).join('-') : '';
        const cartItemId = `${product.id}-${variantString}`;

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === cartItemId);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === cartItemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { id: cartItemId, product, quantity: 1, selectedVariant }];
        });
        
        // Visual feedback for adding to cart
        if (buttonElement) {
            buttonElement.classList.add('shake');
            setTimeout(() => {
                 buttonElement.classList.remove('shake');
            }, 820);
        }

        setIsCartOpen(true);
    };

    const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            handleRemoveItem(cartItemId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === cartItemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleRemoveItem = (cartItemId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
    };
    
    const handleOrderComplete = () => {
        setCartItems([]);
        handleNavigate('orderConfirmation');
    };

    const cartCount = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);
    
    const getBreadcrumbs = (): BreadcrumbItem[] => {
        const homeCrumb: BreadcrumbItem = { label: 'Inicio', onClick: () => handleNavigate('home') };
        
        switch (view) {
            case 'home':
                return [{ label: 'Inicio' }];
            case 'products':
                return [homeCrumb, { label: 'Tienda' }];
            case 'productDetail':
                if (selectedProduct) {
                    return [homeCrumb, { label: 'Tienda', onClick: () => handleNavigate('products') }, { label: selectedProduct.name }];
                }
                return [homeCrumb, { label: 'Tienda', onClick: () => handleNavigate('products') }];
            case 'algas':
                 return [homeCrumb, { label: 'Finalizar Compra' }];
            case 'ofertas':
                return [homeCrumb, { label: 'Ofertas' }];
            case 'ia':
                return [homeCrumb, { label: 'Asistente IA' }];
             case 'catalog':
                return [homeCrumb, { label: 'Catálogo' }];
            case 'about':
                return [homeCrumb, { label: 'Sobre Nosotros' }];
            case 'contact':
                return [homeCrumb, { label: 'Contacto' }];
            case 'blog':
                return [homeCrumb, { label: 'Blog' }];
            case 'blogPost':
                if (selectedPost) {
                    return [homeCrumb, { label: 'Blog', onClick: () => handleNavigate('blog') }, { label: selectedPost.title }];
                }
                return [homeCrumb, { label: 'Blog', onClick: () => handleNavigate('blog') }];
            case 'orderConfirmation':
                 return [homeCrumb, { label: 'Finalizar Compra', onClick: () => handleNavigate('algas') }, { label: 'Pedido Confirmado' }];
            default:
                return [];
        }
    };

    const renderView = () => {
        switch (view) {
            case 'products':
                return <ProductListPage currency={currency} onAddToCart={handleAddToCart} onProductSelect={handleProductSelect} onQuickView={setQuickViewProduct} />;
            case 'productDetail':
                return selectedProduct ? (
                    <ProductDetailPage
                        product={selectedProduct}
                        currency={currency}
                        onAddToCart={handleAddToCart}
                        onProductSelect={handleProductSelect}
                        onQuickView={setQuickViewProduct}
                        stripe={stripe}
                        onOrderComplete={handleOrderComplete}
                    />
                ) : <div className="text-center p-8"> <p>Producto no encontrado</p></div>;
            case 'algas':
                return <AlgaePage cartItems={cartItems} currency={currency} onNavigate={handleNavigate} onOrderComplete={handleOrderComplete} stripe={stripe} />;
            case 'ofertas':
                return <OfertasPage currency={currency} onAddToCart={handleAddToCart} onProductSelect={handleProductSelect} onQuickView={setQuickViewProduct} />;
            case 'ia':
                return <AsistenteIAPage />;
            case 'catalog':
                return <CatalogPage 
                    currency={currency}
                    onAddToCart={handleAddToCart}
                    onProductSelect={handleProductSelect}
                    onQuickView={setQuickViewProduct}
                />;
             case 'about':
                return <div className="text-center p-8 container mx-auto"><h1 className="text-3xl font-bold text-gray-900">Sobre Nosotros</h1><p className="mt-4 max-w-2xl mx-auto text-gray-800">Somos <a href="https://vellaperfumeria.com" target="_blank" rel="noopener noreferrer" className="text-black font-semibold hover-underline-effect">Vellaperfumeria</a>, tu tienda de confianza para cosméticos y bienestar. Descubre fragancias que definen tu esencia y productos que cuidan de ti. Calidad y exclusividad en cada artículo.</p></div>;
            case 'contact':
                return <div className="text-center p-8 container mx-auto"><h1 className="text-3xl font-bold text-gray-900">Contacto</h1><p className="mt-4 text-gray-800">¿Preguntas? Estamos aquí para ayudarte. Contáctanos por WhatsApp al <a href="https://wa.me/661202616" className="text-black font-semibold hover-underline-effect">661 20 26 16</a> o visita nuestras redes sociales.</p></div>;
            case 'blog':
                return <BlogPage posts={blogPosts} onSelectPost={handleSelectPost} />;
            case 'blogPost':
                 return selectedPost ? <BlogPostPage post={selectedPost} allPosts={blogPosts} onSelectPost={handleSelectPost} onBack={handleBackToBlog} /> : <div className="text-center p-8"><p>Artículo no encontrado</p></div>;
             case 'orderConfirmation':
                return <OrderConfirmationPage onNavigate={handleNavigate} />;
            case 'home':
            default:
                return <ProductList
                    onNavigate={handleNavigate}
                    onProductSelect={handleProductSelect}
                    onAddToCart={handleAddToCart}
                    currency={currency}
                    onQuickView={setQuickViewProduct}
                />;
        }
    };

    return (
        <div className="bg-[var(--color-background)] min-h-screen pb-16 md:pb-0">
            <Header
                onNavigate={handleNavigate}
                currency={currency}
                onCurrencyChange={setCurrency}
                cartCount={cartCount}
                onCartClick={() => setIsCartOpen(true)}
            />
            <main className="pt-8">
                { view !== 'home' && <Breadcrumbs items={getBreadcrumbs()} /> }
                {renderView()}
            </main>
            <Footer onNavigate={handleNavigate} />
            <BottomNavBar onNavigate={handleNavigate} currentView={view} />
            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                currency={currency}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={() => {
                    setIsCartOpen(false);
                    handleNavigate('algas'); // Navigate to the checkout-like page
                }}
            />
            {quickViewProduct && (
                 <QuickViewModal
                    product={quickViewProduct}
                    currency={currency}
                    onClose={() => setQuickViewProduct(null)}
                    onAddToCart={handleAddToCart}
                    onProductSelect={(product) => {
                        setQuickViewProduct(null); // Close modal first
                        handleProductSelect(product); // Then navigate
                    }}
                    stripe={stripe}
                    onOrderComplete={handleOrderComplete}
                />
            )}
        </div>
    );
};

export default App;