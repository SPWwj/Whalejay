import { RemoveCommand } from "./Command";

export class RemovePersonCommand extends RemoveCommand {
    constructor(public personName: string) {
        super();
    }

    execute() {
        console.log(`Removing person: ${this.personName}`);
        // Remove person logic
    }
}