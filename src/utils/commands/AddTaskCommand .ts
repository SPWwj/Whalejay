import { AddCommand } from "./Command";

export class AddTaskCommand extends AddCommand {
    constructor(public taskName: string) {
        super();
    }

    execute() {
        console.log(`Adding task: ${this.taskName}`);
        // Add the task logic
    }
}

