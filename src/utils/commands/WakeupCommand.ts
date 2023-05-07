import { Dispatch, SetStateAction } from "react";
import { v4 } from "uuid";
import { checkMainSiteAlive } from "../../api/ChatGptApi";
import { MessageType } from "../../components/MessageCard/MessageCard";
import { IChatMessage } from "../../model/IChatMessage";
import { AWAKED_NOTICE, AWAKING_INPROGRESS_NOTICE, AWAKED_TO_RESPOND_NOTICE } from "../../text/text";
import { Command } from "./Command";

export class WakeupCommand extends Command {
    private called: boolean = false;


    async execute(setStateFunctions: Dispatch<SetStateAction<IChatMessage[]>>, onComplete?: () => void): Promise<void> {
        try {
            if (!this.called) {
                const result = await checkMainSiteAlive();
                if (result) {
                    const appReply: IChatMessage = {
                        id: v4(),
                        type: MessageType.App,
                        text: AWAKED_NOTICE,
                    };
                    setStateFunctions((prevMessages) => [...prevMessages, appReply]);

                }
                this.called = true;
            } else {
                const messageId = v4();

                let appReply: IChatMessage = {
                    id: messageId,
                    type: MessageType.App,
                    text: AWAKING_INPROGRESS_NOTICE,
                };
                setStateFunctions((prevMessages) => [...prevMessages, appReply]);

                await checkMainSiteAlive();
                appReply.text = AWAKED_TO_RESPOND_NOTICE;
                setStateFunctions((prevMessages) =>
                    prevMessages.map((msg) => (msg.id === messageId ? appReply : msg)),
                );
            }
        } catch (error) {
        } finally {
            onComplete?.();
        }

    }

}