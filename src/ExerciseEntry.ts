type Entry = {
    set: number;
    weightInLbs : number;
    weightInKgs : number;
    reps: number; 
}

export class ExerciseEntry {
    public name: string;
    public details: Array<Entry>;

    public constructor(name?: string, details?: Array<Entry>) {
        this.name = name!;
        this.details = details!;
    }
}