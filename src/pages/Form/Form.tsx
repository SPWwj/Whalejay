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


export default function ReactVirtualizedTable() {
	const [isSending, setIsSending] = useState(false);
	const [form, setForm] = useState<IForm | null>(null);
	const [error, setError] = useState<string | null>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const [answers, setAnswers] = useState<IAnswer[]>([]);
	const [errorDialogOpen, setErrorDialogOpen] = useState(false);

	const fetchAndSetFormData = async () => {
		try {
			const formData = await fetchFormData(1);

			//console.log(formData);
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
			formRef.current?.reset();
		}
	};
	const handleClick = () => {
		if (formRef.current) {
			formRef.current.requestSubmit();
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
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

	return (
		<div>
			<h1>只顯示你輸入成功的數據,不保存數據:</h1>
			<Dialog
				open={errorDialogOpen}
				onClose={() => setErrorDialogOpen(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">警告</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{error}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setErrorDialogOpen(false)} color="primary">
						关闭
					</Button>
				</DialogActions>
			</Dialog>

			<div className={styles.form_paper}>
				<TableContainer
					component={Paper}
					id="form_content"
					className={styles.form_paper}
				>
					<Table>
						<TableHead>
							<TableRow>
								{/* <TableCell>Dessert (100g serving)</TableCell> */}
								{form?.questions.map((question) => (
									<TableCell
										className={styles.form_header_cell}
										key={question.id}
										align="right"
									>
										{question.questionText}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{form?.responses.map((response, index) => (
								<TableRow key={index}>
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
												{answer?.answerText || ""}
											</TableCell>
										);
									})}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				<form ref={formRef} onSubmit={handleSubmit}>
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
					<PrintButton id="#to_print" />

					<Button
						variant="contained"
						color="primary"
						startIcon={<SendIcon />}
						onClick={handleClick}
						disabled={isSending}
					>
						{isSending ? <CircularProgress size={24} /> : "輸入"}
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
			</div>
		</div>
	);
}
