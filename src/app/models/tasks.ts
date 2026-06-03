export interface Tasks {
    taskId: any,
    title: string,
    description: string,
    priority: "high" | "medium" | "low",
    dueDate: Date,
    assignedUser: string,
    status: "todo" | "in-progress" | "review" | "done",
}
