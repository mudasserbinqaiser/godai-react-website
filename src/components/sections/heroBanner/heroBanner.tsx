import { useEffect, useRef, useState } from 'react';
import './HeroBanner.css';

const HeroBanner = () => {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const secondVideoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setScrollY(window.scrollY);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Calculate character parallax based on scroll position
  const characterTranslateY = scrollY * 0.4; // Parallax effect for characters only
  
  // Calculate video opacity for smooth transition
  const firstVideoOpacity = Math.max(1 - scrollY * 0.002, 0);
  const secondVideoOpacity = Math.min(scrollY * 0.002, 1);
  
  return (
    <section className="hero-section" ref={heroRef}>
      {/* Figma Outline Elements */}
      <div className="hero-outline"></div>
      <div className="hero-rectangle-top"></div>
      <div className="hero-rectangle-bottom"></div>
      
      <div className="hero-content">
        {/* Video Background - Fixed position */}
        <div className="video-container">
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            loop 
            playsInline
            className="background-video"
            style={{ opacity: firstVideoOpacity }}
          >
            <source src="/assets/videos/hero-background.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Second video that fades in on scroll */}
          <video 
            ref={secondVideoRef}
            autoPlay 
            muted 
            loop 
            playsInline
            className="background-video second-video"
            style={{ opacity: secondVideoOpacity }}
          >
            <source src="/assets/videos/2.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
          
          {/* Top Blur Gradient */}
          <div className="blur-gradient-top"></div>
          
          {/* Bottom Blur Gradient */}
          <div className="blur-gradient-bottom"></div>
        </div>
        
        {/* Characters Image - With parallax */}
        <div className="hero-characters-container" style={{ transform: `translateY(${characterTranslateY}px)` }}>
          <img 
            src="/assets/images/hero-page-characters.png" 
            alt="Godai characters" 
            className="hero-characters-image" 
          />
        </div>

        {/* Bottom Blur Gradient */}
        <div className="blur-gradient-bottom-characters"></div>
        
        {/* Enter Godai Text */}
        <div className="enter-godai-container">
          <img src="/assets/images/enter-godai.png" alt="Enter Godai" className="enter-godai-image" />
        </div>
        
        {/* Lines and Decorative Elements */}
        <div className="decorative-elements">
          <div className="left-line"></div>
          <div className="right-line"></div>
          <div className="vertical-lines">
            <div className="v-line v-line-1"></div>
            <div className="v-line v-line-2"></div>
            <div className="v-line v-line-3"></div>
            <div className="v-line v-line-4"></div>
            <div className="v-line v-line-5"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;