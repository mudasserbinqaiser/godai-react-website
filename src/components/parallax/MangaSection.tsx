import React from "react";
import "./MangaSection.css";
import "../parallax/ProjectSection.css";
import "../parallax/NftSection.css";

const MANGA_PLACEHOLDER_TEXT = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...`;

const BUFFER = 0.3;
const DELAY = 0.3;

const MangaSection: React.FC<{ progress: number }> = ({ progress }) => {
  // Real-time scroll progress with DELAY
  const adjustedProgress = Math.max(0, Math.min(1, (progress - DELAY) / (1 - DELAY)));

  // Real-time horizontal shift (no snapping/jumping)
  let mangaLayerX = 0;
  if (adjustedProgress < BUFFER) {
    mangaLayerX = (1 - adjustedProgress / BUFFER) * window.innerWidth;
  } else if (adjustedProgress > 1 - BUFFER) {
    mangaLayerX = -((adjustedProgress - (1 - BUFFER)) / BUFFER) * window.innerWidth;
  }

  const zoom = 1 + adjustedProgress * 0.08;

  return (
    <div
      className="manga-section-bg"
      style={{
        transform: `translateX(${mangaLayerX}px) scale(${zoom})`,
        opacity: adjustedProgress > 0 ? 1 : 0,
        pointerEvents: adjustedProgress > 0 ? "auto" : "none",
        zIndex: 11,
        // ✨ Remove heavy transition here to make scroll reactive
        transition: "transform 0.1s linear, opacity 0.2s ease-out",
      }}
    >
      {/* Video background */}
      <video
        className="manga-bg-video"
        src="/assets/videos/manga.webm"
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

      {/* Decorative elements */}
      <div className="nft-blur-gradient" style={{ zIndex: 1 }}></div>
      <div className="manga-art-placeholder" />
      <div className="project-lines">
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

      {/* Description */}
      <div className="manga-description">
        {MANGA_PLACEHOLDER_TEXT}
      </div>
    </div>
  );
};

export default MangaSection;
