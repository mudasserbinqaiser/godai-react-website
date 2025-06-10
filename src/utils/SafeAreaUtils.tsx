import { useEffect, useState } from 'react';

// SafeArea insets utility for iOS
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    function updateSafeArea() {
      const computedStyle = getComputedStyle(document.documentElement);
      
      // Get safe area insets
      const top = parseInt(computedStyle.getPropertyValue('--sat') || '0', 10);
      const right = parseInt(computedStyle.getPropertyValue('--sar') || '0', 10);
      const bottom = parseInt(computedStyle.getPropertyValue('--sab') || '0', 10);
      const left = parseInt(computedStyle.getPropertyValue('--sal') || '0', 10);
      
      setInsets({ top, right, bottom, left });
    }

    // Set up CSS variables for the safe area
    document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top, 0px)');
    document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right, 0px)');
    document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom, 0px)');
    document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left, 0px)');

    // Update insets when the page loads and on resize
    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);

    return () => {
      window.removeEventListener('resize', updateSafeArea);
    };
  }, []);

  return insets;
}

// Get iOS status bar height - useful for positioning content below it
export function useStatusBarHeight() {
  const insets = useSafeAreaInsets();
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  return isIOS ? insets.top : 0;
}

// Check if device is iOS
export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

// iOS has issues with 100vh, this function returns the actual screen height
export function useActualViewportHeight() {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const updateHeight = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  return height;
}
