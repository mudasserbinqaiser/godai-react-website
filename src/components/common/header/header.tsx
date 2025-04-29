import { Link } from 'react-scroll';
import './header.css';
import { useContext } from 'react';
import { ScrollProgressContext } from '../../../context/ScrollProgressContext';

const Header = () => {
  const { progress } = useContext(ScrollProgressContext);

  const speedMultiplier = 1;  // Fills faster
  const adjustedFill = Math.min(progress * speedMultiplier * 100, 100);

  return (
    <nav className="navigation">
      <div className="nav-links">
        <Link to="project" smooth={true} duration={800} offset={-50}>Project</Link>
        <Link to="keep" smooth={true} duration={800} offset={-50}>The Keep</Link>
        <Link to="factions" smooth={true} duration={800} offset={-50}>Factions</Link>
        <Link to="world" smooth={true} duration={800} offset={-50}>The World</Link>
      </div>
      
      <div className="progress-container">
        <svg 
          className="progress-svg"
          width="100%" 
          height="77" 
          viewBox="0 0 1234 77" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          preserveAspectRatio="none"
        >
          <path 
            d="M1 1.53454V76.0345H791.5L822 45.5345H980.5L1000.5 25.5345H1009.5L989.5 45.5345H1001.5L1021.5 25.5345H1030.5L1010.5 45.5345H1021.5L1041.5 25.5345H1050L1030 45.5345H1041.5L1061.5 25.5345H1070.5L1050.5 45.5345H1061.5L1081.5 25.5345H1091L1071 45.5345H1081.5L1101.5 25.5345H1112L1092 45.5345H1101.5L1121.5 25.5345H1132.5L1112.5 45.5345H1188.5C1202.83 30.2012 1231.8 -0.16546 1233 1.03454C1234.2 2.23454 412.167 1.86787 1 1.53454Z" 
            stroke="white" 
            strokeWidth="0.7"
            fill="none"
          />
          <path 
            d="M1 1.53454V76.0345H791.5L822 45.5345H980.5L1000.5 25.5345H1009.5L989.5 45.5345H1001.5L1021.5 25.5345H1030.5L1010.5 45.5345H1021.5L1041.5 25.5345H1050L1030 45.5345H1041.5L1061.5 25.5345H1070.5L1050.5 45.5345H1061.5L1081.5 25.5345H1091L1071 45.5345H1081.5L1101.5 25.5345H1112L1092 45.5345H1101.5L1121.5 25.5345H1132.5L1112.5 45.5345H1188.5C1202.83 30.2012 1231.8 -0.16546 1233 1.03454C1234.2 2.23454 412.167 1.86787 1 1.53454Z" 
            fill="#ffffff"
            opacity="0.1"
            stroke="none"
            className="progress-fill"
            style={{ 
                clipPath: `polygon(0 0, ${adjustedFill}% 0, ${adjustedFill}% 100%, 0 100%)` 
            }}
          />
        </svg>
      </div>
    </nav>
  );
};

export default Header;
