import { Command } from './Command';

export class AddPersonCommand extends Command {
    private name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    execute() {
        const people = JSON.parse(localStorage.getItem('people') || '[]');
        people.push(this.name);
        localStorage.setItem('people', JSON.stringify(people));
        return `Person "${this.name}" has been added.`;
    }
}
