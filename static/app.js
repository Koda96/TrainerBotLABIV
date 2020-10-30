//DEFINICIONES
const todoInput = document.querySelector('.todo');
const horario = document.querySelector('.todo-clock');
const todoButton = document.querySelector('.boton');
const micButton = document.querySelector('.vozboton');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');
const digits_only = string => [...string].every(c => '0123456789:'.includes(c));
let lang = 'es-MX';

//LISTENERS
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener('click', filterTodo);
micButton.addEventListener('click', voicerecognition);
document.addEventListener('click', startAudio);

function addTodo(event){

    //FUNCION PARA QUE NO REFRESHEE LA PAGINA APENAS DAS EL BOTON
    event.preventDefault();

    //CREACION DE LA TAREA
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");

    //SE CREA EL TEXTO EN UN LI 
    const newTodo = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    //SE USA EL TIME QUE VIENE DEL TIME-ITEM
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
    console.log("Listening");

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

    if(event)
        event.preventDefault();

    let text;
    let hora;
    speechRec.start();
    console.log("Listening");

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

    console.log("Writing");
    const todoDiv = document.createElement('div');
    todoDiv.classList.add("todo");
    const newTodo = document.createElement('li');
    newTodo.innerText = text; //SE UTILIZA EL STRING TEXT RECIBIDO POR LA FUNCION VOICERECOGNITION
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);
    const time = document.createElement('li');

    if(hora != "undefined")
        time.innerText = hora; //SE UTILIZA EL STRING HORA RECIBIDO POR LA FUNCION VOICERECOGNITION
    
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

    console.log("Writing succesful");

    TTS(text, hora);

    let speechRec = new p5.SpeechRec(lang, gotSpeech);
    speechRec.continuous = true;
    speechRec.start();
    console.log("Listening");

    function gotSpeech(){
        gotSpeech3(speechRec);
    }
}

function TTS(palabra, hora){

    //VALIDACION DE HORA PARA MANTENER INTEGRIDAD
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(hora);
    let speech = new p5.Speech();


    //INPUT DE VOZ PARA INTERACTUAR CON EL FORMULARIO, SI SE DICE ESCRIBIR SE VA A CREAR UN LI EN EL LISTADO DE TODO, SI SE DICE
    //HABLAR, SE ACTIVA LA FUNCION TTS, LA FUNCION TTS SE ACTIVA POR DEFECTO SI SE DICE ESCRIBIR.
    if(palabra === "Escribiendo" || palabra === "Hablando")
        document.getElementById("checkvoice").checked = true;

    console.log("Talking");
    
    if (document.getElementById("checkvoice").checked){
        if(isValid && hora != "undefined")
            speech.speak(palabra + "a las" + hora + " minutos.");
        else
            speech.speak(palabra);
    }
}

function startAudio(){
    //FUNCION PARA CUMPLIR LA POLITICA DE NAVEGADOR CHROME p5.sound.js:175 The AudioContext was not allowed to start.
    //It must be resumed (or created) after a user gesture on the page. https://goo.gl/7K7WLu
    let audio = new AudioContext();
    console.log("Audio loaded and resumed")
    audio.resume();
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