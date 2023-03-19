import React, { useState } from "react";
import UserInput from "../../components/UserInput/UserInput";
import MessageCard, {
	MessageType,
} from "../../components/MessageCard/MessageCard";
import "./Main.scss";
interface ChatMessage {
	type: MessageType;
	text: string;
}

const Main: React.FC = () => {
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	const handleSendMessage = (message: string) => {
		// Update the messages state with the new user message
		setMessages((prevMessages) => [
			{ type: MessageType.User, text: message },
			...prevMessages,
		]);

		// Simulate an app reply with the same text as the user message
		const appReply: ChatMessage = { type: MessageType.App, text: message };
		setTimeout(() => {
			setMessages((prevMessages) => [appReply, ...prevMessages]);
		}, 1000);
	};
	const isLatestMessage = (index: number, type: MessageType) => {
		const latestIndexForType = messages.findIndex((msg) => msg.type === type);
		if (type === MessageType.App) {
			const latestUserIndex = messages.findIndex(
				(msg) => msg.type === MessageType.User
			);
			return (
				index === latestIndexForType && latestIndexForType < latestUserIndex
			);
		}
		return index === latestIndexForType;
	};
	return (
		<div className="page page--main">
			<div className="page-content">
				{/* ... */}
				<div className="chat-container">
					{messages.map((msg, index) => (
						<MessageCard
							key={index}
							type={msg.type}
							message={msg.text}
							className={
								isLatestMessage(index, msg.type) ? "latest-message" : ""
							}
							name={msg.type === MessageType.User ? "User" : "App"}
							imageSrc={
								msg.type === MessageType.User
									? "/images/user-image.png"
									: "/images/app-image.png"
							}
						/>
					))}
				</div>
			</div>
			<UserInput onSend={handleSendMessage} />
		</div>
	);
};
export default Main;
