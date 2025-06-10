import React, { ReactNode } from 'react';
import { isIOS } from '../../utils/SafeAreaUtils';

interface IOSTeamFixProps {
  children: ReactNode;
}

/**
 * A component that applies iOS-specific fixes to the TeamSection
 * This addresses overlap and positioning issues on different iOS devices
 */
export const IOSTeamFix: React.FC<IOSTeamFixProps> = ({ children }) => {
  if (!isIOS()) {
    return <>{children}</>;
  }

  // Add iOS-specific styles to the document head
  React.useEffect(() => {
    // Create a style element
    const styleEl = document.createElement('style');
    styleEl.id = 'ios-team-section-fixes';
    
    // iOS-specific CSS fixes for TeamSection
    styleEl.innerHTML = `
      @supports (-webkit-touch-callout: none) {
        /* Force position recalculation for team info */
        .team-info {
          transform: translate3d(0, 0, 0);
        }
        
        /* iPhone specific fixes */
        .team-member-display {
          transform: translate(-50%, -55%) scale(0.9) !important;
        }
        
        /* Fix dots position */
        .team-mobile-dots {
          bottom: env(safe-area-inset-bottom, 20px) !important;
          padding-bottom: 15px !important;
        }
        
        /* Fix X button positioning */
        .x-button {
          position: relative !important;
          bottom: auto !important;
          top: auto !important;
          z-index: 200 !important;
        }
        
        /* Ensure text doesn't overlap */
        .team-description-header,
        .team-name,
        .team-subtitle,
        .team-title {
          max-width: 90vw;
          margin-left: auto;
          margin-right: auto;
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
      }
    `;
    
    // Add the style to the document head
    document.head.appendChild(styleEl);
    
    // Clean up
    return () => {
      const existingStyle = document.getElementById('ios-team-section-fixes');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);
  return <>{children}</>;
};

export default IOSTeamFix;
