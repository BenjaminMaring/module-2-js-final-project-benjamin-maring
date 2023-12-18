import Storage from './storage.mjs'

class Workout {
    constructor() {
        //gets the id of the workout to load
        this._id = window.location.search.slice(1);
        //gets the workout obj 
        this._workout = Storage.getWorkout(this._id);
        //if the workout doesnt exists, it loads an empty workout
        if (this._workout === undefined) {
            this._workout = { _id: Math.random()*1000, _name: "", _excersizes: []}
        }
        this._render();
        this._setTitle();

        //event listeners
        document.getElementById('plus').addEventListener('click', modal._toggleModal);
        document.getElementById('save-excersize').addEventListener('click', this._saveNewExcersize.bind(this));
        document.getElementById('save-workout').addEventListener('click', this._saveWorkout.bind(this));
        document.getElementById('delete-workout').addEventListener('click', this._deleteWorkout.bind(this));
        document.getElementById('export-workout').addEventListener('click', this._export.bind(this));
    }

    //saves a workout, with the current name entered
    _saveWorkout() {
        let name = document.getElementById('workout-name-input').value;
        //checks to make sure the name isnt empty
        if ((name === "")) {
            alert("Please Enter A Name");
            return;
        }
        const id = Math.random()*1000 + ""
        Storage.saveWorkout({_id: id, _name: name, _excersizes: this._workout._excersizes}, this._id);
        window.location = `workout.html?${id}`;
    }

    //deletes the current workout opened then navigates back to the main page
    _deleteWorkout() {
        if (confirm("Are you sure you want to delete the workout?")) {
            Storage.deleteWorkout(this._workout._id);
            window.location = 'index.html';
        }
    }
    
    //creates a new excersize and adds it to the list of excersizes and reloads the page
    _saveNewExcersize() {
        if (modal.excersize.value === "") {
            alert("Please enter a name for the excersize");
            return;
        }
        const newExcersize = Excersize.newExcersize();
        this._workout._excersizes.push(newExcersize);
        modal.hide();
        this._render();
    }

    //this method will be called when users click the 'edit' button on the modal
    _editExcersize(excersize) {
        this._workout._excersizes[this._workout._excersizes.indexOf(excersize)] = Workout.newExcersize();
        modal.hide();
        this._render();
    }
    
    //takes in an excersize object and deletes it from the array, then reloads the page.
    _deleteExcersize(excersize){
        let check = this._workout._excersizes.indexOf(excersize);
        if (check !== -1 ) {
            if (confirm("Are you sure you want to delete the excersize?")) {
                this._workout._excersizes.splice(check, 1);
                this._render();
            }
        }
    }
    
    //this method does the bulk of the work in loading the page, is responsible for how to dom elements get added for each excersize.
    //Also adds the event listeners for the respecive excersize, so when deleting/editing it will have the corresponding excersize
    _loadExcersizes() {
        //obtain the element that the excersizes are going to be placed in
        const list = document.getElementById('workout-box');
        //loop through the excersizes
        for (let excer in this._workout._excersizes) {
            //create a wrapper div and set class list to style it
            const excersizeElem = document.createElement('div');
            excersizeElem.classList = "card custom-card m-2 ms-auto me-auto"
            //set the inner HTML of div to custom fit the excersize
            excersizeElem.innerHTML = `
            <div id="excersize-title" class="card-header fs-3 d-flex justify-content-between p-0 ps-2 pt-1 pb-1">${this._workout._excersizes[excer].name}
                <div class="d-flex align-items-center justify-content-evenly" style="min-width: 90px;">
                    <i id='${excer + "delete"}' class="bi bi-x-circle-fill custom-icon"></i>
                    <svg id='${excer + "edit"}' xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between flex-wrap">
                    <div class="d-flex p-2">
                        <p class="fs-4" id="sets-title">${this._workout._excersizes[excer].sets}&#160;</p>
                        <p class="fs-4">sets</p>
                    </div>
                    <div class="d-flex p-2">
                        <p class="fs-4" id="reps-title">${this._workout._excersizes[excer].reps}&#160;</p>
                        <p class="fs-4">Reps</p>
                    </div>
                    <div class="d-flex p-2">
                        <p class="fs-4" id="weight-title">${this._workout._excersizes[excer].weight}&#160;</p>
                        <p class="fs-4">lb</p>
                    </div>
                </div>
                <div class="card-footer bg-white">
                    <p id="notes-title" class="fs-5 m-0">${this._workout._excersizes[excer].notes}</p>
                    </div>
                </div>`;
            list.appendChild(excersizeElem);
            
            //add event listener for delete and edit buttons, using the index plus delete to create a custom ID to add the event listener too
            document.getElementById(`${excer + "delete"}`).onclick = () => {
                this._deleteExcersize(this._workout._excersizes[excer]);
            };
            document.getElementById(`${excer + "edit"}`).onclick = () => {
                modal._toggleModal("edit", this._workout._excersizes[excer]);
            };
        }//end for
    }

