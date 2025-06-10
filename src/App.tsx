import { useState, useEffect } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import { ScrollProgressProvider } from './context/ScrollProgressContext';
import Preloader from './components/preloader/preloader';
import Home from './pages/Home';
import { Helmet } from 'react-helmet';
import { isIOS } from './utils/SafeAreaUtils';
// @ts-ignore - Ignore the missing type definitions for Vercel Analytics
import { Analytics } from "@vercel/analytics/react";
import './App.css';
import './styles/ios-fixes.css';
import './styles/ios-device-fixes.css';


function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
    // Detect iOS devices to add specific CSS variables and handle orientation
  useEffect(() => {
    if (isIOS()) {
      // Add a class to handle iOS-specific styles
      document.documentElement.classList.add('ios-device');
      
      // Set CSS variables for viewport height (solves 100vh issue)
      const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Calculate safe area values if they're not automatically available
        if (!CSS.supports('padding-top: env(safe-area-inset-top)')) {
          // Default values for notched iPhones in pixels
          const isLandscape = window.innerWidth > window.innerHeight;
          document.documentElement.style.setProperty('--sat', isLandscape ? '0px' : '44px'); // Status bar (portrait)
          document.documentElement.style.setProperty('--sab', isLandscape ? '21px' : '34px'); // Home indicator
        }
      };
        // This handles iOS keyboard appearance which can change the viewport size
      const handleVisualViewport = () => {
        if ('visualViewport' in window) {
          // When keyboard is visible, adjust the viewport height
          // @ts-ignore - TypeScript might not recognize visualViewport API
          const viewportHeight = window.visualViewport.height;
          document.documentElement.style.setProperty('--vh', `${viewportHeight * 0.01}px`);
        }
      };
      
      setViewportHeight();
      
      window.addEventListener('resize', setViewportHeight);
      window.addEventListener('orientationchange', () => {
        // iOS sometimes needs a delay after orientation changes
        setTimeout(setViewportHeight, 100);
      });
        // VisualViewport API helps handle keyboard appearance
      if ('visualViewport' in window) {
        // @ts-ignore - TypeScript might not recognize visualViewport API
        window.visualViewport.addEventListener('resize', handleVisualViewport);
      }
      
      return () => {
        window.removeEventListener('resize', setViewportHeight);
        window.removeEventListener('orientationchange', setViewportHeight);
        if ('visualViewport' in window) {
          // @ts-ignore - TypeScript might not recognize visualViewport API
          window.visualViewport.removeEventListener('resize', handleVisualViewport);
        }
      };
    }
  }, []);

  const handleLoadingComplete = () => {
    setLoadingComplete(true);
  };

  return (
    <>
    <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </Helmet>
    <ScrollProgressProvider>
      <ParallaxProvider>
        <div className="app">
          <Preloader onLoadingComplete={handleLoadingComplete} />
          
          {loadingComplete && (
            <main className="main-content">
              <Home />
              <Analytics />
            </main>
          )}
        </div>
      </ParallaxProvider>
    </ScrollProgressProvider>
    </>
  );
}

export default App;