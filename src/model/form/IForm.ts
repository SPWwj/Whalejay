import { IQuestion } from "./IQuestion";

export interface IForm {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    questions: IQuestion[];
}
