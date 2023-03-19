import React from 'react';
import './Navbar.scss';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <nav>
        <h1 className="navbar__logo">WhaleJay</h1>
        <ul className="navbar__menu">
          <li className="navbar__menu-item">
            <Link to="/">Home</Link>
          </li>
          <li className="navbar__menu-item">
            <Link to="/about">About</Link>
          </li>
          <li className="navbar__menu-item">
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
