import { Dispatch, SetStateAction } from "react";
import { AiCommand } from "./Command";
import { baseUrl } from "../../api/Api";
import { MessageType } from "../../components/MessageCard/MessageCard";
import { IChatMessage } from "../../model/IChatMessage";
import { v4 } from "uuid";

export class GenerateImageCommand extends AiCommand {
    private userInput: string;

    static Create(userInput: string): GenerateImageCommand | null {
        const imageRegex = /^\/image\s+(.+)/i;
        const match = userInput.match(imageRegex);

        if (match) {
            return new GenerateImageCommand(match[1]);
        }

        return null;
    }

    private constructor(userInput: string) {
        super();
        this.userInput = userInput;
    }
    async execute(setStateFunctions: Dispatch<SetStateAction<IChatMessage[]>>): Promise<void> {
        try {
            const sanitizedMessage = this.userInput.replace(/[\n\r]+/g, " ");

            const requestBody = {
                prompt: encodeURIComponent(sanitizedMessage), // Replace with the desired prompt
                N: 1, // Number of images
                size: "512x512", // Image size
            };

            const response = await fetch(`${baseUrl}/image`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const responseData = await response.json();
                const appReply: IChatMessage = {
                    id: v4(),
                    type: MessageType.App,
                    text: "Here is the generated image:",
                    additionalInfo: {
                        type: "image",
                        content: responseData.data[0].url, // Assuming the API returns an array with image URLs
                    },
                };
                setStateFunctions((prevMessages) => [...prevMessages, appReply]);
            } else {
                console.error("Error fetching data from API:", response.status);
                const appReply: IChatMessage = {
                    id: v4(),
                    type: MessageType.App,
                    text: "出错啦",
                };
                setStateFunctions((prevMessages) => [...prevMessages, appReply]);
            }
        } catch (error) {
            console.error("Error fetching data from API:", error);
            const appReply: IChatMessage = {
                id: v4(),
                type: MessageType.App,
                text: "出错啦",
            };
            setStateFunctions((prevMessages) => [...prevMessages, appReply]);
        }
    }
}