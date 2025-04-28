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
    const [validationError, setValidationError] = useState('');
    const [loadingPercentage, setLoadingPercentage] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
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
      setLoading(false);
      setTimeout(() => {
        setShowForm(true);
      }, 1500); // Slight delay before form shows up
    }
  }, 50);

  return () => {
    if (loadingInterval.current) clearInterval(loadingInterval.current);
  };
}, []);


  // Transition after form submission and thank you message
  useEffect(() => {
    if (submitted) {
      // Show the thank you message for 3 seconds, then fade out
      const timer = setTimeout(() => {
        setFadeOut(true);
        
        // After fadeout animation, notify parent that loading is complete
        setTimeout(() => {
          onLoadingComplete();
        }, 1000);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [submitted, onLoadingComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom validation
    if (!email) {
      setValidationError('Please fill out this field.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    
    // Clear any previous validation errors
    setValidationError('');
    
    localStorage.setItem('userEmail', email);
    setSubmitted(true);
  };

  return (
    <div className={`preloader ${!loading ? 'loaded' : ''} ${fadeOut ? 'fade-out' : ''}`}>
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
          <div className="email-form-container">
            <form onSubmit={handleSubmit} className="email-form">
              <h2>Get Early Access</h2>
              <div className="form-group">
                <input
                  type="text" 
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  placeholder="Enter your email"
                  style={{ pointerEvents: 'auto' }}
                  autoFocus
                  aria-invalid={!!validationError}
                />
                {validationError && (
                  <div className="validation-message">
                    {validationError}
                  </div>
                )}
                <button 
                  type="submit"
                  style={{ pointerEvents: 'auto' }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
        
        {submitted && (
          <div className={`thank-you-message ${fadeOut ? 'fade-out' : ''}`}>
            <h2>Thank You!</h2>
            <p>We'll notify you when early access becomes available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preloader;