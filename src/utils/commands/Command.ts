export abstract class Command {
  abstract execute(): void;
}

export abstract class AddCommand extends Command {}
export abstract class AssignCommand extends Command {}
export abstract class RemoveCommand extends Command {}
export abstract class ListCommand extends Command {}