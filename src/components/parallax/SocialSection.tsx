import React from "react";
import "./SocialSection.css";
import "../parallax/ProjectSection.css";

const SocialSection: React.FC<{ progress: number }> = ({ progress }) => {
  // For smooth entrance animation
  const BUFFER = 0.4;

  // Adjust progress for smoother transitions
  const adjustedProgress = Math.max(0, Math.min(1, progress / (1 - BUFFER)));

  // New smooth vertical movement calculation
  const calculateLayerY = (progress: number) => {
    if (progress < BUFFER) {
      // Smooth entry from bottom with cubic easing
      const t = progress / BUFFER;
      // Using t * t * t for even smoother vertical motion
      return window.innerHeight * (1 - t * t * t);
    }
    return 0;
  };

  // Calculate the vertical position
  const socialsLayerY = calculateLayerY(adjustedProgress);


  return (
    <div
      className="socials-section-bg"
      style={{
        transform: `translateY(${socialsLayerY}px)`,
        opacity: adjustedProgress > 0 ? 1 : 0,
        pointerEvents: adjustedProgress > 0 ? "auto" : "none",
        zIndex: 15,
        transition: "transform 1s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.4s ease-in-out", // Updated transition
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