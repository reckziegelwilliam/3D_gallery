import { TourWaypoint } from '@/types/gallery';

export const galleryTour: TourWaypoint[] = [
  {
    id: 'welcome',
    position: [0, 1.65, 8],
    lookAt: [0, 1.5, 0],
    dwellSeconds: 4,
    narration:
      "Welcome to Mom's Gallery. Let me guide you through some of the most special pieces in this collection.",
  },
  {
    id: 'mountain-sunrise',
    position: [-5, 1.65, 1],
    lookAt: [-7, 1.5, 0],
    dwellSeconds: 7,
    artworkId: 'mountain-sunrise',
    narration:
      'Mountain Sunrise captures the breathtaking beauty of dawn. The way Mom captures light in her landscapes is truly remarkable.',
  },
  {
    id: 'coastal-serenity',
    position: [-5, 1.65, -2],
    lookAt: [-7, 1.5, -3],
    dwellSeconds: 6,
    artworkId: 'coastal-serenity',
    narration:
      'This coastal scene brings back memories of family trips. Notice the delicate brushwork in the waves.',
  },
  {
    id: 'garden-bloom',
    position: [0, 1.65, -6],
    lookAt: [0, 1.5, -8.5],
    dwellSeconds: 6,
    artworkId: 'garden-bloom',
    narration:
      'Garden in Bloom showcases vibrant colors and life. Mom has always had a gift for bringing gardens to life, both on canvas and in reality.',
  },
  {
    id: 'color-symphony',
    position: [5, 1.65, 1],
    lookAt: [7, 1.5, 0],
    dwellSeconds: 7,
    artworkId: 'color-symphony',
    narration:
      'Moving into the abstract collection, Color Symphony shows a different facet of her artistic expression - bold and fearless.',
  },
  {
    id: 'first-landscape',
    position: [-5, 1.65, 3],
    lookAt: [-7, 1.5, 2],
    dwellSeconds: 7,
    artworkId: 'first-landscape',
    narration:
      'This is one of the earliest pieces in the collection. Looking at it now, you can see the foundation of a lifelong passion.',
  },
  {
    id: 'golden-hour',
    position: [5, 1.65, -1],
    lookAt: [7, 1.5, -2],
    dwellSeconds: 8,
    artworkId: 'golden-hour',
    narration:
      'We finish with Golden Hour, one of the most recent works. The growth, the mastery, the beauty - it all comes together here. Thank you for sharing your gift with us, Mom.',
  },
];

