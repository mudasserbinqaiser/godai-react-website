// src/App.tsx
import { useState } from 'react';
import Preloader from './components/preloader/preloader';
import './App.css';

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  const handleLoadingComplete = () => {
    setLoadingComplete(true);
  };

  return (
    <div className="app">
      <Preloader onLoadingComplete={handleLoadingComplete} />
      
      {/* Main content will go here once we progress to the next sections */}
      {loadingComplete && (
        <div style={{ display: 'none' }}>
          {/* This is just a placeholder. We'll add content in future steps */}
        </div>
      )}
    </div>
  );
}

export default App;