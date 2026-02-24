// variables
const addTask = document.getElementById('add-task');
const tastContainer = document.getElementById('task-container');
const inputTask = document.getElementById('input-task');

// event listener for add button

addTask.addEventListener('click', function(){
    
    let task = document.createElement('div');
    task.classList.add('task');

    let li = document.createElement('li');
    li.innerText = `${inputTask.value}`;
    task.appendChild(li);

    let checkButton = document.createElement("button");
    checkButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    checkButton.classList.add('checkTask');
    task.appendChild(checkButton);

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.classList.add('deleteTask');
    task.appendChild(deleteButton);

    if(inputTask.value ===""){
        alert('Please Enter the Task');
    }else{
        tastContainer.appendChild(task);
    }
    inputTask.value = "";


    checkButton.addEventListener('click', function(){
        if(checkButton.parentElement.style.textDecoration === "line-through"){
            checkButton.parentElement.style.textDecoration = "";
            checkButton.innerHTML = '<i class="fa-solid fa-check"></i>';
        }else{
            checkButton.parentElement.style.textDecoration = "line-through";
            checkButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        }
    });

    deleteButton.addEventListener('click', function(e){
        let target = e.currentTarget;
        target.parentElement.remove();
    });

});
