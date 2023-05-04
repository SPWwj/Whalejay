// export const baseUrl = "https://localhost:7276";
// // export const baseUrl = "https://bitflow.azurewebsites.net";
export const baseUrl = process.env.REACT_APP_BASE_URL as string;

export const gptImageUrl = `${baseUrl}/image`;
export const gptChatUrl = (prompt: string) => `${baseUrl}/chatgpt/${prompt}`;

export const getFormUrl = (formId: number) => `${baseUrl}/api/Forms/${formId}`;

export const postReponsesUrl = `${baseUrl}/api/Responses`;
export const putAnswersUrl = `${baseUrl}/api/Answers/Bulk`;
export const deleteReponsesUrl = (id: number) => `${baseUrl}/api/Responses/${id}`;
