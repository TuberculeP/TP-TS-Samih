import { alterFormSubmit } from "./appUtils.js";
import { onFormSubmit } from "./eventTriggered.js";
export const createModal = (task) => {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
        <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Modifier une tâche</h2>
        <form id="task-form">
            <label for="taskTitle">Task name:</label>
            <input type="text" id="taskTitle" name="task-name" required value="${task.getName()}">
            <label for="taskDueDate">Due date:</label>
            <input type="date" id="taskDueDate" name="due-date" required value="${task.getDueDate().toISOString().split("T")[0]}">
            <label for="taskPriority">Priority:</label>
            <select id="taskPriority" name="priority">
              <option value="high" ${task.getPriority() === 0 ? "selected" : ""}>Haute</option>
              <option value="medium" ${task.getPriority() === 1 ? "selected" : ""}>Moyenne</option>
              <option value="low" ${task.getPriority() === 2 ? "selected" : ""}>Basse</option>
            </select>
            <label for="add-tags">Tags:</label>
            <input type="text" id="add-tags" name="tags" value="${task
        .getTags()
        .join(", ")}">
            <label for="taskDescription">Description:</label>
            <textarea id="taskDescription" name="taskDescription">${task.getDescription()}</textarea>
            <input type="submit" value="Modifier la tâche">
        </form>
        </div>
    `;
    modal.querySelector(".close")?.addEventListener("click", () => {
        modal.remove();
    });
    modal.addEventListener("click", ({ target }) => {
        if (target === modal)
            modal.remove();
    });
    alterFormSubmit(modal.querySelector("#task-form"), (form) => {
        onFormSubmit(form);
        task.suicide();
        modal.remove();
    });
    return modal;
};
