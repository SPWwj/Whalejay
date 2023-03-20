import { Command } from "./Command";

export class UnassignTaskCommand extends Command {
  constructor(public taskId: number, public personId: number) {
    super();
  }

  execute() {
    console.log(`Unassigning task ${this.taskId} from person ${this.personId}`);
    // Unassign task logic
  }
}
