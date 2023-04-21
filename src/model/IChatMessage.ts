import { MessageType } from "../components/MessageCard/MessageCard";
import { IAdditionalInfo } from "./IAdditionalInfo";

export interface IChatMessage {
    id: string;
    type: MessageType;
    text: string;
    additionalInfo?: IAdditionalInfo;
}