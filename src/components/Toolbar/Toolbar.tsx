import React from "react";
import "./Toolbar.scss";

const Toolbar: React.FC = () => {
	return (
		<div className="toolbar">
			<ul className="toolbar__list">
				<li className="toolbar__item">Item 1</li>
				<li className="toolbar__item">Item 2</li>
				<li className="toolbar__item">Item 3</li>
			</ul>
		</div>
	);
};

export default Toolbar;
