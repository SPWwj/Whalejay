import { Dispatch, SetStateAction } from "react";
import { AiCommand } from "./Command";

export class TextToSpeechCommand extends AiCommand {

    private userInput: string;

    static Create(userInput: string): TextToSpeechCommand | null {
        const voiceRegex = /^\/voice\s+(.+)/i;
        const match = userInput.match(voiceRegex);

        if (match) {
            return new TextToSpeechCommand(match[1]);
        }

        return null;
    }

    private constructor(userInput: string) {
        super();
        this.userInput = userInput;
    }

    execute<T>(setStateFunctions: Dispatch<SetStateAction<T>>): void {
        throw new Error("Method not implemented.");
    }

}