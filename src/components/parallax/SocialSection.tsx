import React, { useEffect } from "react";
import "./SocialSection.css";
import "../parallax/ProjectSection.css";

const SocialSection: React.FC<{ progress: number }> = ({ progress }) => {
  // For smooth entrance animation
  const BUFFER = 0.4;
  const DELAY = 0.35;

  // Adjust progress for smoother transitions
  const adjustedProgress = Math.max(0, Math.min(1, (progress - DELAY) / (1 - DELAY)));

  // Updated smooth vertical movement calculation for both directions
  const calculateLayerY = (progress: number) => {
    if (progress < BUFFER) {
      // Smooth entry from bottom with cubic easing
      const t = progress / BUFFER;
      return window.innerHeight * (1 - t * t * t);
    }
    return 0;
  };

  // Calculate the vertical position
  const socialsLayerY = calculateLayerY(adjustedProgress);
  
  // Add the back-to-top button directly to the body for better mobile interaction
  useEffect(() => {
    // Create the button container
    const backToTopContainer = document.createElement('div');
    backToTopContainer.className = 'back-to-top-container';
    backToTopContainer.style.position = 'fixed';
    backToTopContainer.style.bottom = '40px';
    backToTopContainer.style.right = '40px';
    backToTopContainer.style.zIndex = '9999';
    
    // Create the button
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top-button';
    backToTopButton.ariaLabel = 'Back to top';
    
    // Button icon
    const backToTopIcon = document.createElement('div');
    backToTopIcon.className = 'back-to-top-icon';
    
    // Button text
    const backToTopText = document.createElement('span');
    backToTopText.textContent = '';
    
    // Append elements
    backToTopButton.appendChild(backToTopIcon);
    backToTopContainer.appendChild(backToTopButton);
    
    // Add click event listener
    backToTopButton.addEventListener('click', () => {
      // Reset the progress
      window.dispatchEvent(new CustomEvent('godaiResetProgress'));
      
      // Fallback scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Show button only when this section is visible
    if (adjustedProgress > 0.5) {
      // Add to document
      document.body.appendChild(backToTopContainer);
    }
    
    // Cleanup function
    return () => {
      if (document.body.contains(backToTopContainer)) {
        document.body.removeChild(backToTopContainer);
      }
    };
  }, [adjustedProgress]);

  return (
    <div
      className="socials-section-bg"
      style={{
        transform: `translateY(${socialsLayerY}px)`,
        opacity: adjustedProgress > 0 ? 1 : 0,
        pointerEvents: adjustedProgress > 0 ? "auto" : "none",
        zIndex: 15,
        transition: "transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1.000), opacity 0.6s ease-in-out",
      }}
    >
      {/* Video background with radial gradient overlay */}
      <div className="socials-video-container">
        <video
          className="socials-bg-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/assets/videos/socials.webm" type="video/webm" />
        </video>
        <div className="socials-radial-gradient"></div>
        <div className="socials-radial-gradient"></div>
      </div>

      {/* Center Banner Image */}
      <div className="socials-banner-wrapper">
        {/* Dark Center Blur */}
        <div className="socials-center-blur"></div>

        <img 
          src="/assets/images/socials_banner.png" 
          alt="Socials Banner"
          className="socials-banner-image"
        />
        <div className="socials-banner-text">
          <img 
          src="/assets/images/join.png" 
          alt="Join"
          className="socials-banner-image"
        />
        </div>

        {/* Social Buttons in the middle */}
        <div className="social-buttons-container">
          <a href="https://discord.gg/godai" target="_blank" rel="noopener noreferrer" className="social-button">
            <div className="social-button-icon icon-1"></div>
          </a>
          
          <a href="https://x.com/godai" target="_blank" rel="noopener noreferrer" className="social-button">
            <div className="social-button-icon icon-2"></div>
          </a>
          
          <a href="https://t.me/godai" target="_blank" rel="noopener noreferrer" className="social-button">
            <div className="social-button-icon icon-3"></div>
          </a>
        </div>

        <div className="signup-button-container">
          <img 
          src="/assets/images/signup.png" 
          alt="Signup"
          className="signup-button-image"
        />
        </div>
      </div>

      {/* Bottom blur gradient */}
      <div className="socials-blur-gradient"></div>

      {/* Social media links */}
      <div className="socials-content">
        <h2 className="socials-title">Connect With Us</h2>
        
        <div className="socials-links-container">
          <a href="https://discord.gg/godai" target="_blank" rel="noopener noreferrer" className="social-link">
            <div className="social-icon discord"></div>
            <span>Discord</span>
          </a>
          
          <a href="https://x.com/godai" target="_blank" rel="noopener noreferrer" className="social-link">
            <div className="social-icon x-twitter"></div>
            <span>X / Twitter</span>
          </a>
          
          <a href="https://t.me/godai" target="_blank" rel="noopener noreferrer" className="social-link">
            <div className="social-icon telegram"></div>
            <span>Telegram</span>
          </a>
          
          <a href="https://medium.com/godai" target="_blank" rel="noopener noreferrer" className="social-link">
            <div className="social-icon medium"></div>
            <span>Medium</span>
          </a>
        </div>
      </div>

      {/* Decorative lines */}
      <div className="project-lines">
        <div className="left-side">
          <div className="vector-8"></div>
          <div className="vector-9"></div>
        </div>
        <div className="right-side">
          <div className="vector-8"></div>
          <div className="vector-9"></div>
        </div>
        <div className="vertical-line v1"></div>
        <div className="vertical-line v2"></div>
        <div className="vertical-line v3"></div>
        <div className="vertical-line v4"></div>
        <div className="vertical-line v5"></div>
      </div>
    </div>
  );
};

export default SocialSection;