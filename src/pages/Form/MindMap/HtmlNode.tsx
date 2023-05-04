import React, { useEffect, useRef } from "react";
import "./HtmlNode.scss";
import { drag } from "d3-drag";
import { select } from "d3-selection";
import { D3DragEvent } from "d3-drag";

export interface NodeProps {
	nodeDatum: {
		name: string;
		role: string;
		[key: string]: any;
	};
	[key: string]: any;
}

export const DELIMITER = "@-@";

const HtmlNode: React.FC<NodeProps> = ({ nodeDatum }) => {
	const nodeRef = useRef<SVGGElement>(null);

	useEffect(() => {
		if (nodeRef.current) {
			const node = select(nodeRef.current);
			const dragBehavior = drag<SVGGElement, any>()
				.on("start", () => {
					node.raise();
				})
				.on("drag", (event: D3DragEvent<SVGGElement, any, any>) => {
					node.attr("transform", `translate(${event.x},${event.y})`);
				});

			node.call(dragBehavior);
		}
	}, []);
	const names = nodeDatum.name.split(DELIMITER);
	const roles = nodeDatum.role.split(DELIMITER);
	const containerClasses = ["container"];
	if (names.length > 1) {
		containerClasses.push("containerWithBorder");
	}
	return (
		<g ref={nodeRef}>
			<foreignObject className="foreignObject" x="-125" y="-25">
				<div className={containerClasses.join(" ")}>
					{names.map((name, index) => (
						<div key={index} className="node">
							<p className="role">{roles[index]}</p>
							{name}
						</div>
					))}
				</div>
			</foreignObject>
		</g>
	);
};

export default HtmlNode;
