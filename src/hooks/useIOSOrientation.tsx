import { useEffect, useState } from 'react';
import { isIOS } from '../utils/SafeAreaUtils';

/**
 * Hook to detect and handle iOS orientation changes
 * Returns current orientation and viewport dimensions
 */
export function useIOSOrientation() {
  // Default to portrait unless we can detect otherwise
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    typeof window !== 'undefined' 
      ? window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      : 'portrait'
  );
  
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    // iOS has specific viewport height issues
    safeHeight: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    // Only run on iOS devices
    if (!isIOS()) return;
    
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const currentOrientation = height > width ? 'portrait' : 'landscape';
      
      setOrientation(currentOrientation);
      setDimensions({
        width,
        height,
        // Calculate real usable height accounting for iOS UI elements
        safeHeight: height - (
          currentOrientation === 'portrait' 
            ? (width >= 768 ? 20 : 45) // iPad vs iPhone portrait mode
            : 20 // Landscape mode estimate
        )
      });
      
      // Update CSS variables for use in components
      document.documentElement.style.setProperty('--vw', `${width * 0.01}px`);
      document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
      document.documentElement.style.setProperty('--safe-vh', `${dimensions.safeHeight * 0.01}px`);
    };
    
    // Apply immediately and set up listeners
    handleResize();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      // iOS sometimes needs a small delay after orientation change
      setTimeout(handleResize, 100);
    });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return { orientation, dimensions };
}

export default useIOSOrientation;
