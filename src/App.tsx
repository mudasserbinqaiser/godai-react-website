import { useState } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import { ScrollProgressProvider } from './context/ScrollProgressContext';
import Preloader from './components/preloader/preloader';
import Home from './pages/Home';
import './App.css';

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  const handleLoadingComplete = () => {
    setLoadingComplete(true);
  };

  return (
    <ScrollProgressProvider>
      <ParallaxProvider>
        <div className="app">
          <Preloader onLoadingComplete={handleLoadingComplete} />
          
          {loadingComplete && (
            <main className="main-content">
              <Home />
            </main>
          )}
        </div>
      </ParallaxProvider>
    </ScrollProgressProvider>
  );
}

export default App;