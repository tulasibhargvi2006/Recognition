
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");

const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-button");

const remainingTasks = document.getElementById("remainingTasks");
const clearCompletedButton = document.getElementById("clearCompleted");


// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let currentFilter = "all";


// Save tasks
function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}


// Add task
taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") {
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        priority: priorityInput.value,
        dueDate: dateInput.value,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskForm.reset();

    priorityInput.value = "Medium";

    renderTasks();

});


// Display tasks
function renderTasks() {

    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase().trim();

    let filteredTasks = tasks.filter(function (task) {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText);

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        return matchesSearch && matchesFilter;

    });


    // Show empty message
    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

        if (tasks.length === 0) {
            emptyMessage.textContent =
                "No tasks yet. Add your first task!";
        } else {
            emptyMessage.textContent =
                "No matching tasks found.";
        }

    } else {

        emptyMessage.style.display = "none";

    }


    // Create task cards
    filteredTasks.forEach(function (task) {

        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("completed");
        }


        // Checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;

        checkbox.setAttribute(
            "aria-label",
            "Mark task as completed"
        );

        checkbox.addEventListener("change", function () {

            toggleTask(task.id);

        });


        // Task content
        const taskContent = document.createElement("div");
        taskContent.className = "task-content";

        const taskTitle = document.createElement("p");
        taskTitle.className = "task-title";

        taskTitle.textContent = task.title;


        const taskMeta = document.createElement("div");
        taskMeta.className = "task-meta";


        // Priority
        const priorityBadge = document.createElement("span");

        priorityBadge.className =
            `priority ${task.priority}`;

        priorityBadge.textContent =
            `${task.priority} Priority`;

        taskMeta.appendChild(priorityBadge);


        // Due date
        if (task.dueDate) {

            const dueDate = document.createElement("span");

            dueDate.textContent =
                `Due: ${formatDate(task.dueDate)}`;

            taskMeta.appendChild(dueDate);

        }


        taskContent.appendChild(taskTitle);
        taskContent.appendChild(taskMeta);


        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {

            deleteTask(task.id);

        });


        // Add elements to task card
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);

    });


    updateDashboard();

}


// Format date
function formatDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


// Complete or uncomplete task
function toggleTask(id) {

    tasks = tasks.map(function (task) {

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


// Delete task
function deleteTask(id) {

    tasks = tasks.filter(function (task) {

        return task.id !== id;

    });

    saveTasks();

    renderTasks();

}


// Search tasks
searchInput.addEventListener("input", function () {

    renderTasks();

});


// Filter tasks
filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        renderTasks();

    });

});


// Clear completed tasks
clearCompletedButton.addEventListener("click", function () {

    tasks = tasks.filter(function (task) {

        return !task.completed;

    });

    saveTasks();

    renderTasks();

});


// Update dashboard
function updateDashboard() {

    const total = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const active = total - completed;

    totalTasks.textContent = total;
    activeTasks.textContent = active;
    completedTasks.textContent = completed;

    remainingTasks.textContent =
        `${active} task${active !== 1 ? "s" : ""} remaining`;

}


// Initial display
renderTasks();
