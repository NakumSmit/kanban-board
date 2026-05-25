export interface Tasks {
    taskId: any,
    title: string,
    description: string,
    priority: "high" | "medium" | "low",
    // priority: string,
    dueDate: Date,
    // dueDate: string,
    assignedUser: string,
    status: "todo" | "in-progress" | "testing" | "done",
    // status: string,
}
