import React from "react";
import "./Contact.scss";

const Contact: React.FC = () => {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("Form submitted!");
	};

	return (
		<div className="page page--contact">
			<h2>Contact Us</h2>
			<form className="page--contact__form" onSubmit={handleSubmit}>
				<label>
					Name:
					<input type="text" name="name" required />
				</label>
				<label>
					Email:
					<input type="email" name="email" required />
				</label>
				<label>
					Message:
					<textarea name="message" rows={5} required></textarea>
				</label>
				<button type="submit">Send</button>
			</form>
		</div>
	);
};

export default Contact;
