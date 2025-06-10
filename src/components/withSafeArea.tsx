import React, { ComponentType, ReactNode } from 'react';
import { SafeAreaViewExceptTop } from './common/SafeAreaView';
import { isIOS } from '../utils/SafeAreaUtils';

/**
 * Higher Order Component to wrap section components with SafeAreaView
 * This ensures proper padding for safe areas on iOS devices
 */
export function withSafeArea<P extends { children?: ReactNode }>(
  WrappedComponent: ComponentType<P>
): React.FC<P> {  const WithSafeArea = (props: P) => {
    // If not iOS, just render the wrapped component
    if (!isIOS()) {
      return <WrappedComponent {...props} />;
    }
    
    // If iOS, wrap with SafeAreaViewExceptTop
    return (
      <SafeAreaViewExceptTop>
        <WrappedComponent {...props} />
      </SafeAreaViewExceptTop>
    );
  };
  
  // Set display name for debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithSafeArea.displayName = `withSafeArea(${displayName})`;
  
  return WithSafeArea;
}
