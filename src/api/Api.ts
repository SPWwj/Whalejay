// export const baseUrl = "https://localhost:7276";
// // export const baseUrl = "https://bitflow.azurewebsites.net";
export const baseUrl = process.env.REACT_APP_BASE_URL as string;

export const gptImageUrl = `${baseUrl}/api/chatgpt/image`;
export const gptChatUrl = (prompt: string) => `${baseUrl}/api/chatgpt/${prompt}`;
export const gptChatStreamUrl = "https://localhost:7276/api/ChatGPT/stream";


export const getFormUrl = (formId: number) => `${baseUrl}/api/Forms/${formId}`;

export const postReponsesUrl = `${baseUrl}/api/Responses`;
export const putAnswersUrl = `${baseUrl}/api/Answers/Bulk`;
export const deleteReponsesUrl = (id: number) => `${baseUrl}/api/Responses/${id}`;
export const gptChatWakeUrl = `${baseUrl}/api/chatgpt/wake`;
