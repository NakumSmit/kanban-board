export interface Tasks {
    taskId: number,
    title: string,
    description: string,
    priority: "high" | "medium" | "low",
    dueDate: Date,
    assignedUser: string,
    status: "todo" | "in-progress" | "testing" | "done",
}
