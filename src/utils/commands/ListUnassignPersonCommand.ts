import { ListCommand } from "./Command";

export class ListUnassignPersonCommand extends ListCommand {
    constructor(public sortOrder: string) {
        super();
    }

    execute() {
        // List unassign person logic
        console.log(`List unassign person with sortOrder: ${this.sortOrder}`);
    }
}