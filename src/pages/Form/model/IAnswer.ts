export interface IAnswer {
    id: number;
    responseId: number;
    questionId: number;
    optionId?: number;
    answerText: string;
}