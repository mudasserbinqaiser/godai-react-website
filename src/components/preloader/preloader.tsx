import { useState, useEffect, useRef } from 'react';
import './preloader.css';

interface PreloaderProps {
  onLoadingComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const loadingInterval = useRef<number | null>(null);
  const assetsLoaded = useRef<boolean>(false);

  // Track actual asset loading
  useEffect(() => {
    // Create a list of all critical assets to load
    const imagesToPreload: string[] = [
      // Add any critical images your site uses
      // Example: '/assets/images/background.jpg'
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
    const minLoadingTime = 2000; // Minimum time to show loader (2s)
    const maxLoadingTime = 5000; // Maximum time to show loader (5s)

    loadingInterval.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      let percentage: number;

      if (assetsLoaded.current) {
        // If assets are loaded, accelerate to 100%
        percentage = Math.min(Math.floor((elapsed / minLoadingTime) * 100), 100);
      } else if (elapsed > maxLoadingTime) {
        // If taking too long, force to 100%
        percentage = 100;
      } else {
        // Normal progression, but cap at 95% until assets are loaded
        percentage = Math.min(Math.floor((elapsed / maxLoadingTime) * 100), 95);
      }

      setLoadingPercentage(percentage);
      
      if (percentage >= 100) {
        if (loadingInterval.current) clearInterval(loadingInterval.current);
        setLoading(false);
        setTimeout(() => {
          setShowForm(true);
        }, 1000);
        onLoadingComplete();
      }
    }, 50);

    return () => {
      if (loadingInterval.current) clearInterval(loadingInterval.current);
    };
  }, [onLoadingComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userEmail', email);
    console.log('Email submitted:', email);
    setSubmitted(true);
  };

  return (
    <div className={`preloader ${!loading ? 'loaded' : ''}`}>
      <div className="grid-overlay"></div>
      <div className="preloader-content">
        <h1 className="godai-text">Godai</h1>
        
        <div className="loading-progress">
          <div className="loading-bar" style={{ width: `${loadingPercentage}%` }}></div>
        </div>
                <div className="loading-percentage">
          {loading ? `INITIALIZING... ${loadingPercentage}%` : 'COMPLETE'}
        </div>
        
        {showForm && !submitted && (
          <div className="email-form-container" style={{ animation: 'fadeIn 1.5s ease-out forwards' }}>
            <form onSubmit={handleSubmit} className="email-form">
              <h2>Get Early Access</h2>
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        )}
        
        {submitted && (
          <div className="thank-you-message" style={{ animation: 'fadeIn 1.5s ease-out forwards' }}>
            <h2>Thank You!</h2>
            <p>We'll notify you when early access becomes available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preloader;