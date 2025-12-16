import { Artwork } from '@/types/gallery';

export const artworks: Artwork[] = [
  // Main Gallery - West Wall
  {
    id: 'mountain-sunrise',
    title: 'Mountain Sunrise',
    year: 2020,
    medium: 'Oil on Canvas',
    imagePath: '/art/artwork-01.svg',
    description:
      'A breathtaking view of mountains at dawn, capturing the golden light as it breaks over the peaks.',
    personalNote:
      'Mom, I remember you painting this during our trip to the mountains. Your ability to capture light is incredible.',
    position: [-7, 1.5, 0],
    rotation: [0, Math.PI / 2, 0],
    realSizeMeters: { width: 0.9, height: 0.7 },
    room: 'landscapes',
    tourStop: 1,
  },
  {
    id: 'coastal-serenity',
    title: 'Coastal Serenity',
    year: 2019,
    medium: 'Acrylic on Canvas',
    imagePath: '/art/artwork-02.svg',
    description:
      'A peaceful coastal scene with gentle waves lapping against rocky shores.',
    personalNote:
      'This piece reminds me of our family vacations by the sea. You always found beauty in the quiet moments.',
    position: [-7, 1.5, -3],
    rotation: [0, Math.PI / 2, 0],
    realSizeMeters: { width: 0.8, height: 0.6 },
    room: 'landscapes',
    tourStop: 2,
  },
  {
    id: 'autumn-forest',
    title: 'Autumn Forest Path',
    year: 2021,
    medium: 'Watercolor',
    imagePath: '/art/artwork-03.svg',
    description:
      'A winding path through a forest ablaze with autumn colors.',
    personalNote:
      'The warmth in this painting reflects the warmth you bring to our family.',
    position: [-4.5, 1.5, -8.5],
    rotation: [0, 0, 0],
    realSizeMeters: { width: 0.7, height: 0.9 },
    room: 'landscapes',
  },

  // Main Gallery - North Wall
  {
    id: 'garden-bloom',
    title: 'Garden in Bloom',
    year: 2022,
    medium: 'Oil on Canvas',
    imagePath: '/art/artwork-04.svg',
    description:
      'A vibrant garden bursting with colorful flowers in full bloom.',
    personalNote:
      'Just like our garden at home, full of life and color because of your care.',
    position: [0, 1.5, -8.5],
    rotation: [0, 0, 0],
    realSizeMeters: { width: 1.0, height: 0.8 },
    room: 'landscapes',
    tourStop: 3,
  },
  {
    id: 'sunset-harbor',
    title: 'Harbor at Sunset',
    year: 2018,
    medium: 'Oil on Canvas',
    imagePath: '/art/artwork-05.svg',
    description:
      'Boats resting in a harbor as the sun sets, casting long shadows.',
    personalNote:
      'I love how you captured the reflection of light on water here.',
    position: [3, 1.5, -8.5],
    rotation: [0, 0, 0],
    realSizeMeters: { width: 0.85, height: 0.65 },
    room: 'landscapes',
  },

  // East Gallery - Abstract Room
  {
    id: 'color-symphony',
    title: 'Color Symphony',
    year: 2023,
    medium: 'Acrylic on Canvas',
    imagePath: '/art/artwork-06.svg',
    description:
      'An abstract exploration of color and emotion, with bold brushstrokes.',
    personalNote:
      'Your abstract work shows a different side of your creativity - bold and fearless.',
    position: [7, 1.5, 0],
    rotation: [0, -Math.PI / 2, 0],
    realSizeMeters: { width: 1.2, height: 1.0 },
    room: 'abstracts',
    tourStop: 4,
  },
  {
    id: 'geometric-dreams',
    title: 'Geometric Dreams',
    year: 2023,
    medium: 'Mixed Media',
    imagePath: '/art/artwork-07.svg',
    description:
      'A composition of geometric shapes and patterns that create harmony.',
    personalNote: 'The precision in this piece amazes me.',
    position: [4.5, 1.5, -8.5],
    rotation: [0, 0, 0],
    realSizeMeters: { width: 0.8, height: 0.8 },
    room: 'abstracts',
  },
  {
    id: 'fluid-motion',
    title: 'Fluid Motion',
    year: 2022,
    medium: 'Acrylic Pour',
    imagePath: '/art/artwork-08.svg',
    description:
      'An organic flow of colors blending and swirling together.',
    personalNote: 'This technique is so unique - pure artistic expression.',
    position: [6.5, 1.5, -8.5],
    rotation: [0, 0, 0],
    realSizeMeters: { width: 0.9, height: 0.7 },
    room: 'abstracts',
  },

  // Early Works Gallery
  {
    id: 'first-landscape',
    title: 'First Landscape',
    year: 2010,
    medium: 'Oil on Canvas',
    imagePath: '/art/artwork-09.svg',
    description:
      'One of the earliest landscape paintings, showing the foundation of a lifelong passion.',
    personalNote:
      'I remember when you painted this - it was the beginning of something beautiful.',
    position: [-7, 1.5, 2],
    rotation: [0, Math.PI / 2, 0],
    realSizeMeters: { width: 0.7, height: 0.5 },
    room: 'early-works',
    tourStop: 5,
  },
  {
    id: 'learning-portraits',
    title: 'Study in Portraiture',
    year: 2011,
    medium: 'Charcoal on Paper',
    imagePath: '/art/artwork-10.svg',
    description: 'An early exploration of portrait drawing and shading.',
    personalNote: 'Your growth as an artist over the years is incredible.',
    position: [7, 1.5, 2],
    rotation: [0, -Math.PI / 2, 0],
    realSizeMeters: { width: 0.5, height: 0.7 },
    room: 'early-works',
  },
  {
    id: 'still-life-practice',
    title: 'Still Life with Fruit',
    year: 2012,
    medium: 'Acrylic on Canvas',
    imagePath: '/art/artwork-11.svg',
    description: 'A classic still life composition showcasing light and form.',
    personalNote:
      'Even in practice pieces, your attention to detail shines through.',
    position: [-7, 1.5, 5.5],
    rotation: [0, Math.PI / 2, 0],
    realSizeMeters: { width: 0.6, height: 0.5 },
    room: 'early-works',
  },

  // Special Pieces
  {
    id: 'winter-wonderland',
    title: 'Winter Wonderland',
    year: 2021,
    medium: 'Oil on Canvas',
    imagePath: '/art/artwork-12.svg',
    description:
      'A snow-covered landscape with bare trees against a pale winter sky.',
    personalNote:
      'The way you capture the stillness of winter is magical.',
    position: [-3, 1.5, -8.5],
    rotation: [0, 0, 0],
    realSizeMeters: { width: 0.9, height: 0.7 },
    room: 'landscapes',
  },
  {
    id: 'spring-awakening',
    title: 'Spring Awakening',
    year: 2022,
    medium: 'Watercolor',
    imagePath: '/art/artwork-13.svg',
    description:
      'Cherry blossoms in full bloom, celebrating the renewal of spring.',
    personalNote:
      'This painting brings joy every time I see it. Just like you do.',
    position: [3, 1.5, -0.5],
    rotation: [0, -Math.PI / 2, 0],
    realSizeMeters: { width: 0.8, height: 0.6 },
    room: 'abstracts',
  },
  {
    id: 'misty-morning',
    title: 'Misty Morning',
    year: 2020,
    medium: 'Oil on Canvas',
    imagePath: '/art/artwork-14.svg',
    description:
      'A foggy morning scene with soft, diffused light creating atmosphere.',
    personalNote:
      'Your mastery of atmosphere and mood is evident in this piece.',
    position: [-3, 1.5, 0.5],
    rotation: [0, Math.PI / 2, 0],
    realSizeMeters: { width: 0.85, height: 0.65 },
    room: 'landscapes',
  },
  {
    id: 'golden-hour',
    title: 'Golden Hour',
    year: 2023,
    medium: 'Oil on Canvas',
    imagePath: '/art/artwork-15.svg',
    description:
      'A contemporary landscape bathed in the warm glow of golden hour.',
    personalNote:
      'Your latest work - and it might be your best yet. I am so proud of you.',
    position: [7, 1.5, -2],
    rotation: [0, -Math.PI / 2, 0],
    realSizeMeters: { width: 1.1, height: 0.85 },
    room: 'landscapes',
    tourStop: 6,
  },
];

