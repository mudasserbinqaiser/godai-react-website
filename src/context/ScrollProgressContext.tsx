import React, { createContext, useState } from 'react';

interface ScrollProgressContextProps {
  progress: number;
  setProgress: (progress: number) => void;
}

export const ScrollProgressContext = createContext<ScrollProgressContextProps>({
  progress: 0,
  setProgress: () => {}
});

export const ScrollProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState(0);
  
  return (
    <ScrollProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </ScrollProgressContext.Provider>
  );
};