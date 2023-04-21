import { ReactNode } from "react";
import { MessageType } from "./MessageCard";
import { IAdditionalInfo } from "../../model/IAdditionalInfo";

export interface IMessageCardProps {
    type: MessageType;
    message: string;
    className?: string;
    name: string;
    imageSrc: string;
    additionalInfo?: IAdditionalInfo;
}