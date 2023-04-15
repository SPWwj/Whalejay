import React, { useState, useEffect } from "react";
import UserInput from "../../components/UserInput/UserInput";
import MessageCard, {
	MessageType,
} from "../../components/MessageCard/MessageCard";
import "./Main.scss";
import userImage from "../../assets/images/user-image.png";
import appImage from "../../assets/images/app-image.png";
import CommandParser from "../../utils/parser/CommandParser";
import openaiLogo from "../../assets/images/openai-logo.jpg";

interface AdditionalInfo {
	type: string;
	content: string;
}

interface ChatMessage {
	type: MessageType;
	text: string;
	additionalInfo?: AdditionalInfo;
}
const checkIfWebsiteIsAlive = async (url: string) => {
	try {
		const response = await fetch(url, { method: "HEAD" });
		console.log(response);
		if (response.ok || response.status === 404) {
			// Website is alive (including 404 status)
			return true;
		} else {
			// Website is not alive or returns another error status
			return false;
		}
	} catch (error) {
		// Network error or website is not reachable
		console.error("Error checking website status:", error);
		return false;
	}
};
const Main: React.FC = () => {
	const [isAlive, setIsAlive] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			type: MessageType.App,
			text: "正在唤醒中。。。请等候头像变化。",
		},
	]);
	const chatContainerRef = React.useRef<HTMLDivElement>(null);

	const url = "https://bitflow.azurewebsites.net";

	useEffect(() => {
		const checkWebsiteStatus = async () => {
			const result = await checkIfWebsiteIsAlive(url);
			if (result) {
				setIsAlive(true);
				clearInterval(intervalId); // Clear the interval when the website is alive
			}
		};

		const intervalId = setInterval(checkWebsiteStatus, 1000);

		// Clean up the interval when the component is unmounted or the URL changes
		return () => {
			clearInterval(intervalId);
		};
	}, [url]);
	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [messages]);
	if (isAlive === true) {
		const appReply: ChatMessage = {
			type: MessageType.App,
			text: "我睡醒了，有什么事吗？",
			// additionalInfo: {
			// 	type: "image",
			// 	content: imageUrl,
			// },
		};
		setMessages((prevMessages) => [...prevMessages, appReply]);
		// return <p>Checking website status...</p>;
	}
	// const commandParser = new CommandParser();

	const handleSendMessage = async (message: string) => {
		// Update the messages state with the new user message
		setMessages((prevMessages) => [
			...prevMessages,
			{ type: MessageType.User, text: message },
		]);

		const imageUrl =
			"https://pm1.narvii.com/6190/2e8c00ca75684e3396fa0fad4da308f3a6cf9451_hq.jpg"; // Replace with a valid image URL

		if (isAlive === false) {
			console.log("Not alive site");

			const appReply: ChatMessage = {
				type: MessageType.App,
				text: "还没醒，先等等~",
				// additionalInfo: {
				// 	type: "image",
				// 	content: imageUrl,
				// },
			};
			setMessages((prevMessages) => [...prevMessages, appReply]);
		} else if (message.toLowerCase() === "show image") {
			// Add an app reply with the image URL as additional information
			const appReply: ChatMessage = {
				type: MessageType.App,
				text: "Here is an image for you:",
				additionalInfo: {
					type: "image",
					content: imageUrl,
				},
			};
			setMessages((prevMessages) => [...prevMessages, appReply]);
		} else {
			try {
				const response = await fetch(
					`${url}/chatgpt/${encodeURIComponent(message)}`
				);
				console.log(response);

				if (response.ok) {
					const appReplyText = await response.text();
					const appReply: ChatMessage = {
						type: MessageType.App,
						text: appReplyText,
						// additionalInfo: {
						// 	type: "text",
						// 	content: "你好",
						// },
					};
					setMessages((prevMessages) => [...prevMessages, appReply]);
				} else {
					console.error("Error fetching data from API:", response.status);
				}
			} catch (error) {
				console.error("Error fetching data from API:", error);
			}
		}
	};

	const isLatestMessage = (index: number, type: MessageType) => {
		const latestIndexForType = messages
			.slice()
			.reverse()
			.findIndex((msg) => msg.type === type);
		const totalCount = messages.length;
		return totalCount - index - 1 === latestIndexForType;
	};

	return (
		<div className="page page--main">
			<div className="page-content">
				{/* ... */}
				<div ref={chatContainerRef} className="chat-container">
					{messages.map((msg, index) => (
						<React.Fragment key={index}>
							<MessageCard
								type={msg.type}
								message={msg.text}
								className={
									isLatestMessage(index, msg.type) ? "latest-message" : ""
								}
								name={msg.type === MessageType.User ? "User" : "App"}
								imageSrc={
									msg.type === MessageType.User
										? userImage
										: isAlive
										? openaiLogo
										: appImage
								}
							/>
							{msg.additionalInfo && msg.additionalInfo.type === "image" && (
								<img
									src={msg.additionalInfo.content}
									alt="Additional info"
									className="additional-content additional-content__image"
								/>
							)}
							{msg.additionalInfo && msg.additionalInfo.type === "text" && (
								<div className="additional-content additional-content__text">
									{msg.additionalInfo.content}
								</div>
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
