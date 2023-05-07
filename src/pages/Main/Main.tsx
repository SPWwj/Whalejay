import React, { useState, useEffect, useRef, useMemo } from "react";
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
import { AWAKING_START_NOTICE } from "../../text/text";
import CommandPipeline from "../../utils/Pipeline/CommandPipeline";
import { WakeupCommand } from "../../utils/commands/WakeupCommand";
import { Command } from "../../utils/commands/Command";

const Main: React.FC = () => {
	const [isAlive, setIsAlive] = useState(false);
	const hasExecutedCheck = useRef(false);
	const [isStreaming, setIsStreaming] = useState(false);

	const [messages, setMessages] = useState<IChatMessage[]>([
		{
			id: uuidv4(),
			type: MessageType.App,
			text: AWAKING_START_NOTICE,
		},
	]);
	const chatContainerRef = React.useRef<HTMLDivElement>(null);
	const commandRef = useRef<Command | null>(null);

	const wakeCommand = useMemo(() => new WakeupCommand(), []);

	useEffect(() => {
		// Handle checking website status
		const checkWebsiteStatus = async () => {
			await wakeCommand.execute(setMessages, () => {
				setIsAlive(true);
			});
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
	}, [isAlive, messages, wakeCommand]);

	const handleSendMessage = async (message: string) => {
		// Update the messages state with the new user message
		setMessages((prevMessages) => [
			...prevMessages,
			{ id: uuidv4(), type: MessageType.User, text: message },
		]);
		if (isAlive === false) {
			await wakeCommand.execute(setMessages, () => {
				setIsAlive(true);
			});
		} else {
			setIsStreaming(true);
			const command = CommandPipeline.process(message);
			command?.execute(setMessages, () => {
				setIsStreaming(false);
			});
			commandRef.current = command;
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

	const handleStopButtonClick = () => {
		// Stop the stream
		if (commandRef.current) {
			commandRef.current.interrupt();
			commandRef.current = null;
		}
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
			<UserInput
				onSend={handleSendMessage}
				onStop={handleStopButtonClick}
				isStreaming={isStreaming}
			/>
		</div>
	);
};
export default Main;
