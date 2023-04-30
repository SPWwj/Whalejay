import { IForm } from "../model/form/IForm";

export const fetchFormData = async (formId: number): Promise<IForm> => {
    const response = await fetch(`https://localhost:7276/api/Forms/${formId}`, {
        method: 'GET',
        headers: {
            'accept': 'text/plain'
        }
    });

    if (!response.ok) {
        throw new Error(`Error fetching form data: ${response.statusText}`);
    }

    const data: IForm = await response.json();
    return data;
};