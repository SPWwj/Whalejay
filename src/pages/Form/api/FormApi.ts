import { getFormUrl, postReponsesUrl } from "../../../api/Api";
import { IForm } from "../model/IForm";
import { IResponse } from "../model/IResponse";

export const fetchFormData = async (formId: number): Promise<IForm> => {
	const response = await fetch(getFormUrl(formId), {
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

export async function submitResponse(response: IResponse) {

	try {
		const responseJson = await fetch(postReponsesUrl, {
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
