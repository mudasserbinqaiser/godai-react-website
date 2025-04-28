import { useContext, useEffect, useState, useRef } from 'react';
import { ParallaxBanner } from 'react-scroll-parallax';
import Header from '../components/common/header/header';
import './Home.css';
import '../components/parallax/HeroParallax.css';
import '../components/parallax/ProjectSection.css';
import NftSection from '../components/parallax/NftSection';
import GamingSection from '../components/parallax/GamingSection';
import MangaSection from '../components/parallax/MangaSection';
import TeamSection from '../components/parallax/TeamSection';
import SocialSection from '../components/parallax/SocialSection';
import { ScrollProgressContext } from '../context/ScrollProgressContext';


const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const mobileStyles = `
  @media screen and (max-width: 768px) {
    .project-avatar {
      left: 50% !important;
      bottom: 50px !important;
    }
    
    .project-avatar img {
      max-height: 50vh !important;
      max-width: 90vw !important;
    }
  }

  @media screen and (max-width: 480px) {
    .project-avatar {
      width: 300px !important;
      transform: translate(-175px, -10px) !important;
    }
    
    .project-avatar img {
      max-height: 40vh !important;
    }
  }
`;

const Home = () => {
  const [transitionProgress, setTransitionProgress] = useState(0); // 0 = hero, 1 = project, 2 = NFT, 3 = gaming, 4 = manga, 5 = team, 6 = socials
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { setProgress } = useContext(ScrollProgressContext);
  const touchStartRef = useRef(0);
  const touchLastRef = useRef(0);
  const isScrollingRef = useRef(false);

  const MAX_PROGRESS = 6; // 0-1: vertical, 1-2: NFT, 2-3: gaming, 3-4: manga, 4-5: team, 5-6: socials
  
  // Constants for the "settle zone" - where project layer stays fixed
  const PROJECT_SETTLE_START = 1.0;  // Project is fully visible at 1.0
  const PROJECT_SETTLE_END = 1.25;   // Start transitioning to NFT after this threshold
  
  // Adjust progress for the settle zone
  const adjustedProgress = transitionProgress < PROJECT_SETTLE_START 
    ? transitionProgress 
    : transitionProgress < PROJECT_SETTLE_END 
      ? PROJECT_SETTLE_START 
      : PROJECT_SETTLE_START + (transitionProgress - PROJECT_SETTLE_END) * (MAX_PROGRESS - PROJECT_SETTLE_START) / (MAX_PROGRESS - PROJECT_SETTLE_END);

  // Update global progress for the progress bar
  useEffect(() => {
    // Normalize the progress value between 0 and 1
    setProgress(transitionProgress / MAX_PROGRESS);
  }, [transitionProgress, MAX_PROGRESS, setProgress]);

  // Character specific transforms
  const characterScale = isMobile 
  ? 1 - 200 * adjustedProgress    // Less aggressive scaling on mobile
  : 1 - 0.6 * adjustedProgress;

const characterY = isMobile 
  ? 60 * adjustedProgress         // Smaller vertical movement
  : 114 * adjustedProgress;

const characterX = isMobile 
  ? -100 * adjustedProgress       // Minimal horizontal shift
  : -445 * adjustedProgress;

  // Responsive card dimensions
  const CARD_WIDTH = isMobile ? 0 : 1050; // px
  const CARD_HEIGHT = isMobile ? 200 : 550; // px
  const FINAL_LEFT_POSITION = isMobile ? -80 : -200; // px from left
  const FINAL_BOTTOM_POSITION = isMobile ? -45 : -120;

  // Update the position calculations
  const minWidth = CARD_WIDTH;
  const minHeight = CARD_HEIGHT;
  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight;

  const width = minWidth + (maxWidth - minWidth) * (1 - adjustedProgress);
  const height = minHeight + (maxHeight - minHeight) * (1 - adjustedProgress);

  // Calculate left position (from center to bottom left)
  const left = `${FINAL_LEFT_POSITION * adjustedProgress}px`;

  // Calculate top position (from center to bottom)
  const top = `${(window.innerHeight - CARD_HEIGHT - FINAL_BOTTOM_POSITION) * adjustedProgress}px`;

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY / 400;  // Smooth and responsive

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setTransitionProgress(prev => clamp(prev + delta, 0, MAX_PROGRESS));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Touch event handlers for mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
      touchLastRef.current = e.touches[0].clientY;
      isScrollingRef.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrollingRef.current) return;
      
      const touchY = e.touches[0].clientY;
      const deltaY = touchLastRef.current - touchY;
      touchLastRef.current = touchY;
      
      // Use smaller multiplier for more natural touch scrolling feel
      const scrollMultiplier = 0.0025;
      setTransitionProgress(prev => clamp(prev + deltaY * scrollMultiplier, 0, MAX_PROGRESS));
    };

    const handleTouchEnd = () => {
      isScrollingRef.current = false;
    };

    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const calculateLayerProgress = (start: number, end: number) => {
  const rawProgress = (transitionProgress - start) / (end - start);
  return clamp(rawProgress, 0, 1);
};


  const nftLayerProgress = calculateLayerProgress(PROJECT_SETTLE_END, 2.25);
