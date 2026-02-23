import { Link } from 'react-router-dom';
import { Menu, Heart, ShoppingCart } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ setSidebarOpen }) => {
  return (
    <nav className="navbar">
      <button 
        className="menu-btn" 
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={35} />
      </button>

      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search..." 
          className="search-input"
        />
      </div>

      <div className="icons">
        <Link to="/wishlist" className="icon wishlist">
          <Heart size={35} />
        </Link>
        <Link to="/cart" className="icon cart">
          <ShoppingCart size={35} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;