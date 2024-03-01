import { TpTask } from "../types/index.js";
import { createModal } from "../utils/modal.js";
import { switchPrio } from "../utils/appUtils.js";

abstract class TaskManager {
  // Manager properties
  static _search: string = "";
  static _dateFilter: Date | null = null;
  static _priorityFilter: 0 | 1 | 2 | null = null;
  static _tagsDom: HTMLSelectElement | null = null;
  static _filterTag: string | null = null;
  static _sortBy: "date" | "priority" = "priority";
  static _sortOrder: "asc" | "desc" = "desc";
  static _watcher: (all: Task[]) => void = (_) => {};
  static allTasks: Task[] = [];

  // Manager methods
  static search(query: string): void {
    Task._search = query;
    Task.triggerWatcher();
  }

  static filterByPriority(prio: 0 | 1 | 2 | null): void {
    Task._priorityFilter = prio;
    Task.triggerWatcher();
  }

  static filterByDate(date: string | null) {
    Task._dateFilter = date ? new Date(date) : null;
    Task.triggerWatcher();
  }

  static registerTagSelect(select: HTMLSelectElement | null) {
    Task._tagsDom = select;
    Task._tagsDom?.addEventListener("change", (e) => {
      const value = (e.target as HTMLSelectElement).value;
      Task._filterTag = value.length > 0 ? value : null;
      Task.triggerWatcher();
    });
  }

  static updateTagsSelect() {
    const tags = new Set<string>();
    Task.allTasks.forEach((t) => t.getTags().forEach((tag) => tags.add(tag)));
    if (Task._tagsDom) {
      Task._tagsDom.innerHTML = `
      <option value="" selected>Tous les tags</option>
      ${[...tags].map((t) => `<option value="${t}">${t}</option>`).join("")}
      `;
    }
  }

  static sortBy(sort: string, order?: "asc" | "desc") {
    Task._sortBy = sort as "date" | "priority";
    Task._sortOrder = order ?? (Task._sortOrder as "asc" | "desc");
    Task.triggerWatcher();
  }

  static triggerWatcher(): void {
    const filteredData = [...Task.allTasks].filter(
      (t) =>
        t.getName().includes(Task._search) &&
        (Task._priorityFilter === null
          ? true
          : t.getPriority() === Task._priorityFilter) &&
        (Task._dateFilter === null
          ? true
          : (t.getDueDate() as Date).toLocaleDateString() ===
            Task._dateFilter.toLocaleDateString()) &&
        (Task._filterTag === null ? true : t.hasTag(Task._filterTag))
    );
    const orderedData = filteredData.sort((a, b) => {
      const aDateTime = (a.getDueDate() as Date).getTime();
      const bDateTime = (b.getDueDate() as Date).getTime();
      if (Task._sortBy === "date") {
        return Task._sortOrder === "asc"
          ? aDateTime - bDateTime
          : bDateTime - aDateTime;
      } else {
        return Task._sortOrder === "asc"
          ? a.getPriority() - b.getPriority()
          : b.getPriority() - a.getPriority();
      }
    });
    Task._watcher(orderedData);
  }
  static getSortBy = (): string => Task._sortBy;
  static setWatcher(callback: (all: Task[]) => void): void {
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
export class Task extends TaskManager implements TpTask.Type {
  // Instance properties
  private _name: string;
  private _dueDate: Date;
  private _tags: string[];
  private _priority: 0 | 1 | 2;
  private _description: string;

  constructor({
    name,
    due_date = new Date(),
    priority = 0,
    tags = [],
    description = "",
  }: TpTask.Props) {
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

  public getPriority = (): 0 | 1 | 2 => this._priority;

  public getDescription = (): string => this._description;

  public getTags = (): string[] => [...this._tags];

  public getName = (): string => this._name;

  public getDueDate(toString?: boolean): string | Date {
    return toString ? this._dueDate.toLocaleDateString() : this._dueDate;
  }

  public suicide(): void {
    const filteredData = [...Task.allTasks.filter((t) => t !== this)];
    Task.allTasks = filteredData;
    localStorage.setItem("all-tasks", JSON.stringify(filteredData));
    Task.triggerWatcher();
  }

  public hasTag = (tag: string): boolean => this._tags.includes(tag);

  public toHtml(): HTMLElement {
    const task = document.createElement("div");
    task.classList.add(
      "task",
      switchPrio(this.getPriority() as number) as string
    );
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
      .querySelector<HTMLButtonElement>("button:first-of-type")
      ?.addEventListener("click", this.suicide);
    task
      .querySelector<HTMLButtonElement>("button:last-of-type")
      ?.addEventListener("click", () => {
        document.body.appendChild(createModal(this));
      });
    return task;
  }
}
