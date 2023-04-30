export type PromptJson = {
    Instruction: string | null;
    UserInput: string | null;
    Command: {
        TurnOnLight: boolean | null;
        TurnOffLight: boolean | null;
        GenerateImage: {
            status: boolean | null;
            keyword: string | null;
        };
    };
    Feedback: string;
};

export function createPromptJson(userInput: string): string {


    const response: PromptJson = {
        Instruction: "Strictly Use this json for your response! Exclude Instruction and UserInput parts in your response json!",
        UserInput: userInput,
        Command: {
            TurnOnLight: false,
            TurnOffLight: false,
            GenerateImage: {
                status: false,
                keyword: "If you interpret GenerateImage status is true extract keyword from UserInput, otherwise null!",
            },
        },
        Feedback: "Provide Feedback on UserInput, feedback in the language used in UserInput!",
    };

    return JSON.stringify(response);
}