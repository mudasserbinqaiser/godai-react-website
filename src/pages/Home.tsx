import { useEffect, useState } from 'react';
import { ParallaxBanner } from 'react-scroll-parallax';
import Header from '../components/common/header/header';
import './Home.css';
import '../components/parallax/HeroParallax.css';
import '../components/parallax/ProjectSection.css';
import NftCarousel from '../components/parallax/NftCarousel';
import GamingSection from '../components/parallax/GamingSection';

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
      bottom: 30px !important;
    }
    
    .project-avatar img {
      max-height: 40vh !important;
    }
  }
`;

const Home = () => {
  const [transitionProgress, setTransitionProgress] = useState(0); // 0 = hero, 1 = project, 2 = NFT, 3 = gaming
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Derived transforms
  const heroScale = 1 - 0.6 * transitionProgress;
  const heroX = -window.innerWidth * 0.25 * transitionProgress;
  const heroY = window.innerHeight * 0.25 * transitionProgress;

  // Character specific transforms
  const characterScale = 1 - 0.6 * transitionProgress;
  const characterY = 114 * transitionProgress;
  const characterX = -445 * transitionProgress;

  // Responsive card dimensions
  const CARD_WIDTH = isMobile ? 300 : 1050; // px
  const CARD_HEIGHT = isMobile ? 200 : 550; // px
  const FINAL_LEFT_POSITION = isMobile ? -80 : -200; // px from left
  const FINAL_BOTTOM_POSITION = isMobile ? -45 : -120;

  // Update the position calculations
  const minWidth = CARD_WIDTH;
  const minHeight = CARD_HEIGHT;
  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight;

  const width = minWidth + (maxWidth - minWidth) * (1 - transitionProgress);
  const height = minHeight + (maxHeight - minHeight) * (1 - transitionProgress);

  // Calculate left position (from center to bottom left)
  const left = `${FINAL_LEFT_POSITION * transitionProgress}px`;

  // Calculate top position (from center to bottom)
  const top = `${(window.innerHeight - CARD_HEIGHT - FINAL_BOTTOM_POSITION) * transitionProgress}px`;

  const MAX_PROGRESS = 3; // 0-1: vertical, 1-2: NFT, 2-3: gaming

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

  // Calculate horizontal parallax for NFT layer
  const nftLayerProgress = clamp(transitionProgress - 1, 0, 1);

  // Calculate horizontal parallax for Gaming layer
  const gamingLayerProgress = clamp(transitionProgress - 2, 0, 1);

  // Fade out project elements quickly as we enter NFT layer (opacity only, no scale)
  const projectElementOpacity = 1 - Math.min(nftLayerProgress * 3, 1); // fades out even faster

  // Project avatar fade only (no scale/rotate)
  const avatarFade = projectElementOpacity;

  const BUFFER = 0.2; // 20% buffer

  // NFT layer progress for sliding out (0: fully visible, 1: fully out)
  const nftOutProgress = clamp((gamingLayerProgress - (1 - BUFFER)) / BUFFER, 0, 1);

  // NFT layer X: stays at 0 until buffer, then slides out
  const nftLayerTotalX =
    (1 - nftLayerProgress) * window.innerWidth
    - nftOutProgress * window.innerWidth;

  return (
    <>
      <style>{mobileStyles}</style>
      <Header />
      <div
        className="enter-godai-container"
        style={{
          opacity: transitionProgress < 0.8 ? 1 - transitionProgress / 0.8 : 0,
          transform: `scale(${1 - 0.3 * transitionProgress})`,
          transition: 'opacity 0.2s linear, transform 0.2s linear',
          zIndex: 14
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
          opacity: 1 - transitionProgress,
          zIndex: 13
        }}
      ></div>
      <div className="single-section-container" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
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
              width: '61%',
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
            transform: `scale(${1 - 0.6 * transitionProgress})`,
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
              opacity: transitionProgress > 0 ? 1 : 0,
              zIndex: 2,
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
                  <div className="video-container" style={{ overflow: 'hidden' }}>
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
                    <div className="project-lines" style={{ opacity: 1 - transitionProgress }}>
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
            opacity: clamp((transitionProgress - 0.1) * 1.2, 0, 1),
            transform: `scale(${0.9 + 0.1 * transitionProgress})`,
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
                      <div className="vertical-line v1" style={{ transform: `translateY(${transitionProgress * 5}px)` }}></div>
                      <div className="vertical-line v2" style={{ transform: `translateY(${transitionProgress * 10}px)` }}></div>
                      <div className="vertical-line v3" style={{ transform: `translateY(${transitionProgress * 15}px)` }}></div>
                      <div className="vertical-line v4" style={{ transform: `translateY(${transitionProgress * 10}px)` }}></div>
                      <div className="vertical-line v5" style={{ transform: `translateY(${transitionProgress * 5}px)` }}></div>
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
                        bottom: `${transitionProgress * (isMobile ? 50 : 65)}px`,
                        left: isMobile ? '50%' : '55%',
                        transform: `
                          translate(-50%, ${(1 - transitionProgress) * -50}%)
                          rotateY(${180 * (1 - transitionProgress)}deg)
                          scale(${0.4 + (transitionProgress * (isMobile ? 0.4 : 0.6))})
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
                        transform: `translateY(${transitionProgress * 10}px)`,
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
          <div
            className="nft-layer"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: 3,
              pointerEvents: 'auto',
              opacity: nftLayerProgress > 0 ? 1 : 0,
              transform: `translateX(${nftLayerTotalX}px)`,
              transition: 'opacity 0.4s cubic-bezier(.68,-0.55,.27,1.55), transform 0.7s cubic-bezier(.68,-0.55,.27,1.55)',
              background: '#071726',
              display: nftLayerProgress > 0 ? 'block' : 'none',
            }}
          >
            <NftCarousel />
          </div>
        )}
        {/* Gaming Layer */}
        {gamingLayerProgress > 0 && (
          <GamingSection progress={gamingLayerProgress} />
        )}
      </div>
    </>
  );
};

export default Home;