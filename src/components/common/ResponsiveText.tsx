import React, { ReactNode } from 'react';
import { isIOS } from '../../utils/SafeAreaUtils';

interface ResponsiveTextProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  component?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
}

/**
 * A text component that handles iOS-specific text rendering issues
 * This component applies proper styles to prevent overlapping and ensure correct text sizing
 */
const ResponsiveText: React.FC<ResponsiveTextProps> = ({ 
  children, 
  className = '', 
  style = {}, 
  component = 'p'
}) => {
  // iOS-specific styles to prevent text overlap issues
  const iosStyles: React.CSSProperties = isIOS() ? {
    maxWidth: '100%',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    hyphens: 'auto',
    WebkitHyphens: 'auto',
    msHyphens: 'auto',
    // Prevent text size adjustment on orientation change
    WebkitTextSizeAdjust: '100%',
    // Improve text rendering
    textRendering: 'optimizeLegibility',
    // Prevent overlap with other elements
    position: 'relative',
    zIndex: 1,
    ...style
  } : style;

  // Apply the correct HTML element based on component prop
  const Component = component as React.ElementType;

  return (
    <Component 
      className={`responsive-text ${className} ${isIOS() ? 'ios-text' : ''}`}
      style={iosStyles}
    >
      {children}
    </Component>
  );
};

export default ResponsiveText;
