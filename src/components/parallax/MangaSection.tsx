import React from "react";
import "./MangaSection.css";
import "../parallax/ProjectSection.css";
import "../parallax/NftSection.css";

const MANGA_PLACEHOLDER_TEXT = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...`;

const BUFFER = 0.4;
const DELAY = 0.35;

const MangaSection: React.FC<{ progress: number }> = ({ progress }) => {
  // Real-time scroll progress with DELAY
  const adjustedProgress = Math.max(0, Math.min(1, (progress - DELAY) / (1 - DELAY)));

  // Add the new calculation function
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

  const mangaLayerX = calculateLayerX(adjustedProgress);

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
        transition: "transform 1s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.4s ease-in-out", // Updated transition
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
      <div className="manga-blur-gradient" style={{ zIndex: 1 }}></div>
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
