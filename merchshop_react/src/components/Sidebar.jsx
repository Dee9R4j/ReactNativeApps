import { Link } from 'react-router-dom';
import { Moon, Sun, X, ShoppingBag, Heart, ShoppingCart, Settings } from 'lucide-react';
import './Sidebar.css';
import { useState } from 'react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'} ${darkMode ? 'dark' : 'light'}`}>
      <div className="sidebar-header">
        <h2>Menu</h2>
        <button 
          onClick={() => setIsOpen(false)} 
          className="close-button"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      <div className="profile-section">
        <img
          src="https://lh3.googleusercontent.com/a/ACg8ocIJBl35yFAOE4k2avfffoWNnoZ3frtR9oK0VbjtxmCyYVibzLM=s576-c-no"
          alt="Profile"
          className="profile-pic"
        />
        <p className="profile-name">Deep Raj</p>
        <button className="edit-button">Edit Profile</button>
        <button className="logout-button">Log Out</button>
      </div>

      <nav className="sidebar-nav">
        <Link 
          to="/orders" 
          className="sidebar-item"
          onClick={() => setIsOpen(false)}
        >
          <ShoppingBag />
          <span>Orders</span>
        </Link>
        <Link 
          to="/wishlist" 
          className="sidebar-item"
          onClick={() => setIsOpen(false)}
        >
          <Heart />
          <span>Wishlist</span>
        </Link>
        <Link 
          to="/cart" 
          className="sidebar-item"
          onClick={() => setIsOpen(false)}
        >
          <ShoppingCart />
          <span>Cart</span>
        </Link>
        <div className="sidebar-item">
          <Settings />
          <span>Settings</span>
        </div>
      </nav>

      <div className="theme-toggle">
        <Sun size={20} className="sun-icon" />
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          />
          <span className="slider"></span>
        </label>
        <Moon size={20} className="moon-icon" />
      </div>
    </div>
  );
};

export default Sidebar;