import React from "react";
import "./NftSection.css";
import "../parallax/ProjectSection.css";
import NftCarousel from "./NftCarousel";

const BUFFER = 0.4;
const DELAY = 0.35;

const NftSection: React.FC<{ progress: number }> = ({ progress }) => {
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

  const nftLayerX = calculateLayerX(adjustedProgress);

  const zoom = 1 + adjustedProgress * 0.08;

  return (
    <div
      className="nft-section-bg"
      style={{
        position: "absolute",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        background: "#071726",
        zIndex: 10,
        transform: `translateX(${nftLayerX}px) scale(${zoom})`,
        opacity: progress > 0 ? 1 : 0,
        pointerEvents: progress > 0 ? "auto" : "none",
        // Light transition for smoother feel but still responsive to scroll
        transition: "transform 1s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.4s ease-in-out", // Updated transition
      }}
    >
      {/* Video background */}
      <video
        className="nft-bg-video"
        src="/assets/videos/nft.mp4"
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

      {/* Blur gradient and lines */}
      <div className="nft-blur-gradient" style={{ zIndex: 1 }}></div>
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

      {/* NFT Section Title */}
      <div 
        className="nft-title"
        style={{
          opacity: adjustedProgress,
          transform: `translateX(${(1 - adjustedProgress) * 50}px)`,
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
        }}
      >
        GENESIS SUMMONING
      </div>

      {/* NFT Carousel */}
      <NftCarousel />
    </div>
  );
};

export default NftSection;