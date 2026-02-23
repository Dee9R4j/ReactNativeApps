// Variables
const addTask = document.getElementById('add-task');
const taskContainer = document.getElementById('task-container');
const inputTask = document.getElementById('input-task');

// Load tasks from localStorage when page loads
document.addEventListener("DOMContentLoaded", loadTasks);

// Event listener for add button
addTask.addEventListener('click', function () {
    if (inputTask.value === "") {
        alert('Please Enter the Task');
        return;
    }

    createTask(inputTask.value);
    saveTasks();
    inputTask.value = "";
});

// Function to create a task element
function createTask(taskText) {
    let task = document.createElement('div');
    task.classList.add('task');

    let li = document.createElement('li');
    li.innerText = taskText;
    task.appendChild(li);

    let checkButton = document.createElement("button");
    checkButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    checkButton.classList.add('checkTask');
    task.appendChild(checkButton);

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.classList.add('deleteTask');
    task.appendChild(deleteButton);

    taskContainer.appendChild(task);

    // Event listener for check button
    checkButton.addEventListener('click', function () {
        task.classList.toggle("completed");
        if(task.classList.contains("completed")){
            checkButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        }else{
            checkButton.innerHTML = '<i class="fa-solid fa-check"></i>';
        }
        saveTasks();
    });

    // Event listener for delete button
    deleteButton.addEventListener('click', function () {
        task.remove();
        saveTasks();
    });
}

// Function to save tasks to localStorage
function saveTasks() {
    let tasks = [];
    document.querySelectorAll('.task').forEach(task => {
        tasks.push({
            text: task.querySelector('li').innerText,
            completed: task.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    let savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
        savedTasks.forEach(task => {
            createTask(task.text);
            if (task.completed) {
                document.querySelectorAll('.task').forEach(t => {
                    if (t.querySelector('li').innerText === task.text) {
                        t.classList.add("completed");
                    }
                });
            }
        });
    }
}
