import React, { ReactNode } from 'react';
import { useSafeAreaInsets } from '../../utils/SafeAreaUtils';
import Div100vh from 'react-div-100vh';

type SafeAreaViewProps = {
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

/**
 * SafeAreaView component that provides proper handling of safe area insets on iOS devices
 * and fixes the 100vh issues with mobile browsers, especially Safari
 */
export default function SafeAreaView({ children, style, className }: SafeAreaViewProps) {
  // Get safe area insets (most important on iOS)
  const insets = useSafeAreaInsets();
  
  // Combine user styles with safe area padding
  const combinedStyle: React.CSSProperties = {
    paddingTop: `${insets.top}px`,
    paddingRight: `${insets.right}px`,
    paddingBottom: `${insets.bottom}px`,
    paddingLeft: `${insets.left}px`,
    boxSizing: 'border-box',
    position: 'relative',
    width: '100%',
    height: '100%',
    ...style
  };

  return (
    <Div100vh className={className} style={combinedStyle}>
      {children}
    </Div100vh>
  );
}

/**
 * A variant that doesn't include top safe area inset padding
 * Useful for sections where you want content to extend under status bar
 */
export function SafeAreaViewExceptTop({ children, style, className }: SafeAreaViewProps) {
  const insets = useSafeAreaInsets();
  
  const combinedStyle: React.CSSProperties = {
    paddingRight: `${insets.right}px`,
    paddingBottom: `${insets.bottom}px`,
    paddingLeft: `${insets.left}px`,
    boxSizing: 'border-box',
    position: 'relative',
    width: '100%',
    height: '100%',
    ...style
  };

  return (
    <Div100vh className={className} style={combinedStyle}>
      {children}
    </Div100vh>
  );
}
