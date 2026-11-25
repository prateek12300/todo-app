
// Get HTML elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");
const clearCompletedButton = document.getElementById("clear-completed");

// Load saved tasks from localStorage
let tasks = [];

try {
    const savedTasks = localStorage.getItem("myTasks");
    const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];

    if (Array.isArray(parsedTasks)) {
        tasks = parsedTasks.filter(task =>
            task &&
            typeof task.id === "number" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        );
    }
} catch (error) {
    console.error("Could not load saved tasks:", error);
}

// Save tasks in localStorage
function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// Display tasks on the webpage
function renderTasks() {

    // Clear the old list
    taskList.replaceChildren();

    // Count remaining tasks
    const remainingTasks = tasks.filter(
        task => !task.completed
    ).length;

    taskCount.textContent =
        `${remainingTasks} task${remainingTasks !== 1 ? "s" : ""} remaining`;

    // Show message if there are no tasks
    emptyMessage.hidden = tasks.length !== 0;

    // Create each task
    tasks.forEach(task => {

        const listItem = document.createElement("li");
        listItem.className = "task-item";

        if (task.completed) {
            listItem.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Complete task");

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        // Task text
        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        // Add elements to list item
        listItem.append(
            checkbox,
            taskText,
            deleteButton
        );

        taskList.appendChild(listItem);
    });
}

// Add a new task
function addTask(text) {

    const newTask = {
        id: Date.now() + Math.random(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();
}

// Complete or uncomplete a task
function toggleTask(id) {

    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// Delete a task
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

// Listen for form submission (button click or Enter key)
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    addTask(text);

    // Clear input after adding
    taskInput.value = "";
    taskInput.focus();
});

// Delete all completed tasks
clearCompletedButton.addEventListener("click", function() {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
});

// Display saved tasks when the page opens
renderTasks();
