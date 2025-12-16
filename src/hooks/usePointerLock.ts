import { useEffect, useRef, useState } from 'react';

export function usePointerLock() {
  const [isLocked, setIsLocked] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleLockChange = () => {
      setIsLocked(document.pointerLockElement !== null);
    };

    document.addEventListener('pointerlockchange', handleLockChange);
    document.addEventListener('pointerlockerror', () => {
      console.error('Pointer lock error');
    });

    return () => {
      document.removeEventListener('pointerlockchange', handleLockChange);
    };
  }, []);

  const requestLock = (element: HTMLElement) => {
    elementRef.current = element;
    element.requestPointerLock();
  };

  const exitLock = () => {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  };

  return { isLocked, requestLock, exitLock };
}

