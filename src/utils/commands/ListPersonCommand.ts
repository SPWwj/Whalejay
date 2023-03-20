// src/utils/commands/ListPersonCommand.ts
import { Command } from './Command';

export class ListPersonCommand extends Command {
    execute() {
        const people = JSON.parse(localStorage.getItem('people') || '[]');
        if (people.length === 0) {
            console.log("No persons found.")

            return 'No persons found.';
        }

        return people.join(', ');
    }
}
