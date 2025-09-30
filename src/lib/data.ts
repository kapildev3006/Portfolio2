import { portfolioData } from '@/lib/portfolio-data';
import type { PortfolioData } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => {
    const image = PlaceHolderImages.find(img => img.id === id);
    return image || { imageUrl: 'https://placehold.co/600x400', imageHint: 'placeholder image' };
}

// This function is now used inside portfolio-data.tsx, but needs to be here to avoid circular dependencies
// as portfolio-data.tsx imports types from this file.
// We can't move getImage to types.ts as it has side-effects.

export { portfolioData, getImage };
