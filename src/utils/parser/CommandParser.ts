// CommandParser.ts
import { AddPersonCommand } from "../commands/AddPersonCommand";
import { AddTaskCommand } from "../commands/AddTaskCommand ";
import { AssignPersonCommand } from "../commands/AssignPersonCommand";
import { AssignTaskCommand } from "../commands/AssignTaskCommand";
import { Command } from "../commands/Command";
import { ListAllCommand } from "../commands/ListAllCommand";
import { ListAssignPersonCommand } from "../commands/ListAssignPersonCommand";
import { ListAssignTaskCommand } from "../commands/ListAssignTaskCommand";
import { ListPersonCommand } from "../commands/ListPersonCommand";
import { ListTaskCommand } from "../commands/ListTaskCommand";
import { ListUnassignPersonCommand } from "../commands/ListUnassignPersonCommand";
import { ListUnassignTaskCommand } from "../commands/ListUnassignTaskCommand";
import { RemovePersonCommand } from "../commands/RemovePersonCommand";
import { RemoveTaskCommand } from "../commands/RemoveTaskCommand";


export default class CommandParser {
  parse(input: string): Command | null {
    const tokens = input.split(" ");
    const command = tokens.shift()?.toLowerCase();

    if (command === "add") {
      const entityType = tokens.shift()?.toLowerCase();
      const entityName = tokens.join(" ");
      if (entityType === "task") {
        return new AddTaskCommand(entityName);
      } else if (entityType === "person") {
        return new AddPersonCommand(entityName);
      }
    } else if (command === "assign") {
      const entityType1 = tokens.shift()?.toLowerCase();
      const index1 = parseInt(tokens.shift()?.substring(2) || "", 10);
      const entityType2 = tokens.shift()?.toLowerCase();
      const index2 = parseInt(tokens.shift()?.substring(2) || "", 10);

      if (entityType1 === "task" && entityType2 === "person") {
        return new AssignTaskCommand(index1, index2);
      } else if (entityType1 === "person" && entityType2 === "task") {
        return new AssignPersonCommand(index1, index2);
      }
    } else if (command === "remove") {
      const entityType = tokens.shift()?.toLowerCase();
      const entityNameOrIndex = tokens.shift();

      if (entityType === "task") {
        if (entityNameOrIndex?.startsWith("-i")) {
          const index = parseInt(entityNameOrIndex.substring(2), 10);
          // Remove task by index
          console.log(index);

        } else {
          return new RemoveTaskCommand(entityNameOrIndex || "");
        }
      } else if (entityType === "person") {
        if (entityNameOrIndex?.startsWith("-i")) {
          const index = parseInt(entityNameOrIndex.substring(2), 10);
          // Remove person by index
          console.log(index);
        } else {
          return new RemovePersonCommand(entityNameOrIndex || "");
        }
      }
    } else if (command === "list") {
      const entityType = tokens.shift()?.toLowerCase();
      const order = tokens.shift();

      if (entityType === "all") {
        return new ListAllCommand();
      } else if (entityType === "task") {
        return new ListTaskCommand();
      } else if (entityType === "person") {
        return new ListPersonCommand();
      } else if (entityType === "assign" && tokens.shift()?.toLowerCase() === "task") {
        return new ListAssignTaskCommand();
      } else if (entityType === "unassign" && tokens.shift()?.toLowerCase() === "task") {
        return new ListUnassignTaskCommand();
      } else if (entityType === "assign" && tokens.shift()?.toLowerCase() === "person") {
        return new ListAssignPersonCommand();
      } else if (entityType === "unassign" && tokens.shift()?.toLowerCase() === "person") {
        const sortOrder = order === "-o" ? tokens.shift()?.toLowerCase() : "asc";
        return new ListUnassignPersonCommand(sortOrder || "asc");
      }
    }

    return null;
  }
}
