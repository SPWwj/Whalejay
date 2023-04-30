import React from "react";
import "./App.scss";
import Navbar from "../components/Navbar/Navbar";
import Content from "../components/Content/Content";
import Footer from "../components/Footer/Footer";
import Main from "../pages/Main/Main";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Image from "../pages/Image/Image";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Clan from "../pages/Clan/Clan";

const App: React.FC = () => {
	return (
		<div className="app">
			<Router>
				<Navbar />
				<Content>
					<Routes>
						<Route path="/" element={<Main />} />
						<Route path="/image" element={<Image />} />
						<Route path="/about" element={<About />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/clan" element={<Clan />} />
					</Routes>
				</Content>
				<Footer />
			</Router>
		</div>
	);
};

export default App;
