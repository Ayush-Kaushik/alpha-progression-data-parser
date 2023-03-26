const fs = require("fs");
const readline = require("readline");
const path = require("path");

import { ExerciseEntry } from './ExerciseEntry';
import { Duration } from './types/Duration';
import { WorkoutEntry } from './WorkoutEntry';

const stream = fs.createReadStream('data/2023_03_26 Workouts.csv');
const rl = readline.createInterface({ input: stream });

let csvDataContainer: any = [];
let metaData: any = [];

rl.on("line", (row: string) => {

    if (row.trim() === "" && metaData.length !== 0) {
        csvDataContainer.push(metaData);
        metaData = [];
    }

    if (row.replace(/[^\x00-\x7F]/g, "") !== "") {
        metaData.push(row.split(","));
    }
});

rl.on("close", () => {
    
    fs.writeFileSync(path.join(__dirname, "../output/csvDataContainer.json"), JSON.stringify(csvDataContainer), (err: any) => {
        if (err) {
            console.error(err);
        }
    });

    let parsedData = csvDataContainer.map((item: string[][]) => {
        return ParseEntry(item);
    });

    fs.writeFile(path.join(__dirname, "../output/output.json"), JSON.stringify(parsedData), (err: any) => {
        if (err) {
            console.error(err);
        }
    });
});

const ParseDateTime = (data: string): Duration => {
    if (data.includes("hr")) {
        const timeArray: string[] = data.split(":");
        const hours = parseInt(timeArray[0], 10);
        const minutes = parseInt(timeArray[1].split(" ")[0], 10);

        return {
            hours: hours,
            minutes: minutes,
            seconds: 0
        }
    }

    if (data.includes("min")) {
        const timeArray: string[] = data.split(" ");
        const minutes = parseInt(timeArray[0], 10);

        return (minutes >= 60) ? {
            hours: 1,
            minutes: 0,
            seconds: 0
        } : {
            hours: 0,
            minutes: minutes,
            seconds: 0
        }
    }

    return {
        hours: 0,
        minutes: 0,
        seconds: 0
    }
}

const ParseEntry = (data: string[][]) => {

    let workoutEntry: WorkoutEntry = new WorkoutEntry();
    workoutEntry.exerciseList = [];

    let shouldExtractSetsAndRepsInfo: boolean = false;
    let exerciseDetail = new ExerciseEntry();

    for (let i = 0; i < data.length; i++) {
        switch (i) {
            case 1:
                console.log(data[i]);
                let entryDateTimeDuration: string = data[i].toString();
                workoutEntry.date = new Date((entryDateTimeDuration).split(" ")[0]);
                workoutEntry.duration = ParseDateTime(data[1].toString().split(",")[1]);
                break;

            case 2:
                let planInfo = data[i].toString().split("·");
                
                console.log(i + '' + data[i]);
                let day: string = planInfo[0].toString();
                let week: string = planInfo[1].toString();
                let name: string = planInfo[2].toString().trim().replace(/["']/g, '').replace(/\s+/g, ' ')

                workoutEntry.plan = {
                    day: parseInt(day.match(/\d+/)![0], 10),
                    week: parseInt(week.match(/\d+/)![0], 10),
                    name: name
                }
                break;

            default:
                if (data[i].toString().includes("LBS")) {
                    shouldExtractSetsAndRepsInfo = true;
                    continue;
                }

                if ((/\d\./).test(data[i].toString())) {
                    workoutEntry.exerciseList.push(exerciseDetail);
                    exerciseDetail = new ExerciseEntry();

                    let nameAndInfo = data[i];
                    exerciseDetail.name = nameAndInfo[0].toString().replace(/^"(.*)"$/, '$1');
                    exerciseDetail.details = [];
                    shouldExtractSetsAndRepsInfo = false;
                    continue;
                }

                if (shouldExtractSetsAndRepsInfo) {
                    let details = data[i].toString().split(",");

                    exerciseDetail.details.push({
                        set: parseInt(details[0].toString()),
                        reps: parseInt(details[2].toString()),
                        weightInLbs: parseInt(details[1].toString()),
                        weightInKgs: parseInt(details[1].toString()) * 0.453592
                    });
                }
                break;
        }
    }

    return workoutEntry;
}

