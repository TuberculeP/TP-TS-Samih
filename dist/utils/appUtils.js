export function alterFormSubmit(form, callback) {
    if (!form)
        return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        callback(form, e);
    });
}
export function switchPrio(prio) {
    const isString = typeof prio === "string";
    let newPrio = isString ? 0 : "high";
    if (isString) {
        switch (prio) {
            case "high":
                newPrio = 0;
                break;
            case "medium":
                newPrio = 1;
                break;
            case "low":
                newPrio = 2;
                break;
        }
    }
    else {
        switch (prio) {
            case 0:
                newPrio = "high";
                break;
            case 1:
                newPrio = "medium";
                break;
            case 2:
                newPrio = "low";
                break;
        }
    }
    return newPrio;
}
