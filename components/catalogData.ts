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
        imageUrl: 'https://es.oriflame.com/--/media/images/brand-pages/the-one/2024/c10/the-one-brand-page-banner-d.ashx',
        hotspots: [],
    },
    {
        id: 2,
        imageUrl: 'https://es.oriflame.com/--/media/images/layout/pages/giordani-gold/2024/c10/giordani-gold-brand-page-banner-d.ashx',
        hotspots: [
             { x: 50, y: 65, productId: 46901 }, // Perlas con Serum Giordani Gold
             { x: 25, y: 50, productId: 43244 }, // Maquillaje Eternal Glow
             { x: 80, y: 75, productId: 17885 }, // Corrector y Serum Potenciador
        ],
    },
    {
        id: 3,
        imageUrl: 'https://es.oriflame.com/--/media/images/products/novage/collagen-wrinkle-power/2023/novage-collagen-wrinkle-power-sets-lifestyle.ashx',
        hotspots: [
            { x: 65, y: 60, productId: 17586 }, // Tratamiento de Día Rico
            { x: 40, y: 70, productId: 46319 }, // Niacinamida 10% Power Drops
            { x: 20, y: 55, productId: 47494 }, // Espuma Limpiadora Skinrelief
        ],
    },
    {
        id: 4,
        isVideo: true,
        imageUrl: '', // not used for video
        videoUrl: 'https://storage.googleapis.com/aistudio-public/projects/285319a8-e92c-4235-82e4-92f7b8d41549/oriflame_brand_video.mp4',
        hotspots: [],
    },
    {
        id: 5,
        imageUrl: 'https://es.oriflame.com/--/media/images/brand-pages/divine/2022/divine-brand-page-banner-d-v2.ashx',
        hotspots: [
            { x: 35, y: 50, productId: 38497 }, // Eau de Parfum Divine
            { x: 65, y: 50, productId: 46801 }, // Eau de Parfum Divine Dark Velvet
        ],
    },
    {
        id: 6,
        imageUrl: 'https://es.oriflame.com/--/media/images/brand-pages/the-one/2022/the-one-brand-page-banner-d-v2.ashx',
        hotspots: [
            { x: 70, y: 60, productId: 47949 }, // Máscara de Pestañas 5 en 1
            { x: 30, y: 55, productId: 46906 }, // Maquillaje Stress-Free
        ],
    },
    {
        id: 7,
        imageUrl: 'https://es.oriflame.com/--/media/images/brand-pages/wellosophy/2023/202306/wellosophy-brand-page-block-3-d.ashx',
        hotspots: [
            { x: 50, y: 50, productId: 104 }, // WellnessPack Mujer Wellosophy
        ],
    },
    {
        id: 8,
        imageUrl: 'https://es.oriflame.com/--/media/images/brand-pages/duologi/2023/duologi-brand-page-banner-d.ashx',
        hotspots: [
            { x: 30, y: 60, productId: 103 }, // Pre-Champú Reparador
            { x: 50, y: 50, productId: 19084 }, // Champú Protector del Color
            { x: 70, y: 65, productId: 19103 }, // Champú Purificante
        ],
    },
];
