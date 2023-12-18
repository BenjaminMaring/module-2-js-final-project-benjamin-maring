export default class Storage {
    constructor() {}

    /** structure of data will be as follows. One Key, an array of objects with sub arrays for excersizes
    workouts: [
         { _id: "someNumber", _name: 'Push', _excersizes: [excersizeOBJ, excersizeObj] },
         { _id: "someNumber", _name: 'Pull', _excersizes: [excersizeOBJ, excersizeObj] },
         { _id: "someNumber", _name: 'Legs', _excersizes: [excersizeOBJ, excersizeObj] }
    ]
    
    Excersize Objects are structured as follows
    { id: 1, name: "Pull Dowms", sets: 4, reps: 8, weight: 100, notes: "Ex Notes"} **/


    //this method takes in a new copy of the workout, and its original name. It deletes the old copy and pushes a new copy on.
    //Might refactor this later to use indexOf() and then change the index instead of deleting it and adding a new one. 
    //Doing it this was will always try and delete a workout, which is uneccesary when adding a brand new workout not yet in storage
    static saveWorkout(newWorkout, oldId) {
        if (oldId !== "") {
            Storage.deleteWorkout(oldId);
        }
        const workouts = Storage.getWorkouts();
        workouts.push(newWorkout);
        Storage.setWorkouts(workouts);
    }

    //this takes in the name of a workout, then removes it from storage by splicing it from the array
    static deleteWorkout(id) {
        let workouts = Storage.getWorkouts();
        for (let workout in workouts) {
            if (workouts[workout]._id === id ) {
                workouts.splice(workout, 1);
                Storage.setWorkouts(workouts);
                return;
            }
        }
    }

    //this method gets a specific workout from storage
    static getWorkout(id) {
        let workouts = Storage.getWorkouts();
        for (let workout in workouts) {
            if (workouts[workout]._id === id ) {
                return workouts[workout];
            }
        }
    }

    //sets the local storage to have the new array of workouts
    static setWorkouts(workouts) {
        localStorage.setItem('workouts', JSON.stringify(workouts));
    } 

    //This method checks to see if local storage has anything saved, if not it creates an empty array and then returns that. 
    //Otherwise, it returns the workouts array
    static getWorkouts(){
        if (localStorage.getItem('workouts') === null) {
            return [];
        } else {
            return JSON.parse(localStorage.getItem('workouts'));
        }
    }

    //this method gets all of the workouts in a specific workout from local storage, and then returns the excersizes array 
    static getExcersizes(name) {
        let workouts;
        workouts = Storage.getWorkouts();
        for (let workout in workouts) {
            if (workouts[workout].name === name ) {
                return workouts[workout].excersizes;
            }
        }
    }

    //takes in a workout in the form of a string, then adds it to the workouts array in local storage
    static import(result) {
        try {
            const workout = JSON.parse(result);
            if (Storage.verifyImport(workout)) {
                Storage.saveWorkout(workout, "");
                window.location = "index.html";
            }
        } catch(error) {
            alert("An Error occured");
            console.log("error occured - " + error);
            // window.location = "index.html";
        }
    }// end import

    //checks to make sure the imported obj has the right properties
    static verifyImport(obj) {
        const keys = Object.keys(obj);
        if ( Object.keys(obj).join('') !== "_id_name_excersizes") {
                alert("invalid format");
            return false;
        }
        return true;
    }

    //This method creats a file in a blob, then creates an anchor element to download the file. It 'clicks' the element at the end, causing the file to download.
    static export(id) {
        let workout = Storage.getWorkout(id);
        if (workout === undefined) {
            alert("Export error, please try saving the file and exporting again");
        }
        console.log(workout)
        let jsonContent = JSON.stringify(workout);
        const blob = new Blob([jsonContent], { type: 'json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${workout._name}.json`;
        link.click();
    }
}// end storage class
