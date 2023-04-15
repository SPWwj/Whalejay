import React from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import logoImage from "../../assets/images/app-image.png";

const Navbar: React.FC = () => {
	return (
		<header className="navbar">
			<nav>
				<img src={logoImage} alt="Logo" className="navbar__logo" />
				<ul className="navbar__menu">
					<li className="navbar__menu-item">
						<Link to="/">Home</Link>
					</li>
					{/* <li className="navbar__menu-item">
            <Link to="/about">About</Link>
          </li>
          <li className="navbar__menu-item">
            <Link to="/contact">Contact</Link>
          </li> */}
				</ul>
			</nav>
		</header>
	);
};

export default Navbar;
