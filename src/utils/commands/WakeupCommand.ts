import { Dispatch, SetStateAction } from "react";
import { v4 } from "uuid";
import { checkMainSiteAlive } from "../../api/ChatGptApi";
import { MessageType } from "../../components/MessageCard/MessageCard";
import { IChatMessage } from "../../model/IChatMessage";
import { AWAKED_NOTICE, AWAKING_INPROGRESS_NOTICE, AWAKED_TO_RESPOND_NOTICE } from "../../text/text";
import { Command } from "./Command";

export class WakeupCommand extends Command {
    private called: boolean = false;
    private setIsAlive: Dispatch<SetStateAction<boolean>>;
    private setStateFunctions: Dispatch<SetStateAction<IChatMessage[]>>

    constructor(setIsAlive: Dispatch<SetStateAction<boolean>>, setStateFunctions: Dispatch<SetStateAction<IChatMessage[]>>) {
        super();
        this.setIsAlive = setIsAlive;
        this.setStateFunctions = setStateFunctions;
    }

    async execute(): Promise<void> {
        if (!this.called) {
            const result = await checkMainSiteAlive();
            if (result) {
                const appReply: IChatMessage = {
                    id: v4(),
                    type: MessageType.App,
                    text: AWAKED_NOTICE,
                };
                this.setStateFunctions((prevMessages) => [...prevMessages, appReply]);
                this.setIsAlive(true);

            }
            this.called = true;
        } else {
            const messageId = v4();

            let appReply: IChatMessage = {
                id: messageId,
                type: MessageType.App,
                text: AWAKING_INPROGRESS_NOTICE,
            };
            this.setStateFunctions((prevMessages) => [...prevMessages, appReply]);

            await checkMainSiteAlive();
            appReply.text = AWAKED_TO_RESPOND_NOTICE;
            this.setStateFunctions((prevMessages) =>
                prevMessages.map((msg) => (msg.id === messageId ? appReply : msg)),
            );
            this.setIsAlive(true);
        }

    }
    interrupt(): void {
        throw new Error("Method not implemented.");
    }
}