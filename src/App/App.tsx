import React from "react";
import "./App.scss";
import Navbar from "../components/Navbar/Navbar";
import Content from "../components/Content/Content";
import Footer from "../components/Footer/Footer";
import Main from "../pages/Main/Main";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Image from "../pages/Image/Image";

import { Routes, Route, HashRouter } from "react-router-dom";
import Form from "../pages/Form/Form";
// import MindMap from "../pages/Form/MindMap/MindMap";

const App: React.FC = () => {
	return (
		<div className="app">
			<HashRouter>
				<Navbar />
				<Content>
					<Routes>
						<Route path="/" element={<Main />} />
						<Route path="/image" element={<Image />} />
						<Route path="/about" element={<About />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/form" element={<Form />} />
						{/* <Route path="/mindmap" element={<MindMap />} /> */}
					</Routes>
					<Footer />
				</Content>
			</HashRouter>
		</div>
	);
};

export default App;
