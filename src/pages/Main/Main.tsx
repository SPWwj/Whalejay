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
import { checkMainSiteAlive, fetchMessage } from "../../api/ChatGptApi";
import {
	AWAKED_NOTICE,
	AWAKED_TO_RESPOND_NOTICE,
	AWAKING_INPROGRESS_NOTICE,
	AWAKING_START_NOTICE,
} from "../../text/text";

const Main: React.FC = () => {
	const [isAlive, setIsAlive] = useState(false);
	const hasExecutedCheck = useRef(false);

	const [messages, setMessages] = useState<IChatMessage[]>([
		{
			id: uuidv4(),
			type: MessageType.App,
			text: AWAKING_START_NOTICE,
		},
	]);
	const chatContainerRef = React.useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Handle setting user language

		// Handle checking website status
		const checkWebsiteStatus = async () => {
			const result = await checkMainSiteAlive();
			if (result) {
				setIsAlive(true);
				const appReply: IChatMessage = {
					id: uuidv4(),
					type: MessageType.App,
					text: AWAKED_NOTICE,
				};
				setMessages((prevMessages) => [...prevMessages, appReply]);
			}
		};

		if (!hasExecutedCheck.current) {
			checkWebsiteStatus();
			hasExecutedCheck.current = true;
		}

		// Handle scrolling chat container
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [isAlive, messages]);

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
				text: AWAKING_INPROGRESS_NOTICE,
			};
			checkMainSiteAlive().then(() => {
				appReply.text = AWAKED_TO_RESPOND_NOTICE;
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
