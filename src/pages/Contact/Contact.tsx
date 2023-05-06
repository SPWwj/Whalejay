import React, { useState } from "react";
import "./Contact.scss";

const Contact: React.FC = () => {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("Form submitted!");
	};
	const [text, setText] = useState("");

	const speak = () => {
		const speechSynthesis = window.speechSynthesis;
		const utterance = new SpeechSynthesisUtterance(text);
		speechSynthesis.speak(utterance);
	};
	return (
		<div>
			<input
				type="text"
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="Enter text to convert to voice"
			/>
			<button onClick={speak}>Speak</button>
		</div>
	);
};

export default Contact;
