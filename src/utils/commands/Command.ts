import { Dispatch, SetStateAction } from "react";

export abstract class Command {
  abstract execute(setStateFunctions: Dispatch<SetStateAction<any>>,
    onComplete?: () => void): void;
  abstract interrupt(): void;
}

export abstract class AddCommand extends Command { }
export abstract class AssignCommand extends Command { }
export abstract class RemoveCommand extends Command { }
export abstract class ListCommand extends Command { }
export abstract class AiCommand extends Command { }


