export interface ICommand {
    TurnOnLight: boolean;
    TurnOffLight: boolean;
    GenerateImage: {
        status: boolean;
        keyword?: string;
    };
}