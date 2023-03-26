const fs = require("fs");
const readline = require("readline");

const workoutFile = 'data/2023_02_28 Workouts.csv';

const stream = fs.createReadStream(workoutFile);
const rl = readline.createInterface({ input: stream });

let data = [];
let metaData = [];


let exerciseDetailTemplate = {
    name: "",
    details: [
        {
            "setNumber": "",
            "weight": "",
            "reps": ""
        }
    ]
}

let entryTemplate = {
    date: "",
    timeStarted: "",
    duration: "",
    plan: {
        name: "",
        day: "",
        week: ""
    },
    exercise: []
};



let isNewEntry = false;
rl.on("line", (row) => {

    if (row === "") {
        data.push(metaData);
        metaData = [];
        isNewEntry = true;
        return;
    } else {
        isNewEntry = false;
        metaData.push(row.split(","));
    }
});

rl.on("close", () => {
    let filteredData = data.filter(item => {
        if (item.length != 0) {
            return item;
        }
    });

    let parsedData = filteredData.map((item) => {
        return ParseEntry(item);
    });

    fs.writeFile('output.json', JSON.stringify(parsedData), err => {
        if (err) {
          console.error(err);
        }
      });

    

});



const ParseEntry = (data) => {
    let entry = entryTemplate;
    let exerciseData = [];

    for (let i = 0; i < data.length; i++) {
        switch (i) {
            case 0:
                entry.plan.name = data[i];
                break;
            case 1:
                let entryDateTimeDuration = data[i];
                entry.date = (entryDateTimeDuration + '').split(" ")[0];
                entry.timeStarted = ((entryDateTimeDuration[0] + '').split(" "))[1];
                entry.duration = entryDateTimeDuration[1];
                break;
            case 2:
                let planInfo = (data[i] + '').split("·");
                entry.plan.day = planInfo[0];
                entry.plan.week = planInfo[1];
                entry.plan.name = planInfo[2];
                break;
            default:
                exerciseData.push(data[i]);
                break;
        }
    }

    let shouldExtractSetsAndRepsInfo = false;
    let exerciseDetailTemplateEntry = exerciseDetailTemplate;

    for(let i = 0; i < exerciseData.length; i++) {
        if((exerciseData[i] + '').includes("LBS")) {
            shouldExtractSetsAndRepsInfo = true;
            continue;
        }

        if((/\d\./).test(exerciseData[i])) {
            entry.exercise.push(exerciseDetailTemplateEntry);

            exerciseDetailTemplateEntry = {
                name: "",
                details: [
                    {
                        "setNumber": "",
                        "weight": "",
                        "reps": ""
                    }
                ]
            };

            exerciseDetailTemplateEntry.name = exerciseData[i]; 
            
            shouldExtractSetsAndRepsInfo = false;
            continue;
        }

        if(shouldExtractSetsAndRepsInfo) {
            details = (exerciseData[i] + '').split(",")
            exerciseDetailTemplateEntry.details.push({
                setNumber: details[0],
                weight: details[1],
                reps: details[2]
            });
        }
    }

    console.log(entry);

    return entry;
}

