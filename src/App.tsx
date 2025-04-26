// src/App.tsx
import { useState } from 'react';
import Preloader from './components/preloader/preloader';
import HeroBanner from './components/sections/heroBanner/heroBanner';
import './App.css';
import Layout from './components/layout/layout';

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  const handleLoadingComplete = () => {
    setLoadingComplete(true);
  };

  return (
    <div className="app">
      <Preloader onLoadingComplete={handleLoadingComplete} />
      
      {loadingComplete && (
        <main className="main-content">
          <Layout>
            <HeroBanner />
            {/* Other sections will be added here later */}
          </Layout>
        </main>
      )}
    </div>
  );
}

export default App;