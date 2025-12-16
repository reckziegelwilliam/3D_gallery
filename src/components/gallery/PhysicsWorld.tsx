'use client';

import React from 'react';
import { Physics } from '@react-three/rapier';

interface PhysicsWorldProps {
  children: React.ReactNode;
}

export function PhysicsWorld({ children }: PhysicsWorldProps) {
  return (
    <Physics gravity={[0, -9.81, 0]} debug={false}>
      {children}
    </Physics>
  );
}

