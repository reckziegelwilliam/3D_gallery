'use client';

import React, { useMemo } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { GALLERY_CONFIG } from '@/data/galleryConfig';

// Multi-room procedural gallery
export function ProceduralGallery() {
  const height = GALLERY_CONFIG.gallery.wallHeight;
  const wallThickness = 0.2;

  // Materials - memoized to prevent recreation on every render
  const materials = useMemo(
    () => ({
      floor: new THREE.MeshStandardMaterial({
        color: '#A0896C',
        roughness: 0.6,
        metalness: 0.1,
      }),
      wall: new THREE.MeshStandardMaterial({
        color: '#FAFAFA',
        roughness: 0.65,
        metalness: 0.05,
        emissive: '#FFFFFF',
        emissiveIntensity: 0.35,
      }),
      ceiling: new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        roughness: 0.8,
        emissive: '#FAFAFA',
        emissiveIntensity: 0.25,
      }),
    }),
    []
  );

  return (
    <group>
      {/* Master Floor - spans entire gallery */}
      <RigidBody type="fixed" colliders={false}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -4]} receiveShadow>
          <planeGeometry args={[22, 24]} />
          <primitive object={materials.floor} attach="material" />
        </mesh>
        <CuboidCollider args={[11, 0.1, 12]} position={[0, -0.1, -4]} />
      </RigidBody>

      {/* Master Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, -4]} receiveShadow>
        <planeGeometry args={[22, 24]} />
        <primitive object={materials.ceiling} attach="material" />
      </mesh>

      {/* ROOM 1: Entrance Gallery (7m × 5m) - Center at [0, 0, 3] */}
      <Room1Entrance materials={materials} height={height} wallThickness={wallThickness} />

      {/* ROOM 2: Abstract Wing (5m × 5m) - Center at [-5, 0, -3.5] */}
      <Room2Abstract materials={materials} height={height} wallThickness={wallThickness} />

      {/* ROOM 3: Early Works (5m × 5m) - Center at [5, 0, -3.5] */}
      <Room3EarlyWorks materials={materials} height={height} wallThickness={wallThickness} />

      {/* ROOM 4: Feature Gallery (5m × 7m) - Center at [0, 0, -10.5] */}
      <Room4Feature materials={materials} height={height} wallThickness={wallThickness} />

      {/* Outer Perimeter Walls - Enclose entire gallery */}
      <OuterWalls materials={materials} height={height} wallThickness={wallThickness} />
    </group>
  );
}

// Room 1: Entrance Gallery - Landscapes
function Room1Entrance({ materials, height, wallThickness }: any) {
  return (
    <group position={[0, 0, 3]}>
      {/* West wall */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[-3.5, height / 2, 0]}>
          <boxGeometry args={[wallThickness, height, 5]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[wallThickness / 2, height / 2, 2.5]} position={[-3.5, height / 2, 0]} />
      </RigidBody>

      {/* East wall */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[3.5, height / 2, 0]}>
          <boxGeometry args={[wallThickness, height, 5]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[wallThickness / 2, height / 2, 2.5]} position={[3.5, height / 2, 0]} />
      </RigidBody>

      {/* South wall (entrance) - with opening */}
      <RigidBody type="fixed" colliders={false}>
        {/* Left section */}
        <mesh position={[-2.5, height / 2, 2.5]}>
          <boxGeometry args={[3, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[1.5, height / 2, wallThickness / 2]} position={[-2.5, height / 2, 2.5]} />

        {/* Right section */}
        <mesh position={[2.5, height / 2, 2.5]}>
          <boxGeometry args={[3, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[1.5, height / 2, wallThickness / 2]} position={[2.5, height / 2, 2.5]} />

        {/* Header above entrance */}
        <mesh position={[0, height - 0.6, 2.5]}>
          <boxGeometry args={[2, 1.2, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
      </RigidBody>

      {/* North wall - with archway to Rooms 2 & 3 */}
      <RigidBody type="fixed" colliders={false}>
        {/* Left section */}
        <mesh position={[-2.5, height / 2, -2.5]}>
          <boxGeometry args={[2, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[1, height / 2, wallThickness / 2]} position={[-2.5, height / 2, -2.5]} />

        {/* Right section */}
        <mesh position={[2.5, height / 2, -2.5]}>
          <boxGeometry args={[2, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[1, height / 2, wallThickness / 2]} position={[2.5, height / 2, -2.5]} />

        {/* Archway header */}
        <mesh position={[0, height - 0.7, -2.5]}>
          <boxGeometry args={[3, 1.4, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
      </RigidBody>
    </group>
  );
}

// Room 2: Abstract Wing
function Room2Abstract({ materials, height, wallThickness }: any) {
  return (
    <group position={[-5, 0, -3.5]}>
      {/* West wall (outer) */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[-2.5, height / 2, 0]}>
          <boxGeometry args={[wallThickness, height, 5]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[wallThickness / 2, height / 2, 2.5]} position={[-2.5, height / 2, 0]} />
      </RigidBody>

      {/* East wall (divider with Room 3) */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[2.5, height / 2, 0]}>
          <boxGeometry args={[wallThickness, height, 5]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[wallThickness / 2, height / 2, 2.5]} position={[2.5, height / 2, 0]} />
      </RigidBody>

      {/* South wall - with archway from Room 1 */}
      <RigidBody type="fixed" colliders={false}>
        {/* Left section */}
        <mesh position={[-1.5, height / 2, 2.5]}>
          <boxGeometry args={[2, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[1, height / 2, wallThickness / 2]} position={[-1.5, height / 2, 2.5]} />

        {/* Archway header */}
        <mesh position={[0, height - 0.7, 2.5]}>
          <boxGeometry args={[1.5, 1.4, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
      </RigidBody>

      {/* North wall - with archway to Room 4 */}
      <RigidBody type="fixed" colliders={false}>
        {/* Left section */}
        <mesh position={[-1.5, height / 2, -2.5]}>
          <boxGeometry args={[2, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[1, height / 2, wallThickness / 2]} position={[-1.5, height / 2, -2.5]} />

        {/* Archway header */}
        <mesh position={[0, height - 0.7, -2.5]}>
          <boxGeometry args={[1.5, 1.4, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
      </RigidBody>
    </group>
  );
}

// Room 3: Early Works
function Room3EarlyWorks({ materials, height, wallThickness }: any) {
  return (
    <group position={[5, 0, -3.5]}>
      {/* West wall (divider with Room 2) - shared */}
      {/* Handled by Room 2's east wall */}

      {/* East wall (outer) */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[2.5, height / 2, 0]}>
          <boxGeometry args={[wallThickness, height, 5]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[wallThickness / 2, height / 2, 2.5]} position={[2.5, height / 2, 0]} />
      </RigidBody>

      {/* South wall - with archway from Room 1 */}
      <RigidBody type="fixed" colliders={false}>
        {/* Right section */}
        <mesh position={[1.5, height / 2, 2.5]}>
          <boxGeometry args={[2, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[1, height / 2, wallThickness / 2]} position={[1.5, height / 2, 2.5]} />

        {/* Archway header */}
        <mesh position={[0, height - 0.7, 2.5]}>
          <boxGeometry args={[1.5, 1.4, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
      </RigidBody>

      {/* North wall - with archway to Room 4 */}
      <RigidBody type="fixed" colliders={false}>
        {/* Right section */}
        <mesh position={[1.5, height / 2, -2.5]}>
          <boxGeometry args={[2, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[1, height / 2, wallThickness / 2]} position={[1.5, height / 2, -2.5]} />

        {/* Archway header */}
        <mesh position={[0, height - 0.7, -2.5]}>
          <boxGeometry args={[1.5, 1.4, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
      </RigidBody>
    </group>
  );
}

// Room 4: Feature Gallery - Finale
function Room4Feature({ materials, height, wallThickness }: any) {
  return (
    <group position={[0, 0, -10.5]}>
      {/* West wall */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[-2.5, height / 2, 0]}>
          <boxGeometry args={[wallThickness, height, 7]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[wallThickness / 2, height / 2, 3.5]} position={[-2.5, height / 2, 0]} />
      </RigidBody>

      {/* East wall */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[2.5, height / 2, 0]}>
          <boxGeometry args={[wallThickness, height, 7]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[wallThickness / 2, height / 2, 3.5]} position={[2.5, height / 2, 0]} />
      </RigidBody>

      {/* North wall (back) - solid wall for Thank You message */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[0, height / 2, -3.5]}>
          <boxGeometry args={[5, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[2.5, height / 2, wallThickness / 2]} position={[0, height / 2, -3.5]} />
      </RigidBody>

      {/* South wall - with wide archway from Rooms 2 & 3 */}
      <RigidBody type="fixed" colliders={false}>
        {/* Left section */}
        <mesh position={[-1.75, height / 2, 3.5]}>
          <boxGeometry args={[1.5, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[0.75, height / 2, wallThickness / 2]} position={[- 1.75, height / 2, 3.5]} />

        {/* Right section */}
        <mesh position={[1.75, height / 2, 3.5]}>
          <boxGeometry args={[1.5, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[0.75, height / 2, wallThickness / 2]} position={[1.75, height / 2, 3.5]} />

        {/* Archway header */}
        <mesh position={[0, height - 0.7, 3.5]}>
          <boxGeometry args={[2, 1.4, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
      </RigidBody>
    </group>
  );
}

// Outer Perimeter Walls - Enclose entire gallery
function OuterWalls({ materials, height, wallThickness }: any) {
  return (
    <group>
      {/* South outer wall - split into sections to align with entrance */}
      {/* Left section - behind left entrance wall */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[-4.5, height / 2, 6]}>
          <boxGeometry args={[3, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[1.5, height / 2, wallThickness / 2]} position={[-4.5, height / 2, 6]} />
      </RigidBody>

      {/* Right section - behind right entrance wall */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[4.5, height / 2, 6]}>
          <boxGeometry args={[3, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[1.5, height / 2, wallThickness / 2]} position={[4.5, height / 2, 6]} />
      </RigidBody>

      {/* North outer wall - behind Room 4 */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[0, height / 2, -14.5]}>
          <boxGeometry args={[6, height, wallThickness]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[3, height / 2, wallThickness / 2]} position={[0, height / 2, -14.5]} />
      </RigidBody>

      {/* West outer wall */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[-8, height / 2, -4]}>
          <boxGeometry args={[wallThickness, height, 20]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[wallThickness / 2, height / 2, 10]} position={[-8, height / 2, -4]} />
      </RigidBody>

      {/* East outer wall */}
      <RigidBody type="fixed" colliders={false}>
        <mesh position={[8, height / 2, -4]}>
          <boxGeometry args={[wallThickness, height, 20]} />
          <primitive object={materials.wall} attach="material" />
        </mesh>
        <CuboidCollider args={[wallThickness / 2, height / 2, 10]} position={[8, height / 2, -4]} />
      </RigidBody>

      {/* Entrance guide barriers - keep player from walking backwards out */}
      <RigidBody type="fixed">
        {/* Left entrance guide */}
        <CuboidCollider args={[0.1, 2.5, 1]} position={[-1.2, 1.25, 5.8]} />
        {/* Right entrance guide */}
        <CuboidCollider args={[0.1, 2.5, 1]} position={[1.2, 1.25, 5.8]} />
        {/* Back barrier behind spawn - prevents backing through wall */}
        <CuboidCollider args={[2, 2.5, 0.1]} position={[0, 1.25, 5.6]} />
      </RigidBody>

      {/* Safety floor edge colliders - invisible barriers at boundaries */}
      <RigidBody type="fixed">
        <CuboidCollider args={[9, 0.5, 0.2]} position={[0, -0.5, -16]} />   {/* North edge */}
        <CuboidCollider args={[9, 0.5, 0.2]} position={[0, -0.5, 8]} />     {/* South edge */}
        <CuboidCollider args={[0.2, 0.5, 12]} position={[-11, -0.5, -4]} /> {/* West edge */}
        <CuboidCollider args={[0.2, 0.5, 12]} position={[11, -0.5, -4]} />  {/* East edge */}
      </RigidBody>
    </group>
  );
}
