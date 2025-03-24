document.addEventListener("DOMContentLoaded", loadTasks);

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const darkModeToggle = document.getElementById("darkModeToggle");

// Add Task
addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;
    
    addTaskToDOM(taskText);
    saveTask(taskText);
    taskInput.value = "";
});

// Add Task to UI
function addTaskToDOM(taskText, completed = false) {
    const li = document.createElement("li");
    li.textContent = taskText;
    if (completed) li.classList.add("completed");

    // Complete Task
    li.addEventListener("click", () => {
        li.classList.toggle("completed");
        updateStorage();
    });

    // Edit Task
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => editTask(li);
    
    // Delete Task
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = () => {
        li.remove();
        updateStorage();
    };

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    // Drag & Drop
    li.setAttribute("draggable", true);
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("drop", drop);
}

// Save Task in Local Storage
function saveTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load Tasks from Local Storage
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTaskToDOM(task.text, task.completed));
}

// Update Storage after changes
function updateStorage() {
    let tasks = [];
    document.querySelectorAll("li").forEach(li => {
        tasks.push({ text: li.textContent.replace("✏️❌", "").trim(), completed: li.classList.contains("completed") });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Edit Task
function editTask(li) {
    const newText = prompt("Edit task:", li.firstChild.textContent.trim());
    if (newText) {
        li.firstChild.textContent = newText;
        updateStorage();
    }
}

// Drag & Drop Functions
let draggedItem = null;

function dragStart(event) {
    draggedItem = event.target;
    setTimeout(() => event.target.style.display = "none", 0);
}

function dragOver(event) {
    event.preventDefault();
    const afterElement = getDragAfterElement(taskList, event.clientY);
    if (afterElement == null) {
        taskList.appendChild(draggedItem);
    } else {
        taskList.insertBefore(draggedItem, afterElement);
    }
}

function drop(event) {
    event.preventDefault();
    this.style.display = "block";
    updateStorage();
}

function getDragAfterElement(container, y) {
    const elements = [...container.children];
    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