const gamingLayerProgress = calculateLayerProgress(1.7 , 2.7);
const mangaLayerProgress = calculateLayerProgress(2.2, 3.1);
const teamLayerProgress = calculateLayerProgress(2.65, 3.515);
  const socialLayerProgress = calculateLayerProgress(3.4, 4.0);




  // Fade out project elements only after the settle period
  const projectElementOpacity = 1 - Math.min(nftLayerProgress * 3, 1);

  // Project avatar fade only (no scale/rotate)
  const avatarFade = projectElementOpacity;


  return (
    <>
      <style>{mobileStyles}</style>
      <Header />
      <div
        className="enter-godai-container"
        style={{
          opacity: adjustedProgress < 0.8 ? 1 - adjustedProgress / 0.8 : 0,
          transform: isMobile ? 'none' : `scale(${1 - 0.3 * adjustedProgress})`,
          transition: 'opacity 0.2s linear, transform 0.2s linear',
          zIndex: 999,
          position: isMobile ? 'fixed' : 'absolute',
          top: isMobile ? '70%' : 'auto',
          bottom: isMobile ? 'auto' : 0
        }}
      >
        <img 
          src="/assets/images/enter-godai.png" 
          alt="Enter Godai" 
          className="enter-godai-image" 
        />
      </div>

      <div 
        className="blur-gradient-bottom-characters"
        style={{
          opacity: 1 - adjustedProgress,
          zIndex: 5
        }}
      ></div>
      <div className="single-section-container" style={{ 
        position: 'relative', 
        width: '100vw', 
        height: '100vh', 
        overflow:'hidden'
      }}>
        {/* Separate Character Layer */}
        <div 
          className="hero-characters-container"
          style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            zIndex: 4,
            pointerEvents: 'none',
            transform: `translate(${characterX}px, ${characterY}px) scale(${characterScale})`,
            transition: 'transform 0.2s ease-out'
          }}
        >
          <img
            src="/assets/images/hero-page-characters.png"
            alt="Godai characters"
            className="hero-characters-image"
            style={{
              position: 'relative',
              width: '58%',
              height: 'auto',
              transform: 'translateY(15%)',
              objectFit: 'contain',
              transformOrigin: 'center bottom'
            }}
          />
        </div>

        {/* Hero Layer */}
        <div
          className="hero-layer"
          style={{
            position: 'absolute',
            left,
            top,
            width,
            height,
            zIndex: 3,
            pointerEvents: 'none',
            transform: `scale(${1 - 0.6 * adjustedProgress})`,
            opacity: 1,
            transition: 'width 0.2s linear, height 0.2s linear, left 0.2s linear, top 0.2s linear, transform 0.05s linear',
            willChange: 'width, height, left, top, transform'
          }}
        >
          {/* Orange border */}
          <div
            className="hero-orange-border"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              border: '7px solid #D94B18',
              borderRadius: 0,
              pointerEvents: 'none',
              boxSizing: 'border-box',
              opacity: adjustedProgress > 0 ? 1 : 0,
              zIndex: 2,
              display: isMobile ? 'none' : 'block',
              transition: 'opacity 0.2s linear'
            }}
          />

          {/* Card background and image: always visible */}
          <ParallaxBanner
            style={{ height: '100%' }}
            layers={[
              {
                speed: -15,
                expanded: false,
                children: (
                  <div className="video-container" style={{ overflow:'hidden' }}>
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="background-video"
                    >
                      <source src="/assets/videos/hero-background.webm" type="video/webm" />
                    </video>
                  </div>
                )
              },
              {
                speed: -10,
                expanded: false,
                children: (
                  <div className="hero-content">
                    {/* Hero Decorative Lines */}
                    <div className="project-lines" style={{ opacity: 1 - adjustedProgress }}>
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
                )
              }
            ]}
            className="parallax-banner"
          />
        </div>

        {/* Project Layer */}
        <div
          className="project-layer"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none',
            opacity: clamp((adjustedProgress - 0.1) * 1.2, 0, 1),
            transform: `scale(${0.9 + 0.1 * adjustedProgress})`,
            transition: 'opacity 0.2s linear, transform 0.2s linear',
            willChange: 'opacity, transform'
          }}
        >
          <ParallaxBanner
            style={{ height: '100%' }}
            layers={[
              {
                speed: -15,
                expanded: false,
                children: (
                  <div className="video-container" style={{ opacity: 1, transition: 'opacity 0.4s' }}>
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="background-video"
                      style={{ opacity: 1 }}
                    >
                      <source src="/assets/videos/2.webm" type="video/webm" />
                    </video>
                  </div>
                )
              },
              {
                speed: -10,
                children: (
                  <>
                    <div className="project-outline" style={{ opacity: projectElementOpacity, transition: 'opacity 0.2s' }}></div>
                    <div className="project-blur-gradient" style={{ opacity: projectElementOpacity, transition: 'opacity 0.2s' }}></div>
                    <div className="project-lines" style={{ opacity: projectElementOpacity, transition: 'opacity 0.2s' }}>
                      <div className="left-side">
                        <div className="vector-8"></div>
                        <div className="vector-9"></div>
                      </div>
                      <div className="right-side">
                        <div className="vector-8"></div>
                        <div className="vector-9"></div>
                      </div>
                      <div className="vertical-line v1" style={{ transform: `translateY(${adjustedProgress * 5}px)` }}></div>
                      <div className="vertical-line v2" style={{ transform: `translateY(${adjustedProgress * 10}px)` }}></div>
                      <div className="vertical-line v3" style={{ transform: `translateY(${adjustedProgress * 15}px)` }}></div>
                      <div className="vertical-line v4" style={{ transform: `translateY(${adjustedProgress * 10}px)` }}></div>
                      <div className="vertical-line v5" style={{ transform: `translateY(${adjustedProgress * 5}px)` }}></div>
                    </div>
                  </>
                )
              },
              {
                speed: -7,
                children: (
                  <>
                    {/* Project Avatar with fade only */}
                    <div 
                      className="project-avatar"
                      style={{
                        position: 'absolute',
                        bottom: `${adjustedProgress * (isMobile ? 50 : 65)}px`,
                        left: isMobile ? '50%' : '55%',
                        transform: `
                          translate(-50%, ${isMobile 
                          ? ( (1 - adjustedProgress) * 40 ) 
                          : ( (1 - adjustedProgress) * -50 ) }%)
                          rotateY(${180 * (1 - adjustedProgress)}deg)
                          scale(${0.4 + (adjustedProgress * (isMobile ? 0.8 : 0.6))})
                        `,
                        transformOrigin: 'center bottom',
                        zIndex: 5,
                        opacity: avatarFade,
                        perspective: '1000px',
                        transition: 'opacity 0.2s, transform 0.3s ease-out, bottom 0.3s ease-out'
                      }}
                    >
                      <img 
                        src="/assets/images/2.png" 
                        alt="Character Avatar"
                        style={{
                          height: 'auto',
                          maxHeight: isMobile ? '50vh' : '90vh',
                          width: 'auto',
                          maxWidth: isMobile ? '90vw' : 'auto',
                          backfaceVisibility: 'hidden'
                        }}
                      />
                    </div>

                    {/* Project Description */}
                    <div
                      className="project-description"
                      style={{
                        transform: `translateY(${adjustedProgress * 10}px)`,
                        opacity: projectElementOpacity,
                        transition: 'opacity 0.2s'
                      }}
                    >
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                      when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </div>
                  </>
                )
              }
            ]}
          />
        </div>
        
        {/* NFT Layer */}
        {nftLayerProgress > 0 && (
          <NftSection progress={nftLayerProgress} />
        )}
        
        {/* Gaming Layer */}
        {gamingLayerProgress > 0 && (
          <GamingSection progress={gamingLayerProgress} />
        )}

        {/* Manga Layer */}
        {mangaLayerProgress > 0 && (
          <MangaSection progress={mangaLayerProgress} />
        )}

        {/* Team Layer */}
        {teamLayerProgress > 0 && (
          <TeamSection progress={teamLayerProgress} />
        )}

         {/* Socials Layer */}
        {socialLayerProgress > 0 && (
          <SocialSection progress={socialLayerProgress} />
        )}
      </div>
    </>
  );
};

export default Home;