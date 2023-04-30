import React, { useState, useEffect } from "react";
import { IForm } from "../../model/form/IForm";
import { fetchFormData } from "../../Api/ClanApi";
import { printContentToPdf } from "../../utils/PrintPdf";

const Clan: React.FC = () => {
	const [form, setForm] = useState<IForm | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAndSetFormData = async () => {
			try {
				const formData = await fetchFormData(1);
				setForm(formData);
			} catch (err) {
				setError((err as Error).message);
			}
		};

		fetchAndSetFormData();
	}, []);

	return (
		<div>
			{error && <p>Error: {error}</p>}
			{form && (
				<div>
					<h2>{form.title}</h2>
					<p>{form.description}</p>
					<ul>
						{form.questions.map((question) => (
							<li key={question.id}>
								{question.position}. {question.questionText} (
								{question.questionType})
							</li>
						))}
					</ul>
				</div>
			)}
			<div>
				<button onClick={printContentToPdf}>Print content to PDF</button>
				<div className="content">
					<h1>Your content here</h1>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
				</div>
			</div>
		</div>
	);
};

export default Clan;
