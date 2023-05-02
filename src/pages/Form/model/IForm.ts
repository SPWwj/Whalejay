import { IQuestion } from "./IQuestion";
import { IResponse } from "./IResponse";

export interface IForm {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    questions: IQuestion[];
    responses: IResponse[];
}
