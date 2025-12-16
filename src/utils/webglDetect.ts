export function detectWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') || canvas.getContext('webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

export function getWebGLContext(): 'webgl2' | 'webgl' | null {
  try {
    const canvas = document.createElement('canvas');
    if (canvas.getContext('webgl2')) return 'webgl2';
    if (canvas.getContext('webgl')) return 'webgl';
    return null;
  } catch (e) {
    return null;
  }
}

