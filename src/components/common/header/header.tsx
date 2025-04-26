import { Link } from 'react-scroll';
import './header.css';

const Header = () => {
  return (
    <nav className="navigation">
      <div className="nav-links">
        <Link to="project" smooth={true} duration={800} offset={-50}>Project</Link>
        <Link to="keep" smooth={true} duration={800} offset={-50}>The Keep</Link>
        <Link to="factions" smooth={true} duration={800} offset={-50}>Factions</Link>
        <Link to="world" smooth={true} duration={800} offset={-50}>The World</Link>
      </div>
    </nav>
  );
};

export default Header;