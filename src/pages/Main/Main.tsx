import React, { useState } from "react";
import UserInput from "../../components/UserInput/UserInput";
import MessageCard, {
	MessageType,
} from "../../components/MessageCard/MessageCard";
import "./Main.scss";
import userImage from "../../assets/images/user-image.png";
import appImage from "../../assets/images/app-image.png";
import CommandParser from "../../utils/parser/CommandParser";

interface AdditionalInfo {
	type: string;
	content: string;
}

interface ChatMessage {
	type: MessageType;
	text: string;
	additionalInfo?: AdditionalInfo;
}

const Main: React.FC = () => {
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			type: MessageType.App,
			text: "Welcome to our app! How can we help you today?",
		},
	]);
	const commandParser = new CommandParser();

	const handleSendMessage = (message: string) => {
		// Update the messages state with the new user message

		setMessages((prevMessages) => [
			{ type: MessageType.User, text: message },
			...prevMessages,
		]);
		let appReply: ChatMessage;
		// Check if the user typed "Show image"
		if (message.toLowerCase() === "show image") {
			const imageUrl =
				"https://pm1.narvii.com/6190/2e8c00ca75684e3396fa0fad4da308f3a6cf9451_hq.jpg"; // Replace with a valid image URL

			// Add an app reply with the image URL as additional information
			appReply = {
				type: MessageType.App,
				text: "Here is an image for you:",
				additionalInfo: {
					type: "image",
					content: imageUrl,
				},
			};
		} else {
			// Process the user message and get app feedback
			const appFeedback = commandParser.parse(message)?.execute();
			appReply = {
				type: MessageType.App,
				text: appFeedback ?? "Command not recognized",
			};
		}

		setTimeout(() => {
			setMessages((prevMessages) => [appReply, ...prevMessages]);
		}, 0.2);
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
						<React.Fragment key={index}>
							<MessageCard
								type={msg.type}
								message={msg.text}
								className={
									isLatestMessage(index, msg.type) ? "latest-message" : ""
								}
								name={msg.type === MessageType.User ? "User" : "App"}
								imageSrc={msg.type === MessageType.User ? userImage : appImage}
							/>
							{msg.additionalInfo && msg.additionalInfo.type === "image" && (
								<img
									src={msg.additionalInfo.content}
									alt="Additional info"
									style={{
										maxWidth: "100%",
										maxHeight: "200px",
										alignSelf: "flex-start",
										margin: "0.5rem",
									}}
								/>
							)}
						</React.Fragment>
					))}
				</div>
			</div>
			<UserInput onSend={handleSendMessage} />
		</div>
	);
};
export default Main;
