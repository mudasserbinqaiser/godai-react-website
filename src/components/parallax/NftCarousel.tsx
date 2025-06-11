import { useState, useEffect, useRef } from "react";
import "./NftCarousel.css";
import "../parallax/ProjectSection.css";

const nftImages = [
  "/assets/images/nft1.png",
  "/assets/images/nft2.png",
  "/assets/images/nft3.png",
  "/assets/images/nft4.png",
  "/assets/images/nft5.png",
  "/assets/images/nft6.png",
  "/assets/images/nft7.png",
];

// const nftTitles = [
//   "TITLE",
//   "TITLE",
//   "TITLE",
//   "TITLE",
//   "TITLE",
//   "TITLE",
//   "TITLE",
// ];

const nftDescriptions = [
  "Born of starlight and shadow, he walks between worlds. When he awakens, reality itself trembles before his cosmic power.",
  "Silent as a breeze, fierce as a storm. She commands the sky—where wind goes, she follows, unseen until it's too late.",
  "Keeper of the ocean's wisdom, his gaze holds the depth of ancient seas. He commands tides with quiet strength, guarding secrets only the waters remember.",
  "Graceful yet relentless, she bends oceans to her will. Her tides reshape destinies, calm surfaces hiding untold depths.",
  "The sea whispers his name; ancient depths rise to answer. Beneath his calm lies the silent power of endless oceans.",
  "Master of winds and keeper of storms. He moves unseen, carving fate from clouds with blades of silent thunder.",
  "Guardian of earth and keeper of roots, mountains yield to his will. In nature's ancient shadow, he defends the sacred balance.",
];

const fanAngles = [-45.17, -30.76, -15.45, 0, 15.45, 30.76, 45.17];
const fanOffsets = [-650, -470, -250, 0, 250, 470, 650];
const fanCurve = [200, 80, 10, 0, 10, 80, 200];   // Increased Y-offset for deeper curve

const NftCarousel: React.FC<{ isIOS?: boolean }> = ({ isIOS = false }) => {
  const [centerIdx, setCenterIdx] = useState(3);
  const [flipped, setFlipped] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Start auto slider
  useEffect(() => {
    startSlider();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startSlider = () => {
    intervalRef.current = window.setInterval(() => {
      setCenterIdx((idx) => (idx + 1) % nftImages.length);
      setFlipped(false);
    }, 2500);  // Slower slider (4 seconds)
  };

  const pauseSlider = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resumeSlider = () => {
    if (!intervalRef.current) {
      startSlider();
    }
  };

  const getDotIdx = () => {
    if (centerIdx === 0) return 0;
    if (centerIdx === nftImages.length - 1) return 2;
    return 1;
  };

  const getCardProps = (i: number) => {
    const total = nftImages.length;
    let offset = (i - centerIdx + total) % total;

    if (offset > total / 2) offset -= total;

    if (Math.abs(offset) > 3) return { visible: false };

    const angle = fanAngles[offset + 3];
    const x = fanOffsets[offset + 3];
    const y = fanCurve[offset + 3];
    const isCenter = offset === 0;

    return {
      visible: true,
      angle,
      x,
      y,
      isCenter,
      z: 10 - Math.abs(offset),
      scale: isCenter ? 1.3 : 0.8,
      top: isCenter ? 60 : 110,
    };
  };

  const startAutoAdvance = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setCenterIdx((idx) => (idx + 1) % nftImages.length);
      setFlipped(false);
    }, 2500);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlipped(false);
    setCenterIdx((idx) => (idx - 1 + nftImages.length) % nftImages.length);
    startAutoAdvance();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlipped(false);
    setCenterIdx((idx) => (idx + 1) % nftImages.length);
    startAutoAdvance();
  };

  return (
    <div className={`nft-carousel-bg ${isIOS ? 'ios-safari' : ''}`}>
      {/* <div className="nft-blur-gradient"></div> */}
      {/* <div className="project-lines">
        <div className="vertical-line v1"></div>
        <div className="vertical-line v2"></div>
        <div className="vertical-line v3"></div>
        <div className="vertical-line v4"></div>
        <div className="vertical-line v5"></div>
      </div> */}
      <div
        className={`nft-carousel ${isIOS ? 'ios-safari' : ''}`}
        onMouseEnter={pauseSlider}
        onMouseLeave={resumeSlider}
      >
        {nftImages.map((src, i) => {
          const { visible, angle, x, y, isCenter, z, scale, top } = getCardProps(i);
          if (!visible) return null;
          return (
            <div
              key={src}
              className={`nft-card${isCenter ? " center" : ""}${flipped && isCenter ? " flipped" : ""} ${isIOS ? 'ios-safari' : ''}`}
              style={{
                zIndex: z,
                transform: `
                  translateX(${x}px)
                  translateY(${y}px)
                  scale(${scale})
                  rotate(${angle}deg)
                `,
                boxShadow: isCenter
                  ? "0 0 32px 0 #FF991C, 0 0 0 4px #FF991C"
                  : "0 4px 32px 0 rgba(0,0,0,0.3)",
                border: isCenter ? "0.2rm solid #FF991C" : "none",
                transition: "transform 0.7s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.3s, border 0.3s",
                position: "absolute",
                top: top,
                left: "51.9%",
                marginLeft: -90,
                width: 140,
                height: 210,
                background: "#101c2b",
                borderRadius: 18,
                overflow: "hidden",
                cursor: isCenter ? "pointer" : "default",
                perspective: "1000px",
              }}
              onMouseEnter={() => isCenter && setFlipped(true)}
              onMouseLeave={() => isCenter && setFlipped(false)}
              onClick={() => !isCenter && setCenterIdx(i)}
              draggable={false}
            >
              <div className="nft-card-inner">
                <div className="nft-card-front">
                  <img
                    src={src}
                    alt={`NFT ${i + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 18,
                      pointerEvents: "none",
                    }}
                  />
                </div>
                <div className="nft-card-back">
                  {/* Glow effect */}
                  <div className="nft-card-glow" />
                  {/* Main background and border */}
                  <div className="nft-card-back-main">
                    <div className="nft-card-back-content">
                      {/* <div className="nft-card-back-title">{nftTitles[i]}</div> */}
                      <div className={`nft-card-back-desc ${isIOS ? 'ios-safari' : ''}`}>{nftDescriptions[i]}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`nft-carousel-description ${isIOS ? 'ios-safari' : ''}`}>
        When the world began to fracture, 3333 ancient warriors were summoned. Each 1/1 hand drawn warrior is born from a single element. They are not relics of the past, they are the key to what comes next.
      </div>
      <div className={`nft-carousel-subtitle ${isIOS ? 'ios-safari' : ''}`}>
        The summoning has begun
        <br />
        Which element will you choose?
      </div>

      {/* Slider controls */}
      <div className="nft-slider-controls">
        <div 
          className="nft-arrow-btn" 
          onClick={handlePrev}
          style={{ touchAction: 'auto' }} 
          data-touch-action="auto"
        >
          {/* Left arrow SVG */}
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M12 2L4 12L12 22" stroke="#FF991C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className={`nft-dots ${isIOS ? 'ios-safari' : ''}`}>
          {[0, 1, 2,3,4,5,6].map((idx) => (
            <span
              key={idx}
              className={`nft-dot${getDotIdx() === idx ? " active" : ""}`}
            />
          ))}
        </div>
        <div 
          className="nft-arrow-btn" 
          onClick={handleNext}
          style={{ touchAction: 'auto' }} 
          data-touch-action="auto"
        >
          {/* Right arrow SVG */}
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M4 2L12 12L4 22" stroke="#FF991C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NftCarousel;
