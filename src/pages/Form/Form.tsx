import styles from "./Form.module.scss";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useRef, useState } from "react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	CircularProgress,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import PrintButton from "../../components/Buttons/PrintButton";
import SendIcon from "@mui/icons-material/Send";
import { fetchFormData, submitResponse } from "./api/FormApi";
import { IForm } from "./model/IForm";
import { IResponse } from "./model/IResponse";
import { IAnswer } from "./model/IAnswer";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormDisplay from "./FormDisplay";
import { deleteReponsesUrl, putAnswersUrl } from "../../api/Api";
import MindMap from "./MindMap/MindMap";

export default function ReactVirtualizedTable() {
	const [isSending, setIsSending] = useState(false);
	const [form, setForm] = useState<IForm | null>(null);
	const [error, setError] = useState<string | null>(null);
	const formAnswerRef = useRef<HTMLFormElement>(null);
	const [answers, setAnswers] = useState<IAnswer[]>([]);
	const [errorDialogOpen, setErrorDialogOpen] = useState(false);
	const [editing, setEditing] = useState(false);
	const [displayId, setdisplayId] = useState(false);
	const [updatedAnswers, setUpdatedAnswers] = useState<IAnswer[]>([]);

	const fetchAndSetFormData = async () => {
		try {
			const formData = await fetchFormData(1);

			// console.log(formData);
			formData.questions.sort((a, b) => a.position - b.position);
			formData.responses.sort(
				(a, b) =>
					new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
			);

			setForm(formData);
			setAnswers(
				formData.questions.map((question) => ({
					id: 0,
					responseId: 0,
					questionId: question.id,
					answerText: "",
				}))
			);
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
			if (filteredAnswers.length <= 0) throw new Error("不能为空！");

			// Update the response object with the filtered answers
			const updatedResponse: IResponse = {
				...response,
				answers: filteredAnswers,
			};

			// Call the API to submit the response here
			// Replace with the appropriate API function
			await submitResponse(updatedResponse);
			setForm((prevForm) => {
				if (!prevForm) return null;

				// Add the updatedResponse to the form.responses array
				const updatedResponses = [...prevForm.responses, updatedResponse];

				return { ...prevForm, responses: updatedResponses };
			});
			// fetchAndSetFormData();
		} catch (err) {
			setError((err as Error).message);
			setError((err as Error).message);
			setErrorDialogOpen(true);
			console.log(err);
		} finally {
			setIsSending(false);
			const newAnswers = answers.map((answer) => ({
				...answer,
				answerText: "",
			}));
			setAnswers(newAnswers);
			formAnswerRef.current?.reset();
		}
	};

	const handleSubmitAnswer = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Submitting form");
		if (form === null) return;
		const response: IResponse = {
			id: 0,
			formId: form.id,
			submittedAt: new Date().toISOString(),
			answers,
		};

		onSubmit(response);
	};
	const handleAnswerChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		index: number
	) => {
		const newAnswers = [...answers];
		newAnswers[index].answerText = e.target.value;
		setAnswers(newAnswers);
	};
	const handleFormInputChange = (
		id: number,
		responseId: number,
		questionId: number,
		newValue: string
	) => {
		// Update the state with the new value for the corresponding question and response
		setUpdatedAnswers((prevAnswers) => {
			const answerIndex = prevAnswers.findIndex(
				(answer) =>
					answer.responseId === responseId && answer.questionId === questionId
			);
			if (answerIndex >= 0) {
				// Update the existing answer with the new value
				return prevAnswers.map((answer, index) =>
					index === answerIndex ? { ...answer, answerText: newValue } : answer
				);
			} else {
				// Add a new answer to the array
				return [
					...prevAnswers,
					{
						id,
						responseId,
						questionId,
						answerText: newValue,
					},
				];
			}
		});
	};
	const handleEditClick = () => {
		setEditing(!editing);
	};
	const handleIdClick = () => {
		setdisplayId(!displayId);
	};
	const handleFormSaveClick = async (event: React.FormEvent) => {
		event.preventDefault();
		// Submit the updated data to the server
		console.log("Submitting updated data to the server");
		//console.log(updatedAnswers);
		try {
			const response = await fetch(putAnswersUrl, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedAnswers),
			});
			if (response.ok) {
				fetchAndSetFormData();
				console.log("Data successfully submitted to the server");
			} else {
				console.error("Failed to submit data to the server");
			}
		} catch (error) {
			console.error("Error submitting data to the server:", error);
		} finally {
			setEditing(false);
		}
	};
	const handleDeleteClick = async (responseId: number) => {
		// Delete the response from the server
		console.log("Deleting response from the server");
		try {
			const response = await fetch(deleteReponsesUrl(responseId), {
				method: "DELETE",
			});
			if (response.ok) {
				console.log("Response successfully deleted from the server");
				// Update the component state
				fetchAndSetFormData();
			} else {
				console.error("Failed to delete response from the server");
			}
		} catch (error) {
			console.error("Error deleting response from the server:", error);
		}
	};

	return (
		<div>
		
			<h1>Personal Private Server! Do not provide sensitive Data!:</h1>
			<h1>{displayId && `ID: ${form?.id}`} { form?.title}:</h1>
			<Dialog
				open={errorDialogOpen}
				onClose={() => setErrorDialogOpen(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Warning</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{error}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setErrorDialogOpen(false)} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>

			<div className={styles.form_paper}>
				<TableContainer
					component={Paper}
					id="form_content"
					className={styles.form_paper}
				>
					<form onSubmit={handleFormSaveClick}>
						<Table>
							<TableHead>
								<TableRow>
									{displayId && (
										<TableCell
											align="right"
											className={styles.form_header_cell}
										>
											ID
										</TableCell>
									)}									{form?.questions.map((question) => (
										<TableCell
											className={styles.form_header_cell}
											key={question.id}
											align="right"
										>
											{question.questionText}{displayId && (` (${question.id})`) }
										</TableCell>
									))}
									{editing && (
										<TableCell
											align="right"
											className={styles.form_header_cell}
										>
											Command
										</TableCell>
									)}
								</TableRow>
							</TableHead>
							<TableBody>
								{form?.responses.map((response, index) => (
									<TableRow key={index}>
										{displayId && (
											<TableCell className={styles.form_data_cell} align="left">
												{response.id }
											</TableCell>
										)}
										{form.questions.map((question, index) => {
											const answer = response.answers.find(
												(a) => a.questionId === question.id
											);
											return (

												<TableCell
													className={styles.form_data_cell}
													key={index}
													align="right"
												>
													{editing ? (
														<input
															type="text"
															defaultValue={answer?.answerText || ""}
															onChange={(e) =>
																handleFormInputChange(
																	answer?.id ?? 0,
																	response?.id,
																	question.id,
																	e.target.value
																)
															}
														/>
													) : (
														answer?.answerText || ""
													)}
												</TableCell>
											);
										})}
										{editing && (
											<TableCell className={styles.form_data_cell} align="left">
												<button
													type="button"
													onClick={() => handleDeleteClick(response.id)}
												>
													Delete
												</button>
											</TableCell>
										)}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</form>
				</TableContainer>

				<form ref={formAnswerRef} onSubmit={handleSubmitAnswer}>
					<Grid container spacing={2} className={styles.newEntryRow}>
						{answers?.map((answer, answerIndex) => (
							<Grid item key={answer.questionId}>
								<TextField
									label={
										form?.questions.find(
											(question) => question.id === answer.questionId
										)?.questionText
									}
									variant="outlined"
									size="small"
									onChange={(e) => handleAnswerChange(e, answerIndex)}
								/>
							</Grid>
						))}
					</Grid>
				</form>
				<div className={styles.ButtonContainer}>
					<PrintButton id="to_print" />
					<Button onClick={handleIdClick}>
						{!displayId ? "Display Id" : "Hide Id"}
					</Button>
					<Button onClick={handleEditClick}>
						{editing ? "Cancel" : "Edit"}
					</Button>
					{editing && <Button onClick={handleFormSaveClick}>Save</Button>}

					<Button
						variant="contained"
						color="primary"
						startIcon={<SendIcon />}
						onClick={handleSubmitAnswer}
						disabled={isSending}
					>
						{isSending ? <CircularProgress size={24} /> : "Send"}
					</Button>
				</div>
				<Accordion className={styles.accordion_root}>
					<AccordionSummary
						className={styles.accordion_summary}
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						<Typography className={styles.summary_text}>打印樣式</Typography>
					</AccordionSummary>
					<AccordionDetails className={styles.accordion_details} id="to_print">
						<FormDisplay form={form} />
					</AccordionDetails>
				</Accordion>
				<div id="graph_to_print">
					<MindMap form={form} />
				</div>
			</div>
		</div>
	);
}
