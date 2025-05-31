import { useState, useEffect, useRef } from 'react';
import './preloader.css';

interface PreloaderProps {
  onLoadingComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
    const [loading] = useState(true);
    const [loadingPercentage, setLoadingPercentage] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const loadingInterval = useRef<number | null>(null);
    const assetsLoaded = useRef<boolean>(false);

  // Track actual asset loading
  useEffect(() => {
    // Create a list of all critical assets to load
    const imagesToPreload: string[] = [
      '/assets/images/2.png',
      '/assets/images/enter-godai.png',
      '/assets/images/nft1.png',
      '/assets/images/nft2.png',
      '/assets/images/nft3.png',
      '/assets/images/nft4.png',
      '/assets/images/nft5.png',
      '/assets/images/nft6.png',
      '/assets/images/nft7.png',
      '/assets/images/hero-page-characters.png',
      '/assets/images/gaming.png',
      '/assets/images/join.png',
      '/assets/images/signup.png',
      '/assets/images/socials_banner.png',
      '/assets/images/team.png',
      '/assets/videos/2.mp4',
      '/assets/videos/gaming.mp4',
      '/assets/videos/hero-background.mp4',
      '/assets/videos/manga.mp4',
      '/assets/videos/nft.mp4',
      '/assets/videos/socials.mp4',
    ];

    const fontsToCheck = ['Cyberjunkies'];
    let loadedCount = 0;
    let totalAssets = imagesToPreload.length + fontsToCheck.length + 1; // +1 for document ready

    // Function to update loading progress based on actual assets
    const updateProgress = () => {
      loadedCount++;
      const realPercentage = Math.floor((loadedCount / totalAssets) * 100);
      if (realPercentage >= 100) {
        assetsLoaded.current = true;
      }
    };

    // Check when document is fully loaded
    if (document.readyState === 'complete') {
      updateProgress();
    } else {
      window.addEventListener('load', updateProgress);
    }

    // Check font loading
    fontsToCheck.forEach(font => {
      document.fonts.ready.then(() => {
        // Check if the specific font is loaded
        if (document.fonts.check(`1em ${font}`)) {
          updateProgress();
        } else {
          // If font check fails, still count it as loaded after timeout
          setTimeout(updateProgress, 1000);
        }
      });
    });

    // Preload images
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.onload = updateProgress;
      img.onerror = updateProgress; // Count errors as "loaded" to avoid hanging
      img.src = src;
    });

    return () => {
      window.removeEventListener('load', updateProgress);
    };
  }, []);

  // Simulate loading process with percentage counter, but respect actual asset loading
  useEffect(() => {
  let startTime = Date.now();
  const minLoadingTime = 5000;  // Increased Minimum time (5s)
  const maxLoadingTime = 8000;  // Increased Maximum time (8s)

  loadingInterval.current = window.setInterval(() => {
    const elapsed = Date.now() - startTime;
    let percentage: number;

      if (assetsLoaded.current) {
        percentage = Math.min(Math.floor((elapsed / minLoadingTime) * 100), 100);
      } else if (elapsed > maxLoadingTime) {
        percentage = 100;
      } else {
        percentage = Math.min(Math.floor((elapsed / maxLoadingTime) * 100), 95);
      }

      setLoadingPercentage(percentage);

      if (percentage >= 100) {
        if (loadingInterval.current) clearInterval(loadingInterval.current);
        
        // Start fade out animation
        setFadeOut(true);
        
        // Notify parent that loading is complete after animation
        setTimeout(() => {
          onLoadingComplete();
        }, 1000);
      }
    }, 50);

    return () => {
      if (loadingInterval.current) clearInterval(loadingInterval.current);
    };
  }, [onLoadingComplete]);

  return (
    <div className={`preloader ${fadeOut ? 'fade-out' : ''}`}>
      <div className="preloader-content">
        <h1 className="godai-text">Godai</h1>
        
        <div className="loading-progress">
          <div className="loading-bar" style={{ width: `${loadingPercentage}%` }}></div>
        </div>
        
        <div className="loading-percentage">
          {loading ? `${loadingPercentage}%` : ''}
        </div>
      </div>
    </div>
  );
};

export default Preloader;