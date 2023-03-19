import React from "react";
import "./Content.scss";
import Toolbar from "../Toolbar/Toolbar";

interface ContentProps {
	children: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => {
	return (
		<div className="content">
			{/* <Toolbar /> */}
			{children}
		</div>
	);
};
export default Content;
