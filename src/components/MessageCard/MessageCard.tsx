import React from "react";
import "./MessageCard.scss";

export enum MessageType {
	User = "user",
	App = "app",
}

interface MessageCardProps {
	type: MessageType;
	message: string;
	className?: string;
	name: string;
	imageSrc: string;
}

const MessageCard: React.FC<MessageCardProps> = ({
	type,
	message,
	className,
	name,
	imageSrc,
}) => {
	const messageClass =
		type === MessageType.User ? "message-card--user" : "message-card--app";

	return (
		<div className={`message-card ${messageClass} ${className || ""}`}>
			<img className="message-card__image" src={imageSrc} alt={name} />
			<div className="message-card__content">
				<span className="message-card__name">{name}</span>
				<p className="message-card__text">{message}</p>
			</div>
		</div>
	);
};

export default MessageCard;
