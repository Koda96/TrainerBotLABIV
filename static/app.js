const todoInput = document.querySelector('.todo');
const horario = document.querySelector('.todo-clock');
const todoButton = document.querySelector('.boton');
const micButton = document.querySelector('.vozboton');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');
const digits_only = string => [...string].every(c => '0123456789:'.includes(c));
let lang = 'es-MX';

document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener('click', filterTodo);
micButton.addEventListener('click', voicerecognition);

function addTodo(event){

    event.preventDefault();

    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");

    const newTodo = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    const time = document.createElement('li');
    time.innerText = horario.value;
    time.classList.add("time-item");
    todoDiv.appendChild(time);

    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add("complete-button");
    todoDiv.appendChild(completedButton)

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-minus-circle"></i>';
    deleteButton.classList.add("delete-button");
    todoDiv.appendChild(deleteButton);

    todoList.appendChild(todoDiv);

    saveLocalTodos(todoInput.value, horario.value);

    console.log(todoList);


    //SPEECH
    TTS(todoInput.value, horario.value);

    todoInput.value = "";
    horario.value = "";
}

function deleteCheck(event){
    const item = event.target;
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

function saveLocalTodos(todo, horario){ 
    let todos;
    if(localStorage.getItem('todos') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo + "@@" + horario);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos(){
    let todos;
    let text;
    let hora;

    if(localStorage.getItem('todos') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.forEach(function(todo){
        text = todo.slice(0, todo.indexOf("@"));
        hora = todo.slice(todo.indexOf("@") + 2, todo.length);

        const todoDiv = document.createElement('div');
        todoDiv.classList.add("todo");

        const newTodo = document.createElement('li');
        newTodo.innerText = text;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);

        const time = document.createElement('li');
        if(hora != "undefined")
            time.innerText = hora;
        time.classList.add("time-item");
        todoDiv.appendChild(time);

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

    let speechRec = new p5.SpeechRec(lang, gotSpeech);
    speechRec.continuous = true;
    speechRec.start();

    function gotSpeech(){
        gotSpeech3(speechRec);
    }
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

function voicerecognition(event){
    let speechRec = new p5.SpeechRec(lang, gotSpeech2);
    console.log(event);

    if(event)
        event.preventDefault();

    let text;
    let hora;
    speechRec.start();

    function gotSpeech2(){
        if(speechRec.resultValue){
            text = speechRec.resultString.slice(0, speechRec.resultString.indexOf("a las"));
            hora = speechRec.resultString.slice(speechRec.resultString.lastIndexOf("a las")+6, speechRec.resultString.length);
            var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(hora);

            if(speechRec.resultString.includes("a las") && isValid){
                writeSpeech(text, hora);
            }
            else{
                writeSpeech(speechRec.resultString,"undefined");
            }
        }
    }
}

function writeSpeech(text, hora){

    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");
    const newTodo = document.createElement('li');
    newTodo.innerText = text;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    const time = document.createElement('li');

    if(hora != "undefined")
        time.innerText = hora;
    
    time.classList.add("time-item");
    todoDiv.appendChild(time);
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add("complete-button");
    todoDiv.appendChild(completedButton)
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-minus-circle"></i>';
    deleteButton.classList.add("delete-button");
    todoDiv.appendChild(deleteButton);
    todoList.appendChild(todoDiv);
    saveLocalTodos(text, hora);

    TTS(text, hora);

    let speechRec = new p5.SpeechRec(lang, gotSpeech);
    speechRec.continuous = true;
    speechRec.start();

    function gotSpeech(){
        gotSpeech3(speechRec);
    }
}

function TTS(palabra, hora){
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(hora);
    let speech = new p5.Speech();

    if(palabra === "Escribiendo" || palabra === "Hablando")
        document.getElementById("checkvoice").checked = true;

    if (document.getElementById("checkvoice").checked){
        if(isValid && hora != "undefined")
            speech.speak(palabra + "a las" + hora + " minutos.");
        else
            speech.speak(palabra);
    }
}

function gotSpeech3(speechRec){
    console.log(speechRec.resultString);
    if(speechRec.resultString === "Escribir" || speechRec.resultString === "escribir"){
        TTS("Escribiendo","undefined");
        voicerecognition();
    }
    
    if(speechRec.resultString === "Hablar" || speechRec.resultString === "hablar"){
        TTS("Hablando","undefined");
        document.getElementById("checkvoice").checked = true;
    }
}