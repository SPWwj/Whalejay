import { Dispatch, SetStateAction } from 'react';
import { AiCommand } from './Command';
import { IChatMessage } from '../../model/IChatMessage';
import { fetchMessage } from '../../api/ChatGptApi';
import { MessageType } from '../../components/MessageCard/MessageCard';
import { v4 } from 'uuid';

export class ChatCommand extends AiCommand {
    private userInput: string;

    static Create(userInput: string): ChatCommand | null {
        if (userInput.trim() !== '') {
            return new ChatCommand(userInput);
        }

        return null;
    }

    private constructor(userInput: string) {
        super();
        this.userInput = userInput;
    }
    execute(setStateFunctions: Dispatch<SetStateAction<IChatMessage[]>>): void {
        const messageId = v4();

        let appReply: IChatMessage = {
            id: messageId,
            type: MessageType.App,
            text: "Loading",
        };

        setStateFunctions((prevMessages) => [...prevMessages, appReply]);

        fetchMessage(messageId, this.userInput).then((updatedReply) => {
            appReply = updatedReply;
            setStateFunctions((prevMessages) =>
                prevMessages.map((msg) => (msg.id === messageId ? appReply : msg))
            );
        });
    }


}