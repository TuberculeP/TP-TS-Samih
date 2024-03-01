import { createModal } from "../utils/modal.js";
import { switchPrio } from "../utils/appUtils.js";
class TaskManager {
    // Manager properties
    static _search = "";
    static _dateFilter = null;
    static _priorityFilter = null;
    static _tagsDom = null;
    static _filterTag = null;
    static _sortBy = "priority";
    static _sortOrder = "desc";
    static _watcher = (_) => { };
    static allTasks = [];
    // Manager methods
    static search(query) {
        Task._search = query;
        Task.triggerWatcher();
    }
    static filterByPriority(prio) {
        Task._priorityFilter = prio;
        Task.triggerWatcher();
    }
    static filterByDate(date) {
        Task._dateFilter = date ? new Date(date) : null;
        Task.triggerWatcher();
    }
    static registerTagSelect(select) {
        Task._tagsDom = select;
        Task._tagsDom?.addEventListener("change", (e) => {
            const value = e.target.value;
            Task._filterTag = value.length > 0 ? value : null;
            Task.triggerWatcher();
        });
    }
    static updateTagsSelect() {
        const tags = new Set();
        Task.allTasks.forEach((t) => t.getTags().forEach((tag) => tags.add(tag)));
        if (Task._tagsDom) {
            Task._tagsDom.innerHTML = `
      <option value="" selected>Tous les tags</option>
      ${[...tags].map((t) => `<option value="${t}">${t}</option>`).join("")}
      `;
        }
    }
    static sortBy(sort, order) {
        Task._sortBy = sort;
        Task._sortOrder = order ?? Task._sortOrder;
        Task.triggerWatcher();
    }
    static triggerWatcher() {
        const filteredData = [...Task.allTasks].filter((t) => t.getName().includes(Task._search) &&
            (Task._priorityFilter === null
                ? true
                : t.getPriority() === Task._priorityFilter) &&
            (Task._dateFilter === null
                ? true
                : t.getDueDate().toLocaleDateString() ===
                    Task._dateFilter.toLocaleDateString()) &&
            (Task._filterTag === null ? true : t.hasTag(Task._filterTag)));
        const orderedData = filteredData.sort((a, b) => {
            const aDateTime = a.getDueDate().getTime();
            const bDateTime = b.getDueDate().getTime();
            if (Task._sortBy === "date") {
                return Task._sortOrder === "asc"
                    ? aDateTime - bDateTime
                    : bDateTime - aDateTime;
            }
            else {
                return Task._sortOrder === "asc"
                    ? a.getPriority() - b.getPriority()
                    : b.getPriority() - a.getPriority();
            }
        });
        Task._watcher(orderedData);
    }
    static getSortBy = () => Task._sortBy;
    static setWatcher(callback) {
        Task._watcher = callback;
    }
}
/**
 * @class Task
 * The main class of the project
 *
 * Task class is used to create, delete and filter/sort tasks
 *
 * It is used to manage a task itself and serves as Task manager.
 *
 * @implements TpTask.Type
 */
export class Task extends TaskManager {
    // Instance properties
    _name;
    _dueDate;
    _tags;
    _priority;
    _description;
    constructor({ name, due_date = new Date(), priority = 0, tags = [], description = "", }) {
        super();
        this._name = name;
        this._dueDate = due_date;
        this._tags = [...tags];
        this._priority = priority;
        this._description = description;
        Task.allTasks.push(this);
        Task.updateTagsSelect();
        Task.triggerWatcher();
    }
    // Instance methods
    getPriority = () => this._priority;
    getDescription = () => this._description;
    getTags = () => [...this._tags];
    getName = () => this._name;
    getDueDate(toString) {
        return toString ? this._dueDate.toLocaleDateString() : this._dueDate;
    }
    suicide() {
        const filteredData = [...Task.allTasks.filter((t) => t !== this)];
        Task.allTasks = filteredData;
        localStorage.setItem("all-tasks", JSON.stringify(filteredData));
        Task.triggerWatcher();
    }
    hasTag = (tag) => this._tags.includes(tag);
    toHtml() {
        const task = document.createElement("div");
        task.classList.add("task", switchPrio(this.getPriority()));
        task.innerHTML = `
    <h3>${this._name} <span>– Priorité ${(() => {
            switch (this.getPriority()) {
                case 0:
                    return "Haute";
                case 1:
                    return "Moyenne";
                case 2:
                    return "Basse";
            }
        })()}</span></h3>
    <p>Date d'échéance: ${this.getDueDate(true)}</p>
    <p>${this.getDescription()}</p>
    <div class="tags">
    ${this.getTags()
            .map((t) => `<span>${t}</span>`)
            .join("")}
    </div>
    <button type="button">Supprimer</button>
    <button class="edit-btn">Modifier</button>
    `;
        task
            .querySelector("button:first-of-type")
            ?.addEventListener("click", this.suicide);
        task
            .querySelector("button:last-of-type")
            ?.addEventListener("click", () => {
            document.body.appendChild(createModal(this));
        });
        return task;
    }
}
