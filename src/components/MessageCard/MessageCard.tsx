import "./MessageCard.scss";
import { IMessageCardProps } from "./IMessageCardProps";

export enum MessageType {
	User = "user",
	App = "app",
}

const MessageCard: React.FC<IMessageCardProps> = ({
	type,
	message,
	className,
	name,
	imageSrc,
	additionalInfo,
}) => {
	const messageClass =
		type === MessageType.User ? "message-card--user" : "message-card--app";

	return (
		<div className={`message-card ${messageClass} ${className || ""}`}>
			<img className="message-card__image" src={imageSrc} alt={name} />
			<div className="message-card__content">
				<span className="message-card__name">{name}</span>
				<p className="message-card__text">{message}</p>
				{additionalInfo && (
					<div className="message-card__additional-content">
						{additionalInfo && additionalInfo.type === "image" && (
							<img
								src={additionalInfo.content}
								alt="Additional info"
								className="additional-content additional-content__image"
							/>
						)}
						{additionalInfo && additionalInfo.type === "text" && (
							<div className="additional-content additional-content__text">
								{additionalInfo.content}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default MessageCard;
