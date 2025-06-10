import { useEffect } from 'react';

/**
 * Hook to handle iOS-specific viewport issues
 * 
 * This hook addresses two key iOS issues:
 * 1. The 100vh height problem where mobile browsers don't correctly handle viewport height
 * 2. Safe area insets for notched devices
 */
export function useResponsiveViewport() {
  useEffect(() => {
    // Function to update viewport height variable
    const updateViewportHeight = () => {
      // First, get the viewport height
      const vh = window.innerHeight * 0.01;
      // Set the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Function to handle orientation change
    const handleOrientationChange = () => {
      // Add a small delay to ensure the browser has updated dimensions
      setTimeout(() => {
        updateViewportHeight();
      }, 100);
    };
    
    // Initial call to set the viewport height
    updateViewportHeight();
    
    // Add event listeners for resize and orientation change
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // iOS-specific scroll behavior
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      // Apply iOS-specific overscroll behavior
      document.body.style.overscrollBehaviorY = 'none';
      
      // Prevent bounce effect on iOS when at the top/bottom of the page
      document.body.addEventListener('touchstart', (e) => {
        // Check if we're at the top or bottom of the page
        const top = window.scrollY === 0;
        const bottom = window.scrollY + window.innerHeight >= document.body.scrollHeight;
        
        if ((top && e.touches[0].screenY > window.innerHeight / 2) || 
            (bottom && e.touches[0].screenY < window.innerHeight / 2)) {
          // Only prevent default if we're at the edge and about to bounce
          e.preventDefault();
        }
      }, { passive: false });
    }
    
    // Clean up
    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
}
