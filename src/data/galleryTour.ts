import { TourWaypoint } from '@/types/gallery';

export const galleryTour: TourWaypoint[] = [
  {
    id: 'welcome',
    position: [0, 1.65, 7],
    lookAt: [0, 1.5, 3],
    dwellSeconds: 5,
    narration:
      "Welcome to Leslie's Gallery. We'll journey through four distinct rooms, each showcasing a different aspect of her artistic talent.",
  },
  // ROOM 1: Entrance Gallery
  {
    id: 'mountain-sunrise',
    position: [-2, 1.65, 4.5],
    lookAt: [-3.5, 1.5, 4],
    dwellSeconds: 7,
    artworkId: 'mountain-sunrise',
    narration:
      'We begin with Mountain Sunrise. The way Leslie captures light in her landscapes is truly remarkable.',
  },
  {
    id: 'coastal-serenity',
    position: [2, 1.65, 2.5],
    lookAt: [3.5, 1.5, 2],
    dwellSeconds: 6,
    artworkId: 'coastal-serenity',
    narration:
      'This coastal scene brings back memories of family trips. Notice the delicate brushwork in the waves.',
  },
  // Transition to Room 2
  {
    id: 'entering-abstract',
    position: [0, 1.65, 0],
    lookAt: [-5, 1.5, -3.5],
    dwellSeconds: 3,
    narration:
      'Moving through to the abstract wing, where we see a different facet of her creativity...',
  },
  // ROOM 2: Abstract Wing
  {
    id: 'color-symphony',
    position: [-6, 1.65, -2.5],
    lookAt: [-7.5, 1.5, -3],
    dwellSeconds: 7,
    artworkId: 'color-symphony',
    narration:
      'Color Symphony showcases bold, fearless expression. Abstract art reveals emotion in its purest form.',
  },
  // ROOM 3: Early Works
  {
    id: 'first-landscape',
    position: [6, 1.65, -2.5],
    lookAt: [7.5, 1.5, -3],
    dwellSeconds: 7,
    artworkId: 'first-landscape',
    narration:
      'In the Early Works chamber, we see where it all began. This is one of the earliest pieces in the collection.',
  },
  // Transition to Room 4
  {
    id: 'entering-feature',
    position: [0, 1.65, -7],
    lookAt: [0, 1.5, -10.5],
    dwellSeconds: 3,
    narration:
      'And now, we arrive at the featured collection - the finest works...',
  },
  // ROOM 4: Feature Gallery - Finale
  {
    id: 'golden-hour',
    position: [1.5, 1.65, -11.5],
    lookAt: [2.5, 1.5, -12],
    dwellSeconds: 8,
    artworkId: 'golden-hour',
    narration:
      'We finish with Golden Hour, one of the most recent works. The growth, the mastery, the beauty - it all comes together here.',
  },
  {
    id: 'thank-you-finale',
    position: [0, 1.65, -12],
    lookAt: [0, 2.2, -13.8],
    dwellSeconds: 10,
    narration:
      'And finally, a message of gratitude for sharing this incredible gift with all of us.',
  },
];
