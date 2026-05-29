import { Component, OnInit } from '@angular/core';
import { TasksComponent } from '../tasks/tasks';
import { AddTaskModalComponent } from '../add-task-modal/add-task-modal';
import { Tasks } from '../../models/tasks';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TasksComponent, AddTaskModalComponent],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})

export class BoardComponent implements OnInit {

  modalMode: 'create' | 'edit' | 'view' = 'create';
  selectedTask?: Tasks;
  tasks: Tasks[] = [];
  filteredTasks: Tasks[] = [];
  isTaskModalOpen: boolean = false;

  ngOnInit() {
    this.fetchTasks();
  }

  fetchTasks() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.tasks = JSON.parse(tasks);
    }
    this.filteredTasks = [...this.tasks];
  }

  addNewTask(task: Tasks) {
    this.tasks = [...this.tasks, task];
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  updateTask(updatedTask: Tasks) {
    this.tasks = this.tasks.map(task => task.taskId === updatedTask.taskId ? updatedTask : task);
    this.filteredTasks = [...this.tasks];
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.closeTaskModal();
  }

  deleteTask(taskId: string) {
    this.tasks = this.tasks.filter(task => task.taskId !== taskId);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  openAddTaskModal() {
    this.modalMode = 'create';
    this.selectedTask = undefined;
    this.isTaskModalOpen = true;
  }

  openEditTaskModal(task: Tasks) {
    this.modalMode = 'edit';
    this.selectedTask = task;
    this.isTaskModalOpen = true;
  }

  openViewTaskModal(task: Tasks) {
    this.modalMode = 'view';
    this.selectedTask = task;
    this.isTaskModalOpen = true;
  }

  closeTaskModal() {
    this.isTaskModalOpen = false;
  }

  searchTasks(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    if (searchTerm.trim() === '') {
      this.fetchTasks();
    } else {
      this.tasks = this.filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
  }
}
