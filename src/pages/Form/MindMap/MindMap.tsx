import React, { useEffect, useRef, useState } from "react";
import { Tree } from "react-d3-tree";
import HtmlNode, { DELIMITER } from "./HtmlNode";
import "./MindMap.scss";
import { IResponseTreeNode } from "./IResponseTreeNode";
import { IForm } from "../model/IForm";

interface MindMapNode {
	name: string;
	role: string;
	children?: MindMapNode[];
}

const transformData = (
	form: IForm,
	nodes: IResponseTreeNode[]
): MindMapNode => {
	const buildMindMapNode = (node: IResponseTreeNode): MindMapNode => {
		const response = form.responses.find((r) => r.id === node.responseId);
		const fullName =
			response?.answers.find((a) => a.questionId === 8)?.answerText +
			" " +
			response?.answers.find((a) => a.questionId === 1)?.answerText;
		const nodeName = fullName;
		const nodeRole = response?.answers.find(
			(a) => a.questionId === node.questionId
		)?.answerText;

		let siblingName = "";
		let siblingRole: string = "";
		if (node.siblingNodeId) {
			const siblingNode = nodes.find((n) => n.id === node.siblingNodeId);
			if (siblingNode) {
				const siblingResponse = form.responses.find(
					(r) => r.id === siblingNode.responseId
				);

				const siblingFullName =
					siblingResponse?.answers.find((a) => a.questionId === 8)?.answerText +
					" " +
					siblingResponse?.answers.find((a) => a.questionId === 1)?.answerText;

				siblingName = DELIMITER + siblingFullName;
				siblingRole =
					DELIMITER +
						siblingResponse?.answers.find(
							(a) => a.questionId === node.questionId
						)?.answerText ?? "";
			}
		}

		const children = nodes
			.filter((n) => n.parentNodeId === node.id)
			.map((childNode) => buildMindMapNode(childNode));

		return {
			name: nodeName + siblingName,
			role: nodeRole + siblingRole,
			children: children.length > 0 ? children : undefined,
		};
	};

	const rootNode = nodes.find((node) => node.rootNode);
	if (!rootNode) {
		throw new Error("Root node not found");
	}

	return buildMindMapNode(rootNode);
};
const fetchResponseTreeNodes = async (
	id: number,
	questionId: number
): Promise<IResponseTreeNode[]> => {
	try {
		const response = await fetch(
			`https://localhost:7276/api/ResponseTreeNodes/${id}/${questionId}`,
			{
				headers: {
					Accept: "application/json",
				},
			}
		);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching data:", error);
		return [];
	}
};
interface Props {
	form: IForm | null;
}
const MindMap: React.FC<Props> = ({ form }) => {
	const treeContainerRef = useRef<HTMLDivElement>(null);
	const [responseTreeNode, setResponseTreeNode] = useState<
		IResponseTreeNode[] | null
	>([]);

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			fetchResponseTreeNodes(1, 9).then((data) => {
				setResponseTreeNode(data);
			});
			isFirstRender.current = false;
		}
	}, []);

	const initialTranslate = () => {
		if (treeContainerRef.current) {
			return {
				x: treeContainerRef.current.offsetWidth / 2,
				y: treeContainerRef.current.offsetHeight / 2,
			};
		}
		return { x: 50, y: 350 };
	};
	useEffect(() => {
		const updateTextPosition = () => {
			const textElements =
				treeContainerRef.current?.querySelectorAll(".rd3t-label__title");
			if (textElements) {
				textElements.forEach((textElement) => {
					textElement.setAttribute("dy", "0.5em");
					textElement.setAttribute("y", "2");
					textElement.setAttribute("x", "20");
				});
			}
		};

		updateTextPosition();
	}, []);

	useEffect(() => {
		const onResize = () => {
			if (treeContainerRef.current) {
				const { offsetWidth, offsetHeight } = treeContainerRef.current;
				treeComponentRef.current?.setState({
					translate: { x: offsetWidth / 2, y: offsetHeight / 2 },
				});
			}
		};

		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, []);

	const treeComponentRef = useRef<any>();
	const nodeSeparation = {
		siblings: 1.5, // Adjust this value to increase or decrease the distance between sibling nodes
		nonSiblings: 2, // Adjust this value to increase or decrease the distance between non-sibling nodes
	};

	const renderCustomNodeElement = (rd3tProps: any): JSX.Element => {
		return <HtmlNode {...rd3tProps} />;
	};

	return (
		form &&
		responseTreeNode && (
			<div className="MindMap" ref={treeContainerRef}>
				<Tree
					data={transformData(form, responseTreeNode)}
					orientation="vertical"
					translate={initialTranslate()}
					ref={treeComponentRef}
					separation={nodeSeparation}
					nodeSize={{ x: 200, y: 100 }}
					renderCustomNodeElement={renderCustomNodeElement} // Replace the default Node component with the custom HtmlNode component
				/>
			</div>
		)
	);
};

export default MindMap;
