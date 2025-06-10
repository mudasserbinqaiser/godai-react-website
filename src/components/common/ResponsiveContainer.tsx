import React, { ReactNode } from 'react';
import Div100vh from 'react-div-100vh';
import { isIOS } from '../../utils/SafeAreaUtils';
import './ResponsiveContainer.css';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  verticalPadding?: boolean; // Add padding for iOS safe areas
  horizontalPadding?: boolean; // Add padding for iOS safe areas
  fullHeight?: boolean; // Whether container should take full viewport height
}

/**
 * A container component that properly handles 100vh on iOS
 * This component uses react-div-100vh to fix the iOS viewport height issue
 * and handles safe area insets for notched devices
 */
const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className = '', 
  style = {},
  verticalPadding = false,
  horizontalPadding = false,
  fullHeight = true
}) => {
  const iosDevice = isIOS();
  
  const containerStyles: React.CSSProperties = {
    ...style,
    // Apply safe area padding if requested
    ...(verticalPadding && iosDevice ? {
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)'
    } : {}),
    ...(horizontalPadding && iosDevice ? {
      paddingLeft: 'env(safe-area-inset-left, 0px)',
      paddingRight: 'env(safe-area-inset-right, 0px)'
    } : {}),
  };
  
  // Classes to handle iOS-specific styling needs
  const iosClass = iosDevice ? 'ios-container' : '';
  const safeAreaClass = verticalPadding && horizontalPadding ? 'ios-safe-all' : 
                         verticalPadding ? 'ios-safe-vertical' : 
                         horizontalPadding ? 'ios-safe-horizontal' : '';
  
  // If on iOS and fullHeight is true, use Div100vh to fix the iOS viewport height bug
  if (iosDevice && fullHeight) {
    return (
      <Div100vh className={`${className} ${iosClass} ${safeAreaClass}`} style={containerStyles}>
        {children}
      </Div100vh>
    );
  }
  
  // If we need full height but it's not iOS, use regular 100vh
  const heightStyle = fullHeight ? { height: '100vh' } : {};
  
  // Standard container for non-iOS or when fullHeight is false
  return (
    <div className={`${className} ${iosClass} ${safeAreaClass}`} style={{ ...containerStyles, ...heightStyle }}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;
