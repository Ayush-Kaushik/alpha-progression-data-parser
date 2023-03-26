import { ExerciseEntry } from "./ExerciseEntry";

type Plan  = {
    name: string;
    day: number;
    week: number;
}

type Duration = {
    hours: number;
    minutes: number;
    seconds: number;
}

export class WorkoutEntry {
    date: Date;
    timeStarted: string;
    duration: Duration;
    plan: Plan;
    exerciseList: Array<ExerciseEntry>;

    public constructor(date?: Date, timeStarted?: string, duration?: Duration, plan?: Plan, exerciseList?: Array<ExerciseEntry>) {
        this.date = date!;
        this.timeStarted = timeStarted!;
        this.duration = duration!;
        this.plan = plan!;
        this.exerciseList = exerciseList!;
    }
}