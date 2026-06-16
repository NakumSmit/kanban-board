export interface Tasks {
    id?: number,
    title: string,
    description: string,
    priority: "high" | "medium" | "low",
    dueDate: Date,
    assignedUser: string,
    status: "todo" | "in-progress" | "review" | "done",
    isCompleted?: boolean,
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

export interface Users {
    id: number,
    username: string,
    email: string,
    password: string,
    role: string,
}