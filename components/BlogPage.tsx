
import React, { useState } from 'react';
import type { BlogPost } from './blogData';

interface BlogPageProps {
    posts: BlogPost[];
    onSelectPost: (post: BlogPost) => void;
}

// --- Components for Grid View ---

const FeaturedBlogCard: React.FC<{ post: BlogPost, onSelectPost: (post: BlogPost) => void }> = ({ post, onSelectPost }) => {
    return (
        <div 
            onClick={() => onSelectPost(post)} 
            className="group cursor-pointer md:grid md:grid-cols-2 md:gap-12 items-center mb-16 border-b border-purple-100 pb-12 animate-fade-in"
            role="article"
            aria-labelledby={`featured-blog-title-${post.id}`}
        >
            <div className="overflow-hidden rounded-2xl shadow-lg">
                <img src={post.headerImageUrl} alt={post.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="mt-8 md:mt-0">
                 <span className="inline-block py-1 px-3 rounded-full bg-[#FAF5FF] text-purple-700 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-100">
                    {post.category}
                 </span>
                <h2 id={`featured-blog-title-${post.id}`} className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2 group-hover:text-purple-700 transition-colors leading-tight">{post.title}</h2>
                <p className="text-gray-600 mt-4 text-lg leading-relaxed">{post.excerpt}</p>
                <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">VP</div>
                        <span>{post.author}</span>
                    </div>
                    <span>&bull;</span>
                    <span>{post.date}</span>
                </div>
                <div className="mt-6">
                     <span className="inline-flex items-center font-bold text-purple-600 hover:text-purple-800 transition-colors border-b-2 border-transparent hover:border-purple-600">
                        Leer artículo completo 
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                </div>
            </div>
        </div>
    );
}

const BlogCard: React.FC<{ post: BlogPost, onSelectPost: (post: BlogPost) => void }> = ({ post, onSelectPost }) => {
    return (
        <div 
            className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col group cursor-pointer border border-purple-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full"
            onClick={() => onSelectPost(post)}
            role="article"
            aria-labelledby={`blog-title-${post.id}`}
        >
            <div className="relative h-56 overflow-hidden">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-purple-800 shadow-sm">
                    {post.category}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="text-xs text-gray-400 mb-2">{post.date}</div>
                <h3 id={`blog-title-${post.id}`} className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm flex-grow line-clamp-3 leading-relaxed">{post.excerpt}</p>
                <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-sm font-bold text-purple-600 group-hover:underline">Leer más</span>
                    <svg className="w-5 h-5 text-purple-300 group-hover:text-purple-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
            </div>
        </div>
    );
};

// --- Components for Timeline View ---

const TimelineView: React.FC<{ posts: BlogPost[], onSelectPost: (post: BlogPost) => void }> = ({ posts, onSelectPost }) => {
    return (
        <div className="relative py-8 md:py-16">
            {/* Central Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-purple-200 via-purple-400 to-purple-200"></div>
            
            {/* Left Line for Mobile */}
            <div className="md:hidden absolute left-6 w-0.5 h-full bg-gradient-to-b from-purple-200 via-purple-400 to-purple-200"></div>

            <div className="flex flex-col space-y-12">
                {posts.map((post, index) => {
                    const isLeft = index % 2 === 0;
                    return (
                        <div key={post.id} className={`relative flex flex-col md:flex-row items-center w-full ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                            
                            {/* Content Card */}
                            <div className="w-full md:w-5/12 pl-16 md:pl-0 md:px-0">
                                <div 
                                    onClick={() => onSelectPost(post)}
                                    className={`bg-white p-0 rounded-2xl shadow-md border border-purple-50 cursor-pointer hover:shadow-2xl hover:border-purple-200 transition-all duration-300 group overflow-hidden transform hover:-translate-y-1 ${isLeft ? 'md:mr-8' : 'md:ml-8'}`}
                                >
                                    <div className="h-48 overflow-hidden relative">
                                         <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                                         <div className="absolute bottom-4 left-4 text-white">
                                             <span className="inline-block px-2 py-0.5 rounded bg-[#E9D5FF] text-black text-[10px] font-bold uppercase tracking-wider mb-1">{post.category}</span>
                                             <div className="text-xs font-medium opacity-90">{post.date}</div>
                                         </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">{post.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                                        <div className="flex items-center font-bold text-sm text-purple-600">
                                            Leer historia
                                            <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Center Dot (Absolute positioning for responsiveness) */}
                            <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-8 h-8 bg-white border-4 border-purple-500 rounded-full shadow-lg z-10">
                                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
                            </div>

                            {/* Spacer for grid alignment on desktop */}
                            <div className="hidden md:block w-5/12"></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const BlogPage: React.FC<BlogPageProps> = ({ posts, onSelectPost }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('timeline'); // Default to timeline as requested
    const featuredPost = posts[0];
    const otherPosts = posts.slice(1);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12 animate-fade-in">
                <span className="text-purple-600 font-bold tracking-wider uppercase text-sm">Beauty Blog</span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mt-2 mb-4">Inspiración y Estilismo</h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 font-light">
                    Explora nuestros últimos artículos, tutoriales y secretos de belleza en nuestra galería.
                </p>
                
                {/* Toggle Controls */}
                <div className="mt-8 inline-flex bg-[#FAF5FF] p-1.5 rounded-full relative border border-purple-100 shadow-inner">
                    <div 
                        className={`absolute top-1.5 bottom-1.5 rounded-full bg-white shadow-md transition-all duration-300 ease-out`}
                        style={{ 
                            left: viewMode === 'grid' ? '6px' : '50%', 
                            width: 'calc(50% - 6px)' 
                        }}
                    ></div>
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`relative z-10 px-8 py-2 rounded-full text-sm font-bold transition-colors duration-300 flex items-center gap-2 ${viewMode === 'grid' ? 'text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        Cuadrícula
                    </button>
                    <button 
                        onClick={() => setViewMode('timeline')}
                        className={`relative z-10 px-8 py-2 rounded-full text-sm font-bold transition-colors duration-300 flex items-center gap-2 ${viewMode === 'timeline' ? 'text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Timeline
                    </button>
                </div>
            </div>
            
            {viewMode === 'grid' ? (
                <div className="animate-fade-in">
                    {featuredPost && <FeaturedBlogCard post={featuredPost} onSelectPost={onSelectPost} />}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {otherPosts.map(post => (
                            <BlogCard key={post.id} post={post} onSelectPost={onSelectPost} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <TimelineView posts={posts} onSelectPost={onSelectPost} />
                </div>
            )}
            
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default BlogPage;
