import logo from './logo.svg';
import './Header.css';


function Header() {
  return (
    <div className="Header">
      <header className="Header-header">
        <img src={logo} className="Header-logo" alt="logo" /> Developer Test
      </header>
    </div>
  );
}

export default Header;
