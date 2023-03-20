import { AssignCommand } from "./Command";

export class AssignPersonCommand extends AssignCommand {
    constructor(public personId: number, public taskId: number) {
        super();
    }

    execute() {
        // Assign person logic
        console.log(`Assigned person ${this.personId} to task ${this.taskId}`);
    }
}