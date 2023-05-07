import { Dispatch, SetStateAction } from 'react';
import { AiCommand } from './Command';
import { IChatMessage } from '../../model/IChatMessage';
import { MessageType } from '../../components/MessageCard/MessageCard';
import { v4 } from 'uuid';
import { gptChatStreamUrl } from '../../api/Api';

export class ChatStreamCommand extends AiCommand {
    private userInput: string;
    private abortController: AbortController | null = null;

    static Create(userInput: string): ChatStreamCommand | null {
        if (userInput.trim() !== '') {
            return new ChatStreamCommand(userInput);
        }

        return null;
    }

    private constructor(userInput: string) {
        super();
        this.userInput = userInput;
    }
    execute(setStateFunctions: Dispatch<SetStateAction<IChatMessage[]>>,
        onComplete?: () => void): void {
        const messageId = v4();

        let appReply: IChatMessage = {
            id: messageId,
            type: MessageType.App,
            text: "Loading",
        };

        setStateFunctions((prevMessages) => [...prevMessages, appReply]);
        this.fetchData(appReply, setStateFunctions, onComplete);
    }
    interrupt(): void {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }


    private fetchData = async (appReply: IChatMessage, setStateFunctions: Dispatch<SetStateAction<IChatMessage[]>>, onComplete?: () => void) => {
        try {
            this.abortController = new AbortController();

            const response = await fetch(gptChatStreamUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "user",
                            content: `use hello to write a 500 word essay`,
                        },
                    ],
                    stream: true,
                }),
                signal: this.abortController.signal,
            });

            if (!response.body) {
                console.error("ReadableStream not yet supported in your browser.");
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let result = "";

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    appReply.text = result;
                    setStateFunctions((prevMessages) =>
                        prevMessages.map((msg) => (msg.id === appReply.id ? appReply : msg))
                    );
                    return;
                }
                const valueString = decoder.decode(value);
                // console.log(valueString);

                const jsonValues = valueString.split("\n\n");

                for (const jsonValueData of jsonValues) {
                    const trimmedJsonValueData = jsonValueData.trim();

                    if (trimmedJsonValueData.startsWith("data: ")) {
                        const jsonValueString = trimmedJsonValueData.substring(6).trim();
                        if (jsonValueString.startsWith("[DONE]")) {
                            continue;
                        }
                        const jsonValue = JSON.parse(jsonValueString);
                        const content = jsonValue.choices?.[0]?.delta?.content;

                        if (content) {
                            result += content;
                            appReply.text = result;
                            setStateFunctions((prevMessages) =>
                                prevMessages.map((msg) => (msg.id === appReply.id ? appReply : msg))
                            );
                        }
                    }
                }
            }
        } catch (error) {
            // Check if the error is an AbortError
            if (error instanceof DOMException && error.name === "AbortError") {
                console.log("Fetch aborted");
            } else {
                console.error("Error fetching data:", error);
            }
        } finally {
            onComplete?.();
        }
    };
}