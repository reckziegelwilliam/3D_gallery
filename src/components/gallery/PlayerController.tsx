'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useGalleryStore } from '@/store/galleryStore';
import { GALLERY_CONFIG } from '@/data/galleryConfig';
import { clamp, degToRad } from '@/utils/calculations';
import * as THREE from 'three';

export function PlayerController() {
  const rigidBodyRef = useRef<any>(null);
  const { camera, gl } = useThree();
  const keys = useKeyboard();
  
  // Use Zustand selectors to prevent unnecessary re-renders
  const settings = useGalleryStore((state) => state.settings);
  const tourActive = useGalleryStore((state) => state.tourActive);
  const isInspecting = useGalleryStore((state) => state.isInspecting);

  // Camera rotation state
  const yaw = useRef(0);
  const pitch = useRef(0);

  // Pointer lock state
  const isLocked = useRef(false);

  // Reusable vector instances to avoid garbage collection
  const forward = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const yAxis = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    // Set initial camera position
    camera.position.set(0, GALLERY_CONFIG.player.eyeHeight, 5);

    // Get the canvas element
    const canvas = gl.domElement;

    // Pointer lock handlers
    const handlePointerLockChange = () => {
      isLocked.current = document.pointerLockElement === canvas;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isLocked.current || tourActive || isInspecting) return;

      const sensitivity = settings.mouseSensitivity * 0.002;

      yaw.current -= e.movementX * sensitivity;
      pitch.current -= e.movementY * sensitivity;
      pitch.current = clamp(
        pitch.current,
        degToRad(GALLERY_CONFIG.camera.minPitch),
        degToRad(GALLERY_CONFIG.camera.maxPitch)
      );
    };

    const handleClick = () => {
      if (!isLocked.current && !tourActive && !isInspecting) {
        canvas.requestPointerLock();
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [camera, gl, settings.mouseSensitivity, tourActive, isInspecting]);

  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;

    // Get current position
    const position = rigidBodyRef.current.translation();

    // Update camera rotation
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;

    // Update camera position (follow player)
    camera.position.set(
      position.x,
      position.y + GALLERY_CONFIG.player.eyeHeight - 0.85,
      position.z
    );

    // Movement (only if not in tour or inspect mode)
    if (!tourActive && !isInspecting && isLocked.current) {
      const speed = settings.movementSpeed;
      const velocity = { x: 0, y: 0, z: 0 };

      // Calculate movement direction based on camera yaw using reusable vectors
      forward.current.set(0, 0, -1);
      right.current.set(1, 0, 0);

      forward.current.applyAxisAngle(yAxis.current, yaw.current);
      right.current.applyAxisAngle(yAxis.current, yaw.current);

      // WASD movement
      if (keys['KeyW'] || keys['ArrowUp']) {
        velocity.x += forward.current.x * speed;
        velocity.z += forward.current.z * speed;
      }
      if (keys['KeyS'] || keys['ArrowDown']) {
        velocity.x -= forward.current.x * speed;
        velocity.z -= forward.current.z * speed;
      }
      if (keys['KeyA'] || keys['ArrowLeft']) {
        velocity.x -= right.current.x * speed;
        velocity.z -= right.current.z * speed;
      }
      if (keys['KeyD'] || keys['ArrowRight']) {
        velocity.x += right.current.x * speed;
        velocity.z += right.current.z * speed;
      }

      // Get current velocity to maintain Y component (gravity)
      const currentVel = rigidBodyRef.current.linvel();
      rigidBodyRef.current.setLinvel(
        { x: velocity.x, y: currentVel.y, z: velocity.z },
        true
      );
    }

    // Head bob animation (if enabled and moving)
    if (
      settings.headBobEnabled &&
      !settings.motionReduced &&
      !tourActive &&
      !isInspecting &&
      isLocked.current
    ) {
      const isMoving =
        keys['KeyW'] ||
        keys['KeyS'] ||
        keys['KeyA'] ||
        keys['KeyD'] ||
        keys['ArrowUp'] ||
        keys['ArrowDown'] ||
        keys['ArrowLeft'] ||
        keys['ArrowRight'];

      if (isMoving) {
        const bobAmount = 0.03;
        const bobSpeed = 8;
        const bobOffset = Math.sin(state.clock.elapsedTime * bobSpeed) * bobAmount;
        camera.position.y += bobOffset;
      }
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[0, 1, 5]}
      type="dynamic"
      enabledRotations={[false, false, false]}
      lockRotations
      linearDamping={5}
    >
      <CapsuleCollider
        args={[
          GALLERY_CONFIG.player.capsuleHeight / 2 - GALLERY_CONFIG.player.capsuleRadius,
          GALLERY_CONFIG.player.capsuleRadius,
        ]}
      />
    </RigidBody>
  );
}

