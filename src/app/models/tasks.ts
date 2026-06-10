export interface Tasks {
    taskId: any,
    title: string,
    description: string,
    priority: "high" | "medium" | "low",
    dueDate: Date,
    assignedUser: string,
    status: "todo" | "in-progress" | "review" | "done",
}

export interface ApiTasks {
    id: number,
    title: string,
    description: string,
    priority: "high" | "medium" | "low",
    date: string,
    user: string,
    status: "todo" | "in-progress" | "review" | "done",
}