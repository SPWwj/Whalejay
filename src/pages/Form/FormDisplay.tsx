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
            <div className="responses-wrapper">
                <h2 className="form_title">{form.title}</h2>
                {form.responses.map((response, responseIndex) => (
                    <React.Fragment key={responseIndex}>
                        {responseIndex > 0 && (responseIndex + 1) % 8 === 1 && (
                            <>
                                <div className="page-break"></div>
                                <h2 className="form_title new_page">{form.title}</h2>
                            </>
                        )}
                        <div className="response">
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
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default FormDisplay;
