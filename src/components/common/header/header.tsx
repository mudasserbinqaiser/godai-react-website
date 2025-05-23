import './header.css';
import { useState, useEffect } from 'react';

const Header = () => {
  const [activeLink, setActiveLink] = useState('project');

  // Function to handle scroll and update active link based on transition progress
  useEffect(() => {
    const handleProgressChange = () => {
      // Get the current progress from the ScrollProgressContext via window
      const transitionProgress = (window as any).currentTransitionProgress || 0;
      
      // Map progress ranges to sections
      if (transitionProgress < 1.5) {
        setActiveLink('project');
      } else if (transitionProgress >= 1.5 && transitionProgress < 2.9) {
        setActiveLink('keep');
      } else if (transitionProgress >= 2.9 && transitionProgress < 4.5) {
        setActiveLink('factions');
      } else if (transitionProgress >= 4.5) {
        setActiveLink('world');
      }
    };

    // Create a custom event listener for progress updates
    window.addEventListener('godaiProgressUpdate', handleProgressChange);
    
    return () => {
      window.removeEventListener('godaiProgressUpdate', handleProgressChange);
    };
  }, []);

  // Function to handle tab clicks and navigate to the corresponding layer
  const handleTabClick = (section: string) => {
    setActiveLink(section);
    
    // Set transition progress based on clicked section
    let targetProgress = 0;
    switch (section) {
      case 'project':
        targetProgress = 1.0;
        break;
      case 'keep': // NFT section
        targetProgress = 2.0;
        break;
      case 'factions': // Gaming/Manga sections
        targetProgress = 3.5;
        break;
      case 'world': // Team/Social sections
        targetProgress = 5.0;
        break;
      default:
        targetProgress = 0;
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
            href="#project"
            className={activeLink === 'project' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('project');
            }}
          >
            Project
          </a>
          <a 
            href="#keep"
            className={activeLink === 'keep' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('keep');
            }}
          >
            The Keep
          </a>
          <a 
            href="#factions"
            className={activeLink === 'factions' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('factions');
            }}
          >
            Factions
          </a>
          <a 
            href="#world"
            className={activeLink === 'world' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('world');
            }}
          >
            The World
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;