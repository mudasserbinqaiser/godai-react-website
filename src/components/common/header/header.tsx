import './header.css';
import { useState, useEffect } from 'react';

const Header = () => {
  const [activeLink, setActiveLink] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Function to handle scroll and update active link based on transition progress
  useEffect(() => {
    const handleProgressChange = () => {
      // Get the current progress from the ScrollProgressContext via window
      const transitionProgress = (window as any).currentTransitionProgress || 0;
      console.log(transitionProgress);
      
      if (isMobile) {
        // Mobile-specific progress mapping
        if (transitionProgress < 0.65) {
          // In Hero layer, no tab should be active
          setActiveLink('');
        } else if (transitionProgress >= 0.65 && transitionProgress < 1.9) {
          // In project layer, Godai Origins should be active
          setActiveLink('origins');
        } else if (transitionProgress >= 1.9 && transitionProgress < 2.9) {
          // In NFT section, Genesis Summoning should be active
          setActiveLink('genesis');
        } else if (transitionProgress >= 2.9 && transitionProgress < 3.9) {
          // In gaming section, Arena should be active
          setActiveLink('arena');
        } else if (transitionProgress >= 3.9 && transitionProgress < 4.9) {
          // In manga section, The Chronicles should be active
          setActiveLink('chronicles');
        } else if (transitionProgress >= 4.9 && transitionProgress < 5.8) {
          // In team section, Council should be active
          setActiveLink('council');
        } else {
          setActiveLink('');
        }

      } else {
        // Desktop progress mapping (unchanged)
        if (transitionProgress < 0.5) {
          // In Hero layer, no tab should be active
          setActiveLink('');
        } else if (transitionProgress >= 0.5 && transitionProgress < 2) {
          // In project layer, Godai Origins should be active
          setActiveLink('origins');
        } else if (transitionProgress >= 2 && transitionProgress < 2.9) {
          // In NFT section, Genesis Summoning should be active
          setActiveLink('genesis');
        } else if (transitionProgress >= 2.9 && transitionProgress < 3.8) {
          // In gaming section, Arena should be active
          setActiveLink('arena');
        } else if (transitionProgress >= 3.8 && transitionProgress < 4.8) {
          // In manga section, The Chronicles should be active
          setActiveLink('chronicles');
        } else if (transitionProgress >= 4.8 && transitionProgress < 5.8) {
          // In team section, Council should be active
          setActiveLink('council');
        } else {
          setActiveLink('');
        }
      }
    };

    // Create a custom event listener for progress updates
    window.addEventListener('godaiProgressUpdate', handleProgressChange);
    
    return () => {
      window.removeEventListener('godaiProgressUpdate', handleProgressChange);
    };
  }, [isMobile]); // Added isMobile as a dependency

  // Function to handle tab clicks and navigate to the corresponding layer
  const handleTabClick = (section: string) => {
    setActiveLink(section);
    
    // Set transition progress based on clicked section and device type
    let targetProgress = 0;
    
    if (isMobile) {
      // Mobile-specific target progress values
      switch (section) {
        case 'origins':
          targetProgress = 1.4;
          break;
        case 'genesis':
          targetProgress = 2.4;
          break;
        case 'arena':
          targetProgress = 3.4;
          break;
        case 'chronicles':
          targetProgress = 4.5;
          break;
        case 'council':
          targetProgress = 5.0;
          break;
        default:
          targetProgress = 0;
      }
    } else {
      // Desktop target progress values (unchanged)
      switch (section) {
        case 'origins':
          targetProgress = 1.52;
          break;
        case 'genesis':
          targetProgress = 2.3;
          break;
        case 'arena':
          targetProgress = 3.0;
          break;
        case 'chronicles':
          targetProgress = 4.5;
          break;
        case 'council':
          targetProgress = 5.5;
          break;
        default:
          targetProgress = 0;
      }
    }
    
    // Dispatch a custom event to notify Home component to update progress
    const event = new CustomEvent('godaiNavigate', { detail: { targetProgress } });
    window.dispatchEvent(event);
  };

  return (
    <nav className="navigation">
      <div className="header-outline"></div>
      <div className="nav-background"></div>
      
      <div className="nav-container">
        <div className="nav-links">
          <a 
            href="#origins"
            className={activeLink === 'origins' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('origins');
            }}
          >
            <span className="nav-text">Godai Origins</span>
            {isMobile && activeLink === 'origins' && <div className="mobile-active-indicator"></div>}
          </a>
          <a 
            href="#genesis"
            className={activeLink === 'genesis' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('genesis');
            }}
          >
            <span className="nav-text">Genesis Summoning</span>
            {isMobile && activeLink === 'genesis' && <div className="mobile-active-indicator"></div>}
          </a>
          <a 
            href="#arena"
            className={activeLink === 'arena' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('arena');
            }}
          >
            <span className="nav-text">Arena</span>
            {isMobile && activeLink === 'arena' && <div className="mobile-active-indicator"></div>}
          </a>
          <a 
            href="#chronicles"
            className={activeLink === 'chronicles' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('chronicles');
            }}
          >
            <span className="nav-text">The Chronicles</span>
            {isMobile && activeLink === 'chronicles' && <div className="mobile-active-indicator"></div>}
          </a>
          <a 
            href="#council"
            className={activeLink === 'council' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('council');
            }}
          >
            <span className="nav-text">Council</span>
            {isMobile && activeLink === 'council' && <div className="mobile-active-indicator"></div>}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;