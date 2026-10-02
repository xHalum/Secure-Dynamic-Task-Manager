const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");
const loadSamplesBtn = document.querySelector("#loadSamplesBtn");
const taskList = document.querySelector("#taskList");
const taskMessage = document.querySelector("#taskMessage");
const totalCount = document.querySelector("#totalCount");
const pendingCount = document.querySelector("#pendingCount");
const completedCount = document.querySelector("#completedCount");

let taskNumber = 0;

function createTaskElement(taskText, taskId) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    taskItem.dataset.taskId = taskId;
    taskItem.dataset.state = "pending";

    const textSpan = document.createElement("span");
    textSpan.classList.add("task-text");
    textSpan.textContent = taskText;

    const completeButton = document.createElement("button");
    completeButton.classList.add("complete-btn");
    completeButton.type = "button";
    completeButton.textContent = "Complete";

    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.type = "button";
    editButton.textContent = "Edit";

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-btn");
    removeButton.type = "button";
    removeButton.textContent = "Remove";

    taskItem.append(textSpan, completeButton, editButton, removeButton);

    return taskItem;
}

function addTask(taskText) {
    const text = taskText.trim();

    if (!text) {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }

    taskNumber += 1;
    const taskId = `task-${taskNumber}`;
    const taskItem = createTaskElement(text, taskId);

    taskList.append(taskItem);
    taskInput.value = "";
    taskMessage.textContent = "";
    updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
    const isCompleted = taskItem.classList.toggle("completed");

    if (isCompleted) {
        taskItem.dataset.state = "completed";
    } else {
        taskItem.dataset.state = "pending";
    }

    updateTaskCounts();
}

function beginTaskEdit(taskItem) {
    const textSpan = taskItem.querySelector(".task-text");
    const editButton = taskItem.querySelector(".edit-btn");

    const editInput = document.createElement("input");
    editInput.classList.add("edit-input");
    editInput.type = "text";
    editInput.value = textSpan.textContent;

    textSpan.replaceWith(editInput);
    editButton.textContent = "Save";
    editInput.focus();
}

function saveTaskEdit(taskItem) {
    const editInput = taskItem.querySelector(".edit-input");
    const editButton = taskItem.querySelector(".edit-btn");

    if (!editInput) return;

    const newText = editInput.value.trim();

    if (!newText) {
        taskMessage.textContent = "Task cannot be empty";
        editInput.focus();
        return;
    }

    const textSpan = document.createElement("span");
    textSpan.classList.add("task-text");
    textSpan.textContent = newText;

    editInput.replaceWith(textSpan);
    editButton.textContent = "Edit";
    taskMessage.textContent = "";
}

function removeTask(taskItem) {
    taskItem.remove();
    updateTaskCounts();
}

function updateTaskCounts() {
    const tasks = taskList.querySelectorAll(".task-item");
    let completed = 0;

    tasks.forEach((task) => {
        if (task.dataset.state === "completed") {
            completed += 1;
        }
    });

    const total = tasks.length;
    const pending = total - completed;

    totalCount.textContent = total;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}

function handleTaskListClick(event) {
    const button = event.target;

    if (!button.matches(".complete-btn") &&
        !button.matches(".edit-btn") &&
        !button.matches(".remove-btn")
    ) {
        return;
    }

    const taskItem = button.closest(".task-item");

    if (!taskItem) return;

    if (button.matches(".complete-btn")) {
        toggleTaskComplete(taskItem);
    } else if (button.matches(".edit-btn")) {
        if (button.textContent === "Save") {
            saveTaskEdit(taskItem);
        } else {
            beginTaskEdit(taskItem);
        }
    } else if (button.matches(".remove-btn")) {
        removeTask(taskItem);
    }
}

function loadSampleTasks() {
    if (taskList.children.length > 0) {
        return;
    }

    const samples = [
        "Review DOM selectors",
        "Practice createElement",
        "Study event delegation"
    ];

    const fragment = document.createDocumentFragment();

    samples.forEach((sample) => {
        taskNumber += 1;
        const taskItem = createTaskElement(sample, `task-${taskNumber}`);
        fragment.append(taskItem);
    });

    taskList.append(fragment);
    taskMessage.textContent = "";
    updateTaskCounts();
}

addTaskBtn.addEventListener("click", () => {
    addTask(taskInput.value);
});

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask(taskInput.value);
    }
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);


taskList.addEventListener("click", handleTaskListClick);

updateTaskCounts();