import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { TasksComponent } from '../tasks/tasks';
import { AddTaskModalComponent } from '../add-task-modal/add-task-modal';
import { Tasks } from '../../models/tasks';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TasksComponent, AddTaskModalComponent],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})

export class BoardComponent implements OnInit, OnDestroy {

  modalMode: 'create' | 'edit' | 'view' = 'create';
  selectedTask?: Tasks;
  tasks: Tasks[] = [];
  filteredTasks: Tasks[] = [];
  isTaskModalOpen: boolean = false;
  private searchSubject = new Subject<string>();
  private latestSearchTerm = '';
  private destroy$ = new Subject<void>();
  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchTasks();
    this.searchSubject.pipe(
      map((value) => (value ?? '').trim()),
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe((searchTerm) => {
      this.ngZone.run(() => {
        this.applySearch(searchTerm);
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchTasks() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.tasks = JSON.parse(tasks);
    }
    this.filteredTasks = [...this.tasks];
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.latestSearchTerm = value.trim();
    this.searchSubject.next(value);
  }

  applySearch(searchTerm: string) {
    this.latestSearchTerm = searchTerm;
    if (!searchTerm) {
      this.filteredTasks = [...this.tasks];
      return;
    }
    const normalized = searchTerm.toLowerCase();
    this.filteredTasks = this.tasks.filter((task) =>
      task.title.toLowerCase().includes(normalized),
    );
  }

  addNewTask(task: Tasks) {
    this.tasks = [...this.tasks, task];
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.applySearch(this.latestSearchTerm);
  }

  updateTask(updatedTask: Tasks) {
    this.tasks = this.tasks.map(task => task.taskId === updatedTask.taskId ? updatedTask : task);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.applySearch(this.latestSearchTerm);
    this.closeTaskModal();
  }

  deleteTask(taskId: string) {
    this.tasks = this.tasks.filter(task => task.taskId !== taskId);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.applySearch(this.latestSearchTerm);
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
}
