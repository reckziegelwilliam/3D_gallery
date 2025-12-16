import * as THREE from 'three';

export function lerp(start: number, end: number, alpha: number): number {
  return start + (end - start) * alpha;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function lerpVector3(
  start: THREE.Vector3,
  end: THREE.Vector3,
  alpha: number
): THREE.Vector3 {
  return new THREE.Vector3(
    lerp(start.x, end.x, alpha),
    lerp(start.y, end.y, alpha),
    lerp(start.z, end.z, alpha)
  );
}

