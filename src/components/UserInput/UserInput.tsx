import React, { useState } from "react";
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

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(event.target.value);
	};

	const handleButtonClick = () => {
		onSend(message);
		setMessage("");
	};

	return (
		<div className="input-container">
			<textarea
				className="user-input"
				placeholder={placeholder}
				value={message}
				onChange={handleInputChange}
			/>
			<button className="send-button" onClick={handleButtonClick}>
				Send
			</button>
		</div>
	);
};

export default UserInput;
