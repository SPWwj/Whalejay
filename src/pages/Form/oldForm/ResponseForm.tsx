import React, { useState } from "react";
import { IAnswer } from "../model/IAnswer";
import { IQuestion } from "../model/IQuestion";
import { IResponse } from "../model/IResponse";

interface Props {
	formId: number;
	questions: IQuestion[]; // Add questions prop
	onSubmit: (response: IResponse) => void;
	formRef: React.RefObject<HTMLFormElement>;
}

const ResponseForm: React.FC<Props> = ({
	formId,
	questions,
	onSubmit,
	formRef,
}) => {
	const [answers, setAnswers] = useState<IAnswer[]>(
		questions.map((question) => ({
			id: 0,
			responseId: 0,
			questionId: question.id,
			answerText: "",
		}))
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Submitting form");

		const response: IResponse = {
			id: 0,
			formId,
			submittedAt: new Date().toISOString(),
			answers,
		};

		onSubmit(response);
	};

	const handleAnswerChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const newAnswers = [...answers];
		newAnswers[index].answerText = e.target.value;
		setAnswers(newAnswers);
	};

	return (
		<form className="form-wrapper" onSubmit={handleSubmit} ref={formRef}>
			<table className="form-table">
				<tbody>
					<tr>
						{questions.map((question, index) => {
							const answerIndex = answers.findIndex(
								(answer) => answer.questionId === question.id
							);
							return (
								<td key={index}>
									<input
										type="text"
										value={answers[answerIndex]?.answerText || ""}
										onChange={(e) => handleAnswerChange(e, answerIndex)}
									/>
								</td>
							);
						})}
					</tr>
				</tbody>
			</table>
		</form>
	);
};

export default ResponseForm;
