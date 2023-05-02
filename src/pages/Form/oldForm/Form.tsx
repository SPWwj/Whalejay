import React, { useState, useEffect, useRef } from "react";
import "./Form.scss";

import { fetchFormData } from "../api/FormApi";
import PrintButton from "../../../components/Buttons/PrintButton";
import ResponseForm from "./ResponseForm";
import { IResponse } from "../model/IResponse";
import { IForm } from "../model/IForm";
import SendIcon from "@mui/icons-material/Send";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const Form: React.FC = () => {
	const [form, setForm] = useState<IForm | null>(null);
	const [error, setError] = useState<string | null>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const [isSending, setIsSending] = useState(false);
	const [isRotated, setIsRotated] = useState(false);
	const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);

	const handleDragStart = (
		e: React.DragEvent<HTMLTableRowElement>,
		index: number
	) => {
		setDraggedRowIndex(index);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
		e.preventDefault();
	};

	const handleDrop = (
		e: React.DragEvent<HTMLTableRowElement>,
		index: number
	) => {
		e.preventDefault();
		if (draggedRowIndex !== null && index !== draggedRowIndex) {
			if (form) {
				const updatedResponses = [...form.responses];
				const temp = updatedResponses[draggedRowIndex];
				updatedResponses[draggedRowIndex] = updatedResponses[index];
				updatedResponses[index] = temp;

				// Update the state with the reordered responses
				setForm({
					...form,
					responses: updatedResponses,
					id: form.id!,
					title: form.title!,
					description: form.description!,
					createdAt: form.createdAt!,
					updatedAt: form.updatedAt!,
					questions: form.questions!,
				});
			}
		}
		setDraggedRowIndex(null);
	};
	const toggleRotation = () => {
		setIsRotated(!isRotated);
	};

	const fetchAndSetFormData = async () => {
		try {
			const formData = await fetchFormData(1);

			console.log(formData);
			formData.questions.sort((a, b) => a.position - b.position);
			formData.responses.sort(
				(a, b) =>
					new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
			);

			setForm(formData);
		} catch (err) {
			setError((err as Error).message);
		}
	};

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			fetchAndSetFormData();
			isFirstRender.current = false;
		}
	}, []);

	const onSubmit = async (response: IResponse) => {
		setIsSending(true);
		try {
			// Filter out answers with empty or null answerText
			const filteredAnswers = response.answers.filter(
				(answer) => answer.answerText && answer.answerText.trim() !== ""
			);

			// Update the response object with the filtered answers
			const updatedResponse: IResponse = {
				...response,
				answers: filteredAnswers,
			};

			// Call the API to submit the response here
			// Replace with the appropriate API function
			await submitResponse(updatedResponse);
			fetchAndSetFormData();
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setIsSending(false);
		}
	};
	const handleClick = () => {
		if (formRef.current) {
			formRef.current.requestSubmit();
		}
	};

	return (
		<div className="form-page">
			{error && <p>Error: {error}</p>}
			<div
				className={`form-wrapper ${isRotated ? "rotated-content" : ""}`}
				id="form-content"
			>
				{form && (
					<div>
						<h2>{form.title}</h2>
						<p>{form.description}</p>
						<table className="form-table">
							<thead>
								<tr>
									{form.questions.map((question) => (
										<th key={question.id}>{question.questionText}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{form.responses.map((response, index) => (
									<tr
										key={index}
										draggable
										onDragStart={(e) => handleDragStart(e, index)}
										onDragOver={(e) => handleDragOver(e)}
										onDrop={(e) => handleDrop(e, index)}
									>
										{form.questions.map((question, index) => {
											const answer = response.answers.find(
												(a) => a.questionId === question.id
											);
											return <td key={index}>{answer?.answerText || ""}</td>;
										})}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{form && (
				<ResponseForm
					formId={form.id}
					questions={form.questions}
					onSubmit={onSubmit}
					formRef={formRef}
				/>
			)}
			<div className="ButtonContainer">
				<PrintButton id="#form-content" />

				<Button
					variant="contained"
					color="primary"
					startIcon={<SendIcon />}
					onClick={handleClick}
					disabled={isSending}
				>
					{isSending ? <CircularProgress size={24} /> : "輸入"}
				</Button>
				<Button onClick={toggleRotation}>Toggle Rotation</Button>
			</div>
		</div>
	);
};

export default Form;
async function submitResponse(response: IResponse) {
	const apiUrl = "https://localhost:7276/api/Responses";

	try {
		const responseJson = await fetch(apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(response),
		});

		if (!responseJson.ok) {
			throw new Error("Failed to submit response");
		}

		const responseData = await responseJson.json();
		return responseData;
	} catch (error) {
		console.error("Error submitting response:", error);
		throw error;
	}
}
