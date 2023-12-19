import Storage from './storage.mjs'

class UI {
    constructor() {
        this._workouts = Storage.getWorkouts();
        this._render();
        //adds event listener to 'new workout' button
        document.getElementById('new-workout-btn').addEventListener('click', () => {
            this.navigateWorkout('new');
        })
        this._setUpImport();      
    }

    //will be used to load everything that needs to be when first navigating
    //to the main page, currently just loads the workouts
    _render() {
        this._loadWorkouts();
    }

    //This method loads the workouts to be displayed. 
    //for each workout, it creates a li element, 
    //sets the corresponding class list to the li,
    //sets the data attr to be used in navigteWorkout,
    //sets the onclick method to navigateWorkout
    //sets the innerHTML for the user to see
    _loadWorkouts() {
        const workoutList = document.getElementById('workout-list');
        for(let workout in this._workouts) {
            const li = document.createElement('li');
            li.classList='list-group-item google-font'

            //stores the id inside the li, to be used in navigateWorkout below.
            //
            li.setAttribute('data-id', this._workouts[workout]._id);
            
            li.onclick = this.navigateWorkout.bind(li);
            
            li.innerHTML = `
            <div class="d-flex align-items-center justify-content-between">
                ${this._workouts[workout]._name}
                <div>
                    ${this._workouts[workout]._excersizes.length} Excersizes
                </div>  
            </div>`
            workoutList.appendChild(li);
        }
    }
    
    //This method is to be called on the list items created in _loadWorkouts()
    //It uses the data-id to change the window location to the workout page passing in the id in the url
    //so that way the workout page can load the corresponding workout
    navigateWorkout(name) {
        if (name === "new") {
            window.location = `workout.html?new`;
        }
        window.location = `workout.html?${this.getAttribute("data-id")}`;
    }

    //this method sets up the import feature. Creates the event listener for the upload, 
    //then creates a file reader to take in the file. It then sends the result to the storage class
    //to handle the rest
    _setUpImport() {
        const fileInput = document.getElementById('upload');
        fileInput.addEventListener('change', () => {
            const fr = new FileReader();
            fr.readAsText(fileInput.files[0]);
            fr.addEventListener('load', () => {
                Storage.import(fr.result);
            })
        })
    }
}// end UI


//starts the application
const app = new UI();