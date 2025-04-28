import React, { useState, useEffect, useRef } from "react";
import "./TeamSection.css";
import "../parallax/ProjectSection.css";

// Team member data
const teamMembers = [
  {
    name: "Drogo",
    role: "Business Development Manager",
    image: "/assets/images/nft5.png",
    xLink: "https://x.com/DrogoEth"
  },
  {
    name: "Luluchiru",
    role: "Lead Artist",
    image: "/assets/images/nft2.png",
    xLink: "https://x.com/luluchiru"
  },
  {
    name: "Clouds",
    role: "Community Lead",
    image: "/assets/images/nft3.png",
    xLink: "https://x.com/altrdcl0ud"
  },
  {
    name: "Vlad",
    role: "Game Development",
    image: "/assets/images/nft1.png",
    xLink: null
  },
  {
    name: "Snowyi",
    role: "Market",
    image: "/assets/images/nft4.png",
    xLink: "https://x.com/_snowyi"
  },
  {
    name: "Shine",
    role: "Community Manager",
    image: "/assets/images/nft6.png",
    xLink: "https://x.com/Shinemoore1"
  }
];

const TEAM_PLACEHOLDER_TEXT = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...`;

const BUFFER = 0.3;
const DELAY = 0.3;
const THUMBNAIL_HEIGHT = 106.52; // Height of each thumbnail
const THUMBNAIL_GAP = 20; // Gap between thumbnails
const MOBILE_THUMBNAIL_HEIGHT = 80; // Smaller height for mobile
const MOBILE_THUMBNAIL_GAP = 15; // Smaller gap for mobile

const TeamSection: React.FC<{ progress: number }> = ({ progress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Real-time scroll progress with DELAY
  const adjustedProgress = Math.max(0, Math.min(1, (progress - DELAY) / (1 - DELAY)));

  // Real-time horizontal shift (no snapping/jumping)
  let teamLayerX = 0;
  let teamLayerY = 0;
  
  if (adjustedProgress < BUFFER) {
    teamLayerX = (1 - adjustedProgress / BUFFER) * window.innerWidth;
  } else if (adjustedProgress > 1 - BUFFER) {
    // teamLayerY = -((adjustedProgress - (1 - BUFFER)) / BUFFER) * window.innerHeight;
  }

  const zoom = 1 + adjustedProgress * 0.08;

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % teamMembers.length);
    }, 3000);  // Change every 3 seconds
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? teamMembers.length - 1 : prevIndex - 1
    );
    
    startAutoSlide();  // Reset timer
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setActiveIndex((prevIndex) => 
      (prevIndex + 1) % teamMembers.length
    );
    
    startAutoSlide();  // Reset timer
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleThumbnailClick = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    
    setActiveIndex(index);
    startAutoSlide();  // Reset timer
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleOpenXLink = () => {
    const currentMember = teamMembers[activeIndex];
    if (currentMember.xLink) {
      window.open(currentMember.xLink, "_blank");
    }
  };

  // Calculate the vertical offset for the thumbnails container
  const calculateOffset = () => {
    const thumbnailHeight = isMobile ? MOBILE_THUMBNAIL_HEIGHT : THUMBNAIL_HEIGHT;
    const thumbnailGap = isMobile ? MOBILE_THUMBNAIL_GAP : THUMBNAIL_GAP;
    
    // For first and last items, we need special handling
    if (activeIndex === 0) {
      return 0; // At the top, no offset
    } else if (activeIndex === teamMembers.length - 1) {
      // At the bottom, show the last 4 items
      return -((teamMembers.length - 4) * (thumbnailHeight + thumbnailGap));
    } else {
      // Center the active thumbnail (subtract 1 to center second item)
      return -((activeIndex - 1) * (thumbnailHeight + thumbnailGap));
    }
  };

  return (
    <div
      className="team-section-bg"
      style={{
        transform: `translateX(${teamLayerX}px) translateY(${teamLayerY}px) scale(${zoom})`,
        opacity: adjustedProgress > 0 ? 1 : 0,
        pointerEvents: adjustedProgress > 0 ? "auto" : "none",
        zIndex: 12,
        transition: "transform 0.1s linear, opacity 0.2s ease-out",
      }}
    >
      {/* Video background */}
      <video
        className="team-bg-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/assets/videos/nft.webm" type="video/webm" />
      </video>

      {/* Decorative elements */}
      <div className="team-blur-gradient"></div>

      {/* Main content container - for easier mobile layout */}
      <div className="team-content-wrapper">
        {/* Team member name and role */}
        <div className="team-info">
          <h2 className="team-name">{teamMembers[activeIndex].name}</h2>
          <p className="team-description-header">{teamMembers[activeIndex].role}</p>
        </div>

        {/* Main team member display */}
        <div className="team-member-display">
          <div className="svg-wrapper">
            <svg width="300" height="413" viewBox="0 0 315 413" xmlns="http://www.w3.org/2000/svg">
              <mask id="path-1-outside" maskUnits="userSpaceOnUse" x="-1" y="-0.2" width="316" height="413" fill="black">
                <rect fill="white" x="-1" y="-0.2" width="316" height="413"/>
                <path d="M311 20.06V378.92L277.11 408.61H4.01V4.76H296.85L311 20.06Z"/>
              </mask>
              <path d="M311 20.06H315V378.92H311L277.11 408.61H4.01V4.76H296.85L311 20.06Z" fill="none" stroke="#D94B18" strokeWidth="7" mask="url(#path-1-outside)" />
              
              {/* Place the image inside the frame */}
              <foreignObject x="8" y="8" width="299" height="397">
                <img 
                  src={teamMembers[activeIndex].image} 
                  alt={teamMembers[activeIndex].name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'opacity 0.3s ease-out' 
                  }}
                />
              </foreignObject>
            </svg>
          </div>
        </div>

        {/* Vertical slider */}
        <div className="team-vertical-slider">
          <button 
            className="team-arrow up-arrow" 
            onClick={handlePrev}
            disabled={isAnimating}
            aria-label="Previous team member"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 15L12 9L6 15" stroke="#D94B18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="team-thumbnails-viewport">
            <div 
              className="team-thumbnails-container"
              style={{
                transform: `translateY(${calculateOffset()}px)`,
                transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)'
              }}
            >
              {teamMembers.map((member, index) => {
                // Calculate the distance from active index for opacity
                const distance = Math.abs(index - activeIndex);
                const opacity = distance <= 1 ? 1 : distance === 2 ? 0.5 : 0.3;
                
                return (
                  <div 
                    key={index}
                    className={`team-thumbnail ${index === activeIndex ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                    style={{
                      opacity,
                      transform: `scale(${index === activeIndex ? 1.05 : 0.95})`,
                      transition: 'opacity 0.3s ease, transform 0.3s ease'
                    }}
                  >
                    <img src={member.image} alt={member.name} />
                  </div>
                );
              })}
            </div>
          </div>
          
          <button 
            className="team-arrow down-arrow" 
            onClick={handleNext}
            disabled={isAnimating}
            aria-label="Next team member"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="#D94B18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Mobile horizontal slider dots */}
        <div className="team-mobile-dots">
          {teamMembers.map((_, index) => (
            <div 
              key={index} 
              className={`team-mobile-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
            ></div>
          ))}
        </div>

        {/* X Account link */}
        <div className="x-account-link" onClick={handleOpenXLink}>
          <div className="x-line"></div>
          <div className={`x-button ${!teamMembers[activeIndex].xLink ? 'disabled' : ''}`}>
            <svg width="19" height="20" viewBox="0 0 19 20" fill="none">
              <path d="M11.5 8.5L19 0H17.3L10.8 7.4L5.5 0H0L8 11.2L0 20H1.7L8.7 12.1L14.3 20H19.8L11.5 8.5ZM9.6 11L8.8 9.9L2.4 1.5H4.7L9.9 8.4L10.7 9.5L17.5 18.4H15.2L9.6 11Z" fill="#F3EDE0"/>
            </svg>
          </div>
        </div>

        {/* Description */}
        <div className="team-description">
          {TEAM_PLACEHOLDER_TEXT}
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

export default TeamSection;