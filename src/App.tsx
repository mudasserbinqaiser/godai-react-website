import { useState } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import { ScrollProgressProvider } from './context/ScrollProgressContext';
import Preloader from './components/preloader/preloader';
import Home from './pages/Home';
import { Helmet } from 'react-helmet';
import './App.css';

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  const handleLoadingComplete = () => {
    setLoadingComplete(true);
  };

  return (
    <>
    <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
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
    </>
  );
}

export default App;