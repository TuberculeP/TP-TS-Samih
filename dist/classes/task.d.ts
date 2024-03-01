import { TpTask } from "../types/index.js";
declare abstract class TaskManager {
    static _search: string;
    static _dateFilter: Date | null;
    static _priorityFilter: 0 | 1 | 2 | null;
    static _tagsDom: HTMLSelectElement | null;
    static _filterTag: string | null;
    static _sortBy: "date" | "priority";
    static _sortOrder: "asc" | "desc";
    static _watcher: (all: Task[]) => void;
    static allTasks: Task[];
    static search(query: string): void;
    static filterByPriority(prio: 0 | 1 | 2 | null): void;
    static filterByDate(date: string | null): void;
    static registerTagSelect(select: HTMLSelectElement | null): void;
    static updateTagsSelect(): void;
    static sortBy(sort: string, order?: "asc" | "desc"): void;
    static triggerWatcher(): void;
    static getSortBy: () => string;
    static setWatcher(callback: (all: Task[]) => void): void;
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
export declare class Task extends TaskManager implements TpTask.Type {
    private _name;
    private _dueDate;
    private _tags;
    private _priority;
    private _description;
    constructor({ name, due_date, priority, tags, description, }: TpTask.Props);
    getPriority: () => 0 | 1 | 2;
    getDescription: () => string;
    getTags: () => string[];
    getName: () => string;
    getDueDate(toString?: boolean): string | Date;
    suicide(): void;
    hasTag: (tag: string) => boolean;
    toHtml(): HTMLElement;
}
export {};
