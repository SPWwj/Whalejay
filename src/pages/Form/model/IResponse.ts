import { IAnswer } from "./IAnswer";

export interface IResponse {
    id: number;
    formId: number;
    respondentId?: number;
    submittedAt: string;
    answers: IAnswer[];
}