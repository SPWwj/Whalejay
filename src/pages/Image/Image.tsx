import React, { useState, useEffect, useRef } from "react";
import UserInput from "../../components/UserInput/UserInput";
import MessageCard, {
	MessageType,
} from "../../components/MessageCard/MessageCard";
import "./Image.scss";
import userImage from "../../assets/images/user-image.png";
import appImage from "../../assets/images/app-image.png";
import openaiLogo from "../../assets/images/openai-logo.jpg";
import { IChatMessage } from "../../model/IChatMessage";
import { v4 as uuidv4 } from "uuid"; // Import UUID library to generate unique IDs
import { checkMainSiteAlive } from "../../api/ChatGptApi";
import { baseUrl } from "../../api/Api";

const Main: React.FC = () => {
	const [isAlive, setIsAlive] = useState(false);
	const hasExecutedCheck = useRef(false);

	const [messages, setMessages] = useState<IChatMessage[]>([
		{
			id: uuidv4(),
			type: MessageType.App,
			text: "正在唤醒中。。。请等候头像变化。",
		},
	]);
	const chatContainerRef = React.useRef<HTMLDivElement>(null);

	useEffect(() => {
		const checkWebsiteStatus = async () => {
			const result = await checkMainSiteAlive();
			if (result) {
				setIsAlive(true);
				const appReply: IChatMessage = {
					id: uuidv4(),
					type: MessageType.App,
					text: "我睡醒了，你可以用关键词生成图片...",
				};
				setMessages((prevMessages) => [...prevMessages, appReply]);
			}
		};

		// Only execute the checkWebsiteStatus function if it hasn't been executed yet
		if (!hasExecutedCheck.current) {
			checkWebsiteStatus();
			hasExecutedCheck.current = true;
		}

		// No need to return a cleanup function as there's no interval to clear
	}, []); // Empty dependency array
	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [messages]);

	// const commandParser = new CommandParser();

	const handleSendMessage = async (message: string) => {
		// Update the messages state with the new user message
		setMessages((prevMessages) => [
			...prevMessages,
			{ id: uuidv4(), type: MessageType.User, text: message },
		]);

		const imageUrl =
			"https://pm1.narvii.com/6190/2e8c00ca75684e3396fa0fad4da308f3a6cf9451_hq.jpg"; // Replace with a valid image URL

		if (isAlive === false) {
			console.log("Not alive site");

			const appReply: IChatMessage = {
				id: uuidv4(),
				type: MessageType.App,
				text: "还没醒，先等等~",
			};
			setMessages((prevMessages) => [...prevMessages, appReply]);
		} else if (message.toLowerCase() === "show image") {
			// Add an app reply with the image URL as additional information
			const appReply: IChatMessage = {
				id: uuidv4(),
				type: MessageType.App,
				text: "这是你的图片:",
				additionalInfo: {
					type: "image",
					content: imageUrl,
				},
			};
			setMessages((prevMessages) => [...prevMessages, appReply]);
		} else {
			try {
				const sanitizedMessage = message.replace(/[\n\r]+/g, " ");

				const requestBody = {
					prompt: encodeURIComponent(sanitizedMessage), // Replace with the desired prompt
					N: 1, // Number of images
					size: "512x512", // Image size
				};

				const response = await fetch(`${baseUrl}/image`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(requestBody),
				});

				if (response.ok) {
					const responseData = await response.json();
					console.log(responseData);
					const appReply: IChatMessage = {
						id: uuidv4(),
						type: MessageType.App,
						text: "Here is the generated image:",
						additionalInfo: {
							type: "image",
							content: responseData.data[0].url, // Assuming the API returns an array with image URLs
						},
					};
					setMessages((prevMessages) => [...prevMessages, appReply]);
				} else {
					console.error("Error fetching data from API:", response.status);
					const appReply: IChatMessage = {
						id: uuidv4(),
						type: MessageType.App,
						text: "出错啦",
					};
					setMessages((prevMessages) => [...prevMessages, appReply]);
				}
			} catch (error) {
				console.error("Error fetching data from API:", error);
				const appReply: IChatMessage = {
					id: uuidv4(),
					type: MessageType.App,
					text: "出错啦",
				};
				setMessages((prevMessages) => [...prevMessages, appReply]);
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
								additionalInfo={msg.additionalInfo}
							/>
						</React.Fragment>
					))}
				</div>
			</div>
			<UserInput onSend={handleSendMessage} />
		</div>
	);
};
export default Main;
