import type { Product } from './types';
import { allProducts } from './products';

export interface HotspotData {
    x: number; // percentage from left
    y: number; // percentage from top
    productId: number;
}

export interface CatalogPageData {
    id: number;
    imageUrl: string;
    hotspots: HotspotData[];
    isVideo?: boolean;
    videoUrl?: string;
}

export const catalogData: CatalogPageData[] = [
    {
        id: 1,
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1587&auto=format&fit=crop',
        hotspots: [],
    },
    {
        id: 2,
        imageUrl: 'https://images.unsplash.com/photo-1599330293286-3b421523c3ce?q=80&w=1587&auto=format&fit=crop',
        hotspots: [
             { x: 50, y: 70, productId: 105 }, // Royal Velvet Crema Noche
        ],
    },
    {
        id: 3,
        isVideo: true,
        imageUrl: '', // not used for video
        videoUrl: 'https://storage.googleapis.com/aistudio-public/projects/285319a8-e92c-4235-82e4-92f7b8d41549/oriflame_brand_video.mp4',
        hotspots: [],
    },
    {
        id: 4,
        imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1587&auto=format&fit=crop',
        hotspots: [
            { x: 30, y: 65, productId: 204 }, // Novage+ Sérum
            { x: 70, y: 40, productId: 202 }, // Limpiador Aceite Novage+
        ],
    },
    {
        id: 5,
        imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90138ba0ea5?q=80&w=1740&auto=format&fit=crop',
        hotspots: [
            { x: 25, y: 80, productId: 22442 }, // Love Potion
            { x: 75, y: 55, productId: 46901 }, // Perlas Giordani
        ],
    },
    {
        id: 6,
        imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1744&auto=format&fit=crop',
        hotspots: [
            { x: 80, y: 50, productId: 41702 }, // Labial THE ONE
            { x: 20, y: 70, productId: 38497 }, // Divine perfume
        ],
    },
];