import React from 'react';
import Image from 'next/image';
import { Artwork } from '@/types/gallery';

interface CardProps {
  artwork: Artwork;
  onClick: () => void;
}

export function Card({ artwork, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative w-full" style={{ paddingTop: '75%' }}>
        <Image
          src={artwork.imagePath}
          alt={artwork.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-serif font-semibold text-gallery-darkWood mb-1 group-hover:text-gallery-gold transition-colors">
          {artwork.title}
        </h3>
        <p className="text-sm text-gallery-accent">
          {artwork.year} • {artwork.medium}
        </p>
      </div>
    </div>
  );
}

