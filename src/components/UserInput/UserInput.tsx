import React, { useState, useRef, useEffect } from "react";
import "./UserInput.scss";

interface UserInputProps {
	placeholder?: string;
	onSend: (message: string) => void;
}

const UserInput: React.FC<UserInputProps> = ({
	placeholder = "Type your message...",
	onSend,
}) => {
	const [message, setMessage] = useState("");
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(event.target.value);
	};

	const handleButtonClick = () => {
		onSend(message);
		setMessage("");
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleButtonClick();
		}
	};

	useEffect(() => {
		if (textAreaRef.current) {
			textAreaRef.current.style.height = "auto"; // Reset height to auto
			textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set the height to match the content
		}
	}, [message]);

	return (
		<div className="input-container">
			<textarea
				ref={textAreaRef}
				className="user-input"
				placeholder={placeholder}
				value={message}
				onChange={handleInputChange}
				onKeyDown={handleKeyPress}
			/>

			<button className="send-button" onClick={handleButtonClick}>
				Send
			</button>
		</div>
	);
};

export default UserInput;
