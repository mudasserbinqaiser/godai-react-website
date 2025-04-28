import React, { useState, useEffect, useRef } from "react";
import "./GamingSection.css";

const gamingItems = [
  { icon: "/assets/images/gaming.png", title: "Blackout", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown." },
  { icon: "/assets/images/gaming.png", title: "Blackout", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown." },
  { icon: "/assets/images/gaming.png", title: "Blackout", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown." },
  { icon: "/assets/images/gaming.png", title: "Blackout", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown." },
  { icon: "/assets/images/gaming.png", title: "Blackout", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown." },
];

const V_ANGLES = [0, 0, 0, 0, 0];
const V_OFFSETS = [168, 68, -48, -158, -258];
const X_OFFSETS = [120, 60, 0, 60, 120];
const MOBILE_X_OFFSETS = [-160, -80, 0, 80, 160];
const MOBILE_Y_OFFSETS = [100, 50, 0, 50, 100]; // Creating a V shape vertically
const BUFFER = 0.3;
const DELAY = 0.3;

const GamingSection: React.FC<{ progress: number }> = ({ progress }) => {
  const [centerIdx, setCenterIdx] = useState(2);
  const intervalRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [swiping, setSwiping] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real-time scroll progress with DELAY
  const adjustedProgress = Math.max(0, Math.min(1, (progress - DELAY) / (1 - DELAY)));

  // More sophisticated horizontal scroll logic:
  // 1. Slow/gradual entry from right (first 15% of progress)
  // 2. Direct linear exit to left (remaining progress) 
  let gamingLayerX = 0;
  
  if (adjustedProgress < BUFFER) {
    // Entry phase - smoother curve from right to center
    gamingLayerX = (1 - adjustedProgress / BUFFER) * window.innerWidth;
  } else if (adjustedProgress > 1 - BUFFER) {
    // Exit phase - direct proportional to scroll (responsive)
    gamingLayerX = -((adjustedProgress - (1 - BUFFER)) / BUFFER) * window.innerWidth;
  }

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
    <div
      className="gaming-carousel-bg"
      style={{
        position: "absolute",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        background: "#071726",
        zIndex: 11,
        transform: `translateX(${gamingLayerX}px) scale(${zoom})`,
        opacity: progress > 0 ? 1 : 0,
        pointerEvents: progress > 0 ? "auto" : "none",
      }}
    >
      {/* Video background always rendered */}
      <video
        className="gaming-bg-video"
        src="/assets/videos/gaming.webm"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
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
                              stroke="#D94B18"
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
            
            {/* Description for center card */}
            <div className="gaming-description">
              {gamingItems[centerIdx].description}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GamingSection;