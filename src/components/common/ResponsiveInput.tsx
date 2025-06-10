import React, { InputHTMLAttributes } from 'react';
import { isIOS } from '../../utils/SafeAreaUtils';
import './ResponsiveInput.css';

interface ResponsiveInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  labelClassName?: string;
}

/**
 * A form input component that handles iOS-specific input rendering issues
 * This component applies proper styles to prevent zooming and styling inconsistencies on iOS
 */
const ResponsiveInput: React.FC<ResponsiveInputProps> = ({ 
  className = '', 
  label,
  labelClassName = '',
  ...inputProps
}) => {
  // iOS-specific styles for inputs
  const iosInputClass = isIOS() ? 'ios-input' : '';
  
  return (
    <div className="responsive-input-container">
      {label && (
        <label className={`responsive-input-label ${labelClassName} ${isIOS() ? 'ios-label' : ''}`}>
          {label}
        </label>
      )}
      <input 
        className={`responsive-input ${className} ${iosInputClass}`}
        {...inputProps}
      />
    </div>
  );
};

export default ResponsiveInput;
