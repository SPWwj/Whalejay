// FormDisplay.tsx
import React from "react";
import "./FormDisplay.scss";
import { IForm } from "./model/IForm";
import { IResponse } from "./model/IResponse";

interface FormDisplayProps {
	form: IForm | null;
}

const FormDisplay: React.FC<FormDisplayProps> = ({ form }) => {
	if (!form) {
		return <div>No form data available.</div>;
	}

	const findAnswerText = (
		response: IResponse,
		questionId: number
	): string | null => {
		const answer = response.answers.find((a) => a.questionId === questionId);
		return answer ? answer.answerText : null;
	};

	return (
		<div className="form-display">
			<h2>{form.title}</h2>
			<div className="responses-wrapper">
				{form.responses.map((response, responseIndex) => (
					<div key={responseIndex} className="response">
						<h3>
							{(findAnswerText(response, form.questions[0].id) ?? "") +
								" " +
								(findAnswerText(response, form.questions[1].id) ?? "")}
						</h3>
						{form.questions
							.slice(2)
							.reduce((accumulator: React.ReactNode[], question, index) => {
								const answerText = findAnswerText(response, question.id);
								if (answerText !== null) {
									accumulator.push(
										<div
											key={response.id + "" + question.id + "f"}
											className="question-answer"
										>
											{accumulator.length + 1}. {question.questionText}:{" "}
											{answerText}
										</div>
									);
								}
								return accumulator;
							}, [])}
					</div>
				))}
			</div>
		</div>
	);
};

export default FormDisplay;
