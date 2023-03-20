import { RemoveCommand } from "./Command";

export class RemoveTaskCommand extends RemoveCommand {
    constructor(public taskName: string) {
        super();
    }

    execute() {
        console.log(`Removing task: ${this.taskName}`);
        // Remove task logic
    }
}