import { ExerciseEntry } from "./ExerciseEntry";
import { Duration } from "./types/Duration";
import { Plan } from "./types/Plan";

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