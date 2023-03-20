import { AssignCommand } from "./Command";

export class AssignTaskCommand extends AssignCommand {
    constructor(public taskId: number, public personId: number) {
        super();
    }

    execute() {
        console.log(`Assigning task ${this.taskId} to person ${this.personId}`);
        // Assign task logic
    }
}
