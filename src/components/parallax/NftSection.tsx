import React from "react";
import "./NftSection.css";
import "../parallax/ProjectSection.css";
import NftCarousel from "./NftCarousel";

const BUFFER = 0.3;
const DELAY = 0.3;

const NftSection: React.FC<{ progress: number }> = ({ progress }) => {
  // Real-time scroll progress with DELAY
  const adjustedProgress = Math.max(0, Math.min(1, (progress - DELAY) / (1 - DELAY)));

  // Real-time horizontal shift (no snapping/jumping)
  let nftLayerX = 0;
  if (adjustedProgress < BUFFER) {
    nftLayerX = (1 - adjustedProgress / BUFFER) * window.innerWidth;
  } else if (adjustedProgress > 1 - BUFFER) {
    nftLayerX = -((adjustedProgress - (1 - BUFFER)) / BUFFER) * window.innerWidth;
  }

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
        transition: "transform 0.1s linear, opacity 0.2s ease-out",
      }}
    >
      {/* Video background */}
      <video
        className="nft-bg-video"
        src="/assets/videos/nft.webm"
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

      {/* NFT Carousel */}
      <NftCarousel />
    </div>
  );
};

export default NftSection;