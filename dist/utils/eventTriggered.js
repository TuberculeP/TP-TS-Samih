import { Task } from "../classes/task.js";
import { switchPrio } from "./appUtils.js";
function getAndClearValue(form, selector) {
    const inputElement = form.querySelector(selector);
    if (!inputElement)
        return null;
    const value = inputElement.value;
    if (!(inputElement instanceof HTMLSelectElement))
        inputElement.value = "";
    return value;
}
export function onFormSubmit(form) {
    if (!form)
        return;
    const name = getAndClearValue(form, "#taskTitle");
    const description = getAndClearValue(form, "#taskDescription");
    const date = getAndClearValue(form, "#taskDueDate");
    const priority = switchPrio(getAndClearValue(form, "#taskPriority"));
    const tagsRaw = getAndClearValue(form, "#add-tags");
    const tags = tagsRaw?.length ? tagsRaw?.split(",").map((t) => t.trim()) : [];
    if (!name || !description || !date)
        return alert("Please fill all (*) fields");
    new Task({
        name,
        description,
        due_date: new Date(date),
        priority,
        tags,
    });
}
export function onStart(callback) {
    document.addEventListener("DOMContentLoaded", callback);
}
