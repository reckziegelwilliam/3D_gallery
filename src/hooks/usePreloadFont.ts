import { useEffect } from 'react';

export function usePreloadFont(fontPath: string) {
  useEffect(() => {
    if (!fontPath) return;

    // Create preload link for font file
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'fetch';
    link.href = fontPath;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    return () => {
      // Cleanup on unmount
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [fontPath]);
}

