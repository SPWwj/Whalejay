import { Dispatch, SetStateAction } from "react";
import { AiCommand } from "./Command";
import { gptImageUrl } from "../../api/Api";
import { MessageType } from "../../components/MessageCard/MessageCard";
import { IChatMessage } from "../../model/IChatMessage";
import { v4 } from "uuid";
import placeholderImage from "../../assets/images/placeholder.png";

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

    async execute(setStateFunctions: Dispatch<SetStateAction<IChatMessage[]>>, onComplete?: () => void): Promise<void> {
        let appReply: IChatMessage = {
            id: v4(),
            type: MessageType.App,
            text: "Generating Image...:",
            additionalInfo: {
                type: "image",
                content: placeholderImage
            },
        };
        try {
            const sanitizedMessage = this.userInput.replace(/[\n\r]+/g, " ");

            setStateFunctions((prevMessages) => [...prevMessages, appReply]);

            const requestBody = {
                prompt: encodeURIComponent(sanitizedMessage), // Replace with the desired prompt
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
                appReply.text = "Here is the generated image:";
                if (appReply.additionalInfo && appReply.additionalInfo.content) {
                    appReply.additionalInfo.content = responseData.data[0].url;
                }
            } else {
                appReply.text = "出错啦";

            }
        } catch (error) {
            appReply.text = "出错啦";

        } finally {
            setStateFunctions((prevMessages) =>
                prevMessages.map((msg) => (msg.id === appReply.id ? appReply : msg))
            );
            onComplete?.();
        }

    }

}