import './header.css';

const Header = () => {
  return (
    <nav className="navigation">
      <div className="nav-links">
        <a href="#project">Project</a>
        <a href="#keep">The Keep</a>
        <a href="#factions">Factions</a>
        <a href="#world">The World</a>
      </div>
    </nav>
  );
};

export default Header;