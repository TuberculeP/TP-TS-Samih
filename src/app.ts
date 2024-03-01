import { Task } from "./classes/task.js";
import { onFormSubmit, onStart } from "./utils/eventTriggered.js";
import { alterFormSubmit, switchPrio } from "./utils/appUtils.js";

// when all DOM is loaded
onStart(() => {

  // avoid taskForm submit
  alterFormSubmit(
    document.querySelector<HTMLFormElement>("#taskForm") as HTMLFormElement,
    onFormSubmit
  );

  // register tag filter, it will be filled automatically by all tasks tags
  Task.registerTagSelect(document.querySelector("#filterTag"));

  // whenever a modification is made, update the task container
  const taskContainer = document.querySelector<HTMLDivElement>("#tasks");

  Task.setWatcher((allTasks) => {
    if (!taskContainer) return;
    taskContainer.innerHTML = "";
    taskContainer.append(...(allTasks?.map((t) => t.toHtml()) as Node[]));
  });

  // retrieve ancient data from localStorage
  JSON.parse(localStorage.getItem("all-tasks") ?? "[]").forEach(
    ({
      _name,
      _dueDate,
      _tags,
      _priority,
      _description,
    }: {
      _name: string;
      _dueDate: string;
      _tags: string[];
      _priority: 0 | 1 | 2;
      _description: string;
    }) => {
      new Task({
        name: _name,
        due_date: new Date(_dueDate),
        tags: _tags,
        priority: _priority,
        description: _description,
      });
    }
  );

  // watch for search input
  document.querySelector("#searchInput")?.addEventListener("input", (e) => {
    Task.search((e.target as HTMLInputElement).value);
  });

  // watch for priority filter
  document.querySelector("#filterPriority")?.addEventListener("change", (e) => {
    const value = (e.target as HTMLSelectElement).value;
    if (value === "all") {
      Task.filterByPriority(null);
    } else {
      Task.filterByPriority(switchPrio(value) as 0 | 1 | 2);
    }
  });

  // watch for date filter
  document.querySelector("#filterDate")?.addEventListener("input", (e) => {
    const date = (e.target as HTMLInputElement).value;
    Task.filterByDate(date);
  });

  // Sorts

  document.querySelector("#sort-by")?.addEventListener("change", (e) => {
    const value = (e.target as HTMLSelectElement).value;
    Task.sortBy(value);
  });

  document.querySelector("#sort-order")?.addEventListener("change", (e) => {
    const value = (e.target as HTMLSelectElement).value;
    Task.sortBy(Task.getSortBy(), value as "asc" | "desc");
  });
});