    //simply sets the title of the page to that of the id. If you navigate to this page without using url paramaters,
    //it will redirect you back to the main page.
    _setTitle() {
        if (this._workout._id === undefined) {
            window.location = 'index.html';
        } else if (this._workout._id === "new") {
            document.getElementById('workout-name-input').value = "";
        } else {
            document.getElementById('workout-name-input').value = this._workout._name;
        }
    }

    //this method will be called whenever the page needs to be reloaded
    _render() {
        document.getElementById('workout-box').innerHTML = "";
        this._loadExcersizes();
    }

    //just used to call storage export class
    _export() {
        Storage.export(this._workout._id);
    }
}

class Excersize {
    constructor(id, name, sets, weight, reps, notes) {
        this.id = id;
        this.name = name;
        this.sets = sets;
        this.reps = reps;
        this.weight = weight;
        this.notes = notes;
    }

    static newExcersize() {
        if (modal.notes.value="") {
            modal.notes.value="No Notes"
        }
        let name = modal.excersize.value.split('')
        name[0] = name[0].toUpperCase();
        modal.excersize.value = name.join('');


        return new Excersize((Math.random() * 1000), modal.excersize.value,
                                                     modal.sets.value, 
                                                     modal.reps.value, 
                                                     modal.weight.value, 
                                                     modal.notes.value);
    }
}

//Will be used simply for setting/manipulating the modal
class Modal {
    constructor() {
        this.excersize = document.getElementById('excersize-input');
        this.sets = document.getElementById('sets-input');
        this.reps = document.getElementById('reps-input');
        this.weight = document.getElementById('weight-input');
        this.notes = document.getElementById('notes-input');
        this.saveBtn = document.getElementById('save-excersize');
        this.editBtn = document.getElementById('edit-excersize');
    }

    hide() {
        $('#excersize').modal('hide');
    }

    show() {
        $('#excersize').modal('show');
    }

// togles the mode of the modal between 'edit' mode and 'save' mode.
// edit mode loads the existing excersize into the modal to edit, save mode changes the inputs to empty to add a new excersize
    _toggleModal(mode, excersize) {
        if (mode === "edit"){
            //set input fields to corresponding element
            modal.excersize.value = excersize.name;
            modal.sets.value = excersize.sets;
            modal.reps.value = excersize.reps;
            modal.weight.value = excersize.weight;
            modal.notes.value = excersize.notes;
            //toggle btns to show the correct one for the mode
            modal.saveBtn.style.display = "none";
            modal.editBtn.style.display = "block";
            //changes onclick to use appropriate id for the given element
            modal.editBtn.onclick = () => {
                workout._editExcersize(excersize);
            };
        } else {
            modal.excersize.value = "";
            modal.sets.value = "";
            modal.reps.value = "";
            modal.weight.value = "";
            modal.notes.value = "";
            //toggle btns to show the correct one for the mode
            modal.saveBtn.style.display = "block";
            document.getElementById('edit-excersize').style.display = "none";
        }
        modal.show();
    }
}

// initializes everything
const modal = new Modal();
const workout = new Workout();