import { MessageType } from "../components/MessageCard/MessageCard";
import { IChatMessage } from "../model/IChatMessage";
import { createPromptJson, PromptJson } from "../model/PromptJson";
import { baseUrl, gptChatUrl, gptImageUrl } from "./Api";




export const checkIfWebsiteIsAlive = async (url: string) => {
	try {
		const response = await fetch(url, { method: "HEAD" });
		if (response.ok) {
			// Website is alive
			return true;
		} else {
			// Website is not alive or returns another error status
			return true;
		}
	} catch (error) {
		// Network error or website is not reachable
		//console.error("Error checking website status:", error);
		return false;
	}
};

export const checkMainSiteAlive = async () => {
	return checkIfWebsiteIsAlive(baseUrl);
}

export const fetchMessage = async (
	messageId: string,
	message: string
): Promise<IChatMessage> => {
	let appReply: IChatMessage = {
		id: messageId,
		type: MessageType.App,
		text: "Loading",
	};
	try {
		const prompt = createPromptJson(message);
		//console.log("this is prompt ", prompt);

		const sanitizedMessage = prompt.replace(/\r?\n|\r/g, " ");

		const response = await fetch(
			gptChatUrl(encodeURIComponent(sanitizedMessage))
		);

		//console.log("this is response ", response);
		if (response.ok) {
			const respondTest = await response.text();
			//console.log("text ", respondTest);
			const cleanedJsonString = respondTest.replace(/,\s*([\]}])/g, "$1");
			//console.log("cleanedJsonString ", respondTest);

			const updatedPromptJSON: PromptJson = JSON.parse(cleanedJsonString);
			appReply.text = updatedPromptJSON.Feedback;

			if (
				updatedPromptJSON.Command &&
				updatedPromptJSON.Command.GenerateImage &&
				updatedPromptJSON.Command.GenerateImage.status === true
			) {
				try {
					const requestBody = {
						prompt: encodeURIComponent(
							updatedPromptJSON.Command.GenerateImage.keyword ?? "?"
						), // Replace with the desired prompt
						N: 1, // Number of images
						size: "512x512", // Image size
					};

					const response = await fetch(gptImageUrl, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(requestBody),
					});

					if (response.ok) {
						const responseData = await response.json();
						appReply.additionalInfo = {
							type: "image",
							content: responseData.data[0].url, // Assuming the API returns an array with image URLs
						};
					} else {
						//console.error("Error fetching data from API:", response.status);
						appReply.text = "出错啦";
					}
				} catch (error) {
					//console.error("Error fetching data from API:", error);
					appReply.text = "出错啦";
				}
			}
		} else {
			appReply.text = "出错啦";
		}
	} catch (error) {
		//console.log("error", error);
		appReply.text = "出错啦";
	}
	return appReply;
};