// variables
const addTask = document.getElementById('add-task');
const taskContainer = document.getElementById('task-container');
const inputTask = document.getElementById('input-task');

// load tasks from localStorage when page loads
document.addEventListener("DOMContentLoaded", loadTasks);

// making enter key function like clicking on add button
inputTask.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();// Prevent form submission (if inside a form)
        addTask.click();  // Trigger add button click
    }
});

// adding the event listener for the add button or making add button functional
addTask.addEventListener('click', function () {
    if (inputTask.value.trim() === "") {
        alert('Please Enter the Task');
        return;
    }

    let task = createTask(inputTask.value); // calling out the task creating function with taskText = inputTask.value
    taskContainer.appendChild(task); // putting created task in taskcontainer
    saveTasks(); //saving the created task in local server
    inputTask.value = ""; // clearing the item form input box
});

// Function to create a task element
function createTask(taskText, completed = false) {
    let task = document.createElement('div');
    task.classList.add('task');
    if (completed) { // used for restoring the previous session task save on localStorage
        task.classList.add("completed");
    }

    let li = document.createElement('li');
    li.innerText = taskText;
    task.appendChild(li);

    let checkButton = document.createElement("button");
    if(completed){          // used for restoring the previous session checkbutton data save on localStorage 
                            // also for making checkbutton for new task
        checkButton.innerHTML = '<i class="fa-duotone fa-solid fa-toggle-on"></i>';
    }else{             
        checkButton.innerHTML = '<i class="fa-duotone fa-solid fa-toggle-off"></i>';
    }

    checkButton.classList.add('checkTask');
    task.appendChild(checkButton);

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.classList.add('deleteTask');
    task.appendChild(deleteButton);

    // event listener for check button
    checkButton.addEventListener('click', function () {
        task.classList.toggle("completed");
        if(task.classList.contains("completed")){
            checkButton.innerHTML = '<i class="fa-duotone fa-solid fa-toggle-on"></i>';
        }
        else{
            checkButton.innerHTML = '<i class="fa-duotone fa-solid fa-toggle-off"></i>';
        }
        saveTasks(); //saving the checkbutton data on localStorage
    });

    // event listener for delete button
    deleteButton.addEventListener('click', function () {
        task.remove();
        saveTasks();
    });

    return task;
}

// Function to save tasks to localStorage
function saveTasks() {
    let tasks = []; // saving the data in array called tasks in the form of object(with name task and completed)
    document.querySelectorAll('.task').forEach(task => {
        tasks.push({
            text: task.querySelector('li').innerText,    // saving the text of the task in localStorage
            completed: task.classList.contains("completed") // saving the status of the task on localStorage
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => {
        let taskElement = createTask(task.text, task.completed);
        taskContainer.appendChild(taskElement);
    });
}
