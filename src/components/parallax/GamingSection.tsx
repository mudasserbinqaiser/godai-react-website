import React, { useState, useEffect, useRef } from "react";
import Div100vh from "react-div-100vh";
import "./GamingSection.css";

const gamingItems = [
  { icon: "/assets/images/gaming.png", title: "Blackout", description: "Lorem Ipsum has been the placeholder text of the printing industry, widely used since the 1500s when an anonymous printer scrambled type to create a specimen book." },
  { icon: "/assets/images/gaming.png", title: "Blackout", description: "For centuries, Lorem Ipsum has served as standard dummy text in typesetting, originating in the 1500s when a printer used it to fill pages with nonsensical content." },
  { icon: "/assets/images/gaming.png", title: "Blackout", description: "Since the 16th century, Lorem Ipsum has been the go-to filler text for printers and designers, ever since an unknown printer crafted it from scrambled Latin." },
  { icon: "/assets/images/gaming.png", title: "Blackout", description: "Lorem Ipsum, the classic dummy text, has been used by the printing industry since the 1500s, when a printer created it to showcase typefaces without distraction." },
  { icon: "/assets/images/gaming.png", title: "Blackout", description: "Dating back to the 1500s, Lorem Ipsum has remained the industry standard for placeholder text, born when a printer jumbled Latin words to produce sample layouts." },
];

const V_ANGLES = [0, 0, 0, 0, 0];
const V_OFFSETS = [168, 68, -48, -158, -258];
const X_OFFSETS = [120, 60, 0, 60, 120];
const MOBILE_X_OFFSETS = [-160, -80, 0, 80, 160];
const MOBILE_Y_OFFSETS = [100, 50, 0, 50, 100]; // Creating a V shape vertically
const BUFFER = 0.4;
const DELAY = 0.35;

// Function to detect iOS Safari
const isIOSSafari = () => {
  const ua = window.navigator.userAgent;
  const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
  const webkit = !!ua.match(/WebKit/i);
  return iOS && webkit && !ua.match(/CriOS/i) && !ua.match(/OPiOS/i);
};

const GamingSection: React.FC<{ progress: number }> = ({ progress }) => {
  const [centerIdx, setCenterIdx] = useState(2);
  const intervalRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsIOS(isIOSSafari());
  }, []);

  // Real-time scroll progress with DELAY
  const adjustedProgress = Math.max(0, Math.min(1, (progress - DELAY) / (1 - DELAY)));

  const calculateLayerX = (progress: number) => {
    if (progress < BUFFER) {
      // Smooth entry with quadratic easing
      // t goes from 0 to 1 as progress goes from 0 to BUFFER
      const t = progress / BUFFER;
      // t * t creates a smoother acceleration at the start
      return window.innerWidth * (1 - t * t);
    }
    // else if (progress > 1 - BUFFER) {
    //   // Smooth exit with quadratic easing
    //   // t goes from 0 to 1 as progress goes from (1-BUFFER) to 1
    //   const t = (progress - (1 - BUFFER)) / BUFFER;
    //   // t * t creates a smoother acceleration at the start of the exit
    //   return -(window.innerWidth * (t * t));
    // }
    return 0;
  };

  const gamingLayerX = calculateLayerX(adjustedProgress);

  const zoom = 1 + adjustedProgress * 0.08;

  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setCenterIdx((prev) => (prev + 1) % gamingItems.length);
    }, 3000);
  };
  
  // Auto-advance
  useEffect(() => {
    if (progress > 0) startAutoSlide();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line
  }, []);

  // Handle touch events for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swiping) return;
    
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next slide
        setCenterIdx((prev) => (prev + 1) % gamingItems.length);
      } else {
        // Swipe right - previous slide
        setCenterIdx((prev) => (prev - 1 + gamingItems.length) % gamingItems.length);
      }
      setSwiping(false);
    }
  };

  const handleTouchEnd = () => {
    setSwiping(false);
  };

  // For V formation on desktop, horizontal+vertical V on mobile
  const getCardProps = (i: number) => {
    const total = gamingItems.length;
    let offset = (i - centerIdx + total) % total;
    if (offset > total / 2) offset -= total;
    
    // On desktop, show 5 cards in V formation
    if (!isMobile && Math.abs(offset) > 2) return { visible: false };
    
    // On mobile, show all in a 2D V formation
    if (isMobile && Math.abs(offset) > 2) return { visible: false };

    const angle = isMobile ? 0 : V_ANGLES[offset + 2];
    
    // Use vertical Y offsets for mobile V shape
    const y = isMobile 
      ? MOBILE_Y_OFFSETS[offset + 2] 
      : V_OFFSETS[offset + 2];
      
    const x = isMobile 
      ? MOBILE_X_OFFSETS[offset + 2]
      : X_OFFSETS[offset + 2];
      
    const isCenter = offset === 0;
    const opacity = isMobile ? (isCenter ? 1 : 0.7) : 1;
    const scale = isMobile ? (isCenter ? 1 : 0.8) : 1;

    return {
      visible: true,
      angle,
      x,
      y,
      isCenter,
      opacity,
      scale,
      z: 10 - Math.abs(offset),
    };
  };

  return (
    <Div100vh
      className="gaming-carousel-bg"
      style={{
        position: "absolute",
        width: "100vw",
        top: 0,
        left: 0,
        background: "transparent",
        zIndex: 11,
        transform: `translateX(${gamingLayerX}px) scale(${zoom})`,
        opacity: progress > 0 ? 1 : 0,
        pointerEvents: progress > 0 ? "auto" : "none",
        transition: "transform 1s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.4s ease-in-out",
      }}
    >
      {/* Video background always rendered with improved sizing */}
      <video
        className="gaming-bg-video"
        src="/assets/videos/gaming.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* Only render the rest if visible */}
      {progress > 0.01 && (
        <>
          <div className="gaming-blur-gradient" style={{ zIndex: 1 }}></div>
          {!isMobile && (
            <div className="project-lines" style={{ zIndex: 2 }}>
              {/* <div className="left-side">
                <div className="vector-8"></div>
                <div className="vector-9"></div>
              </div> */}
              {/* <div className="right-side">
                <div className="vector-8"></div>
                <div className="vector-9"></div>
              </div> */}
              <div className="vertical-line v1"></div>
              <div className="vertical-line v2"></div>
              <div className="vertical-line v3"></div>
              <div className="vertical-line v4"></div>
              <div className="vertical-line v5"></div>
            </div>
          )}
          <div 
            className="gaming-carousel" 
            ref={carouselRef} 
            style={{ zIndex: 3 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="mobile-gaming-slider">
              {gamingItems.map((item, i) => {
                const { visible, angle, x, y, isCenter, z, opacity, scale } = getCardProps(i);
                if (!visible) return null;
                return (
                  <div
                    key={i}
                    className={`gaming-card${isCenter ? " center" : ""}`}
                    style={{
                      zIndex: z,
                      display: "none",
                      opacity: opacity,
                      transform: isMobile 
                        ? `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) scale(${scale})`
                        : `translateY(${y}px) translateX(${x}px) rotate(${angle}deg)`,
                      transition: "all 0.4s cubic-bezier(.68,-0.55,.27,1.55)",
                    }}
                    onClick={() => !isCenter && setCenterIdx(i)}
                  >
                    <div className="gaming-card-svg-wrapper">
                      {isCenter && (
                        <svg
                          className="hex-glow"
                          width={isMobile ? "120" : "200"}
                          height={isMobile ? "120" : "200"}
                          viewBox="0 0 143 158"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            position: "absolute",
                            top: "-2px",
                            left: "-1px",
                            pointerEvents: "none",
                            zIndex: 10,
                          }}
                        >
                          <g filter="url(#filter0_dddddd_1_460)">
                            <path
                              d="M68.9619 17.085C70.562 16.3052 72.438 16.3052 74.0381 17.085L74.377 17.2637L74.3809 17.2666L123.617 45.6387V45.6396L123.943 45.8418C125.534 46.9054 126.5 48.6983 126.5 50.627V107.373C126.5 109.43 125.4 111.332 123.617 112.36V112.361L74.3809 140.733L74.377 140.736C72.5965 141.755 70.4035 141.755 68.623 140.736L68.6191 140.733L19.3828 112.361V112.36C17.5997 111.332 16.5001 109.43 16.5 107.373V50.627C16.5001 48.5698 17.5997 46.6677 19.3828 45.6396V45.6387L68.6191 17.2666L68.623 17.2637L68.9619 17.085Z"
                              stroke="#FF991C"
                              strokeWidth="3"
                            />
                          </g>
                          <defs>
                            <filter id="filter0_dddddd_1_460" x="0.242824" y="0.242824" width="142.514" height="157.514" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                              <feOffset/>
                              <feGaussianBlur stdDeviation="0.175681"/>
                              <feColorMatrix type="matrix" values="0 0 0 0 0.85098 0 0 0 0 0.294118 0 0 0 0 0.0941176 0 0 0 1 0"/>
                              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_460"/>
                              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                              <feOffset/>
                              <feGaussianBlur stdDeviation="0.351361"/>
                              <feColorMatrix type="matrix" values="0 0 0 0 0.85098 0 0 0 0 0.294118 0 0 0 0 0.0941176 0 0 0 1 0"/>
                              <feBlend mode="normal" in2="effect1_dropShadow_1_460" result="effect2_dropShadow_1_460"/>
                              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                              <feOffset/>
                              <feGaussianBlur stdDeviation="1.22976"/>
                              <feColorMatrix type="matrix" values="0 0 0 0 0.85098 0 0 0 0 0.294118 0 0 0 0 0.0941176 0 0 0 1 0"/>
                              <feBlend mode="normal" in2="effect2_dropShadow_1_460" result="effect3_dropShadow_1_460"/>
                              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                              <feOffset/>
                              <feGaussianBlur stdDeviation="2.45953"/>
                              <feColorMatrix type="matrix" values="0 0 0 0 0.85098 0 0 0 0 0.294118 0 0 0 0 0.0941176 0 0 0 1 0"/>
                              <feBlend mode="normal" in2="effect3_dropShadow_1_460" result="effect4_dropShadow_1_460"/>
                              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                              <feOffset/>
                              <feGaussianBlur stdDeviation="4.21634"/>
                              <feColorMatrix type="matrix" values="0 0 0 0 0.85098 0 0 0 0 0.294118 0 0 0 0 0.0941176 0 0 0 1 0"/>
                              <feBlend mode="normal" in2="effect4_dropShadow_1_460" result="effect5_dropShadow_1_460"/>
                              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                              <feOffset/>
                              <feGaussianBlur stdDeviation="7.37859"/>
                              <feColorMatrix type="matrix" values="0 0 0 0 0.85098 0 0 0 0 0.294118 0 0 0 0 0.0941176 0 0 0 1 0"/>
                              <feBlend mode="normal" in2="effect5_dropShadow_1_460" result="effect6_dropShadow_1_460"/>
                              <feBlend mode="normal" in="SourceGraphic" in2="effect6_dropShadow_1_460" result="shape"/>
                            </filter>
                          </defs>
                        </svg>
                      )}
                      <img
                        src={item.icon}
                        alt={item.title}
                        className="gaming-card-img"
                        draggable={false}
                        style={{
                          width: isCenter ? (isMobile ? 80 : 120) : (isMobile ? 60 : 100),
                          height: isCenter ? (isMobile ? 80 : 120) : (isMobile ? 60 : 100),
                          objectFit: "contain",
                          transition: "width 0.3s, height 0.3s",
                          position: "relative",
                          zIndex: 11,
                        }}
                      />
                    </div>
                    {/* Title always visible on mobile, only for non-center on desktop */}
                    {(isMobile || (!isMobile && !isCenter)) && (
                      <div className="gaming-card-title">{item.title}</div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Dots */}
            <div className="gaming-dots">
              {gamingItems.map((_, idx) => (
                <span
                  key={idx}
                  className={`gaming-dot${centerIdx === idx ? " active" : ""}`}
                  onClick={() => setCenterIdx(idx)}
                />
              ))}
            </div>
            
            {/* Project Title */}
            <div className="gaming-title" style={{
              ...(isIOS ? { 
                position: 'absolute',
                top: '50vh', 
                zIndex: 1000
              } : {})
            }}>
              ARENA
            </div>

            {/* Description for center card */}
            <div className="gaming-description" style={{
              ...(isIOS ? { 
                position: 'absolute',
                top: '-80vh',
                zIndex: 1000
              } : {})
            }}>
              This is The Arena — where Elementals collide, and the war for balance unfolds.
              <br />
              <br />
              Here, strategy is your weapon, and spirit is your shield. Deploy your warriors, command the lanes, and use the ancient power of your element.
            </div>

            {/* Subtitle */}
            <div 
              className="gaming-subtitle" 
              style={{
                ...(isIOS ? { 
                  position: 'absolute',
                  top: '200vh', 
                  left: '11vw',
                  zIndex: 1000
                } : {})
              }}
            >
              Will you restore the balance… or tip the scales?
            </div>
          </div>
        </>
      )}
    </Div100vh>
  );
};

export default GamingSection;