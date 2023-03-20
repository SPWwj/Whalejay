import { Command } from "./Command";

export default class HelpCommand extends Command {
    private commandList: string[];

    constructor() {
        super();
        this.commandList = [];
    }

    addCommandToList(command: string) {
        this.commandList.push(command);
    }

    execute(): string {
        return this.commandList.join("\n");
    }
}
