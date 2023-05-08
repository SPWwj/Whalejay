import "./MessageCard.scss";
import { IMessageCardProps } from "./IMessageCardProps";
import { useState } from "react";
import placeholderImage from "../../assets/images/placeholder.png";

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
	const [imageLoaded, setImageLoaded] = useState<boolean>(false);

	const messageClass =
		type === MessageType.User ? "message-card--user" : "message-card--app";
	const handleImageLoad = () => {
		setImageLoaded(true);
	};

	const handleUserInfoClick = () => {
		console.log("User info clicked");
		// You can add any functionality you want to execute when the user info is clicked
	};
	return (
		<div className={`message-card ${messageClass} ${className || ""}`}>
			<div className="message-card__user-info" onClick={handleUserInfoClick}>
				<img className="message-card__image" src={imageSrc} alt={name} />
				<span className="message-card__name">{name}</span>
			</div>

			<div className="message-card__content">
				<p
					className="message-card__text"
					dangerouslySetInnerHTML={{ __html: message }}
				></p>
				{additionalInfo && (
					<div className="message-card__additional-content">
						{additionalInfo && additionalInfo.type === "image" && (
							<img
								src={imageLoaded ? additionalInfo.content : placeholderImage}
								alt="Additional info"
								className="additional-content additional-content__image"
								onLoad={handleImageLoad}
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
