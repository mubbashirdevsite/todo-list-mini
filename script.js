const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");

const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

const currentDate = document.getElementById("currentDate");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

// Date
currentDate.textContent = new Date().toDateString();

renderTasks();
updateStats();

addBtn.addEventListener("click", addTask);
searchInput.addEventListener("input", renderTasks);

document.querySelectorAll(".filters button").forEach(btn => {
    btn.addEventListener("click", () => {
        filter = btn.dataset.filter;
        renderTasks();
    });
});

document.getElementById("clearCompleted").addEventListener("click", () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
});

function addTask(){

    const text = taskInput.value.trim();

    if(!text) return;

    tasks.push({
        id:Date.now(),
        text,
        completed:false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
}

function toggleTask(id){

    tasks = tasks.map(t => {

        if(t.id === id){
            t.completed = !t.completed;
        }

        return t;
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id){

    tasks = tasks.filter(t => t.id !== id);

    saveTasks();
    renderTasks();
}

function editTask(id){

    const newText = prompt("Edit task:");

    if(!newText) return;

    tasks = tasks.map(t => {

        if(t.id === id){
            t.text = newText;
        }

        return t;
    });

    saveTasks();
    renderTasks();
}

function renderTasks(){

    const search = searchInput.value.toLowerCase();

    let filtered = tasks.filter(t => {

        if(filter === "active" && t.completed) return false;
        if(filter === "completed" && !t.completed) return false;

        return t.text.toLowerCase().includes(search);
    });

    taskList.innerHTML = "";

    if(filtered.length === 0){
        emptyState.style.display = "block";
    }else{
        emptyState.style.display = "none";
    }

    filtered.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${task.completed ? "completed" : ""}">
                ${task.text}
            </span>

            <div class="actions">
                <button onclick="toggleTask(${task.id})">✔</button>
                <button onclick="editTask(${task.id})">✏</button>
                <button class="delete" onclick="deleteTask(${task.id})">🗑</button>
            </div>
        `;

        taskList.appendChild(li);
    });

    updateStats();
}

function updateStats(){

    totalTasksEl.textContent = tasks.length;
    completedTasksEl.textContent = tasks.filter(t => t.completed).length;
    pendingTasksEl.textContent = tasks.filter(t => !t.completed).length;
}

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}