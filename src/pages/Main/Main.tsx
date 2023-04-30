import React, { useState, useEffect, useRef } from "react";
import UserInput from "../../components/UserInput/UserInput";
import MessageCard, {
	MessageType,
} from "../../components/MessageCard/MessageCard";
import "./Main.scss";
import userImage from "../../assets/images/user-image.png";
import appImage from "../../assets/images/app-image.png";
import openaiLogo from "../../assets/images/openai-logo.jpg";
import { v4 as uuidv4 } from "uuid"; // Import UUID library to generate unique IDs
import { IChatMessage } from "../../model/IChatMessage";
import { PromptJson, createPromptJson } from "../../model/PromptJson";

const checkIfWebsiteIsAlive = async (url: string) => {
	try {
		const response = await fetch(url, { method: "HEAD" });
		if (response.ok) {
			// Website is alive
			return true;
		} else {
			// Website is not alive or returns another error status
			return true;
		}
	} catch (error) {
		// Network error or website is not reachable
		console.error("Error checking website status:", error);
		return false;
	}
};
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

	const url = "https://bitflow.azurewebsites.net";

	useEffect(() => {
		const checkWebsiteStatus = async () => {
			const result = await checkIfWebsiteIsAlive(url);
			if (result) {
				setIsAlive(true);
				const appReply: IChatMessage = {
					id: uuidv4(),
					type: MessageType.App,
					text: "我睡醒了，有什么事吗？",
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
	}, [isAlive]); // Empty dependency array

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
		const messageId = uuidv4();
		if (isAlive === false) {
			let appReply: IChatMessage = {
				id: messageId,
				type: MessageType.App,
				text: "还没醒，先等等~， 我又搓了它一下",
			};
			checkIfWebsiteIsAlive(url).then(() => {
				appReply.text = "啊被戳醒了~";
				setMessages((prevMessages) => [...prevMessages, appReply]);
			});
			setMessages((prevMessages) => [...prevMessages, appReply]);
		} else {
			let appReply: IChatMessage = {
				id: messageId,
				type: MessageType.App,
				text: "Loading",
			};

			setMessages((prevMessages) => [...prevMessages, appReply]);

			fetchMessage(messageId, message).then((updatedReply) => {
				appReply = updatedReply;
				setMessages((prevMessages) =>
					prevMessages.map((msg) => (msg.id === messageId ? appReply : msg))
				);
			});
		}
	};
	const fetchMessage = async (
		messageId: string,
		message: string
	): Promise<IChatMessage> => {
		let appReply: IChatMessage = {
			id: messageId,
			type: MessageType.App,
			text: "Loading",
		};
		try {
			const prompt = createPromptJson(message);
			console.log("this is prompt ", prompt);

			const sanitizedMessage = prompt.replace(/\r?\n|\r/g, " ");

			const response = await fetch(
				`${url}/chatgpt/${encodeURIComponent(sanitizedMessage)}`
			);

			console.log("this is response ", response);
			if (response.ok) {
				const respondTest = await response.text();
				console.log("text ", respondTest);
				const cleanedJsonString = respondTest.replace(/,\s*([\]}])/g, "$1");
				console.log("cleanedJsonString ", respondTest);

				const updatedPromptJSON: PromptJson = JSON.parse(cleanedJsonString);
				appReply.text = updatedPromptJSON.Feedback;

				if (
					updatedPromptJSON.Command &&
					updatedPromptJSON.Command.GenerateImage &&
					updatedPromptJSON.Command.GenerateImage.status === true
				) {
					try {
						const requestBody = {
							prompt: encodeURIComponent(
								updatedPromptJSON.Command.GenerateImage.keyword ?? "?"
							), // Replace with the desired prompt
							N: 1, // Number of images
							size: "512x512", // Image size
						};

						const response = await fetch(`${url}/image`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(requestBody),
						});

						if (response.ok) {
							const responseData = await response.json();
							appReply.additionalInfo = {
								type: "image",
								content: responseData.data[0].url, // Assuming the API returns an array with image URLs
							};
						} else {
							console.error("Error fetching data from API:", response.status);
							appReply.text = "出错啦";
						}
					} catch (error) {
						console.error("Error fetching data from API:", error);
						appReply.text = "出错啦";
					}
				}
			} else {
				appReply.text = "出错啦";
			}
		} catch (error) {
			console.log("error", error);
			appReply.text = "出错啦";
		}
		return appReply;
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
