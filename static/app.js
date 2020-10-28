const todoInput = document.querySelector('.todo');
const todoButton = document.querySelector('.boton');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener('click', filterTodo);

function addTodo(event){

    event.preventDefault();

    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");
    const newTodo = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add("complete-button");
    todoDiv.appendChild(completedButton)
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-minus-circle"></i>';
    deleteButton.classList.add("delete-button");
    todoDiv.appendChild(deleteButton);
    todoList.appendChild(todoDiv);
    saveLocalTodos(todoInput.value);

    todoInput.value = "";
}

function deleteCheck(event){
    const item = event.target;
    console.log(item.classList[0]);
    if(item.classList[0] === 'delete-button'){
        const todo = item.parentElement;
        todo.classList.add("fall");
        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function(){
            todo.remove();
        });
    }

    if(item.classList[0] == 'complete-button'){
        const todo = item.parentElement;
        todo.classList.toggle("completed")
    }
}

function filterTodo(event){
    const todos = todoList.childNodes;
    
    todos.forEach(function(todo){
        console.log(event.target.value);
        switch(event.target.value){
            case "all":
                todo.style.display = 'flex';
                break;
            case "completed":
                if(todo.classList.contains('completed')){
                    todo.style.display = 'flex';
                }
                else{
                    todo.style.display = 'none';
                }
                break;
            case "uncompleted":
                if(!todo.classList.contains('completed')){
                    todo.style.display = 'flex';
                }
                else{
                    todo.style.display = 'none';
                }
                break;
        }
    });
}

function saveLocalTodos(todo){ 
    let todos;
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos(){
    let todos;
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.forEach(function(todo){
        const todoDiv = document.createElement('div');
        todoDiv.classList.add("todo");
        const newTodo = document.createElement('li');
        newTodo.innerText = todo;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);
        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
        completedButton.classList.add("complete-button");
        todoDiv.appendChild(completedButton)
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-minus-circle"></i>';
        deleteButton.classList.add("delete-button");
        todoDiv.appendChild(deleteButton);
        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todo){
    let todos;
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}