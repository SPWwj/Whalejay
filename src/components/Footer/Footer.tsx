import React from 'react';
import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} WhaleJay. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
