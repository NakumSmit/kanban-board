import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { TasksComponent } from '../tasks/tasks';
import { AddTaskModalComponent } from '../add-task-modal/add-task-modal';
import { Tasks } from '../../models/tasks';
import { ApiTasksService } from '../../services/api-tasks/api-tasks.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { BoardLoaderComponent } from '../board-loader/board-loader.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TasksComponent, AddTaskModalComponent, BoardLoaderComponent],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})

export class BoardComponent implements OnInit, OnDestroy {

  loggedInUSer = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  role: string = this.loggedInUSer.role;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  selectedTask?: Tasks;
  tasks: Tasks[] = [];
  filteredTasks: Tasks[] = [];
  isTaskModalOpen: boolean = false;
  selectedPriority: string = '';
  selectedAssignee: string = '';
  displaySearchTerm: string = '';
  isLoading: boolean = true;
  private searchSubject = new Subject<string>();
  private latestSearchTerm = '';
  private destroy$ = new Subject<void>();
  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private apiTaskService: ApiTasksService,
  ) {}

  ngOnInit() {
    this.startBoardLoading();

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

  startBoardLoading(){
    this.isLoading = true;

    setTimeout(() => {
      this.fetchTasks();
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 999);
  }

  fetchTasks() {

    this.apiTaskService.getBoardTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load tasks from API', error);
        this.tasks = [];
        this.applyFilters();
        this.cdr.detectChanges();
      },
    });
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.latestSearchTerm = value.trim();
    this.searchSubject.next(value);
  }

  applySearch(searchTerm: string) {
    this.latestSearchTerm = searchTerm;
    this.displaySearchTerm = searchTerm;
    this.applyFilters();
  }

  resetFilters(){
    this.displaySearchTerm = '';  
    this.latestSearchTerm = '';
    this.selectedAssignee = '';
    this.selectedPriority = '';
    this.searchSubject.next('');
    this.applyFilters();
  }

  addNewTask(task: Tasks) {
    this.apiTaskService.addTask(task).subscribe({
      next: () => {
        this.fetchTasks();
      },
      error: (error) =>{
        console.log('Failed to add task', error);
      },
    });
  }

  updateTask(updatedTask: Tasks) {
    this.apiTaskService.updateTask(updatedTask).subscribe({
      next: () => {
        this.fetchTasks();
        this.closeTaskModal();
      },
      error: (error) => {
        console.log('failed to update task', error);
      },
    });
  }

  deleteTask(id: number) {
    this.apiTaskService.deleteTask(id).subscribe({
      next: () => {
        this.selectedPriority = '';
        this.selectedAssignee = '';
        this.fetchTasks();
      },
      error: (error) => {
        console.log('Failed to delete task', error);
      },
    });
  }

  openAddTaskModal() {
    this.modalMode = 'create';
    this.selectedTask = undefined;
    this.isTaskModalOpen = true;
    this.role;
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

  onPriorityFilterChange(event: Event) {
    this.selectedPriority = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  uniqueAssignees(): string[] {
    const normalizedMap = new Map<string, string>();
    this.tasks.forEach(task => {
      const assignee = task.assignedUser?.trim();
      if (assignee) {
        const key = assignee.toLowerCase();
        if(!normalizedMap.has(key)){
          normalizedMap.set(key, assignee);
        }
      }    
    });
    return Array.from(normalizedMap.values()).sort((a, b) => a.localeCompare(b));
  }

  onAssigneeFilterChange(event: Event) {
    this.selectedAssignee = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  applyFilters() {
    const normalizedSearch = this.latestSearchTerm.trim().toLowerCase();
    const normalizedPriority = this.selectedPriority.trim().toLowerCase();
    const normalizedAssignee = this.selectedAssignee.trim().toLowerCase();

    this.filteredTasks = this.tasks.filter(task => {
      const taskTitle = task.title?.trim().toLowerCase() || '';
      const taskPriority = task.priority?.trim().toLowerCase() || '';
      const taskAssignee = task.assignedUser?.trim().toLowerCase() || '';

      const matchesSearch = !normalizedSearch || taskTitle.includes(normalizedSearch);
      const matchesPriority = !normalizedPriority || taskPriority === normalizedPriority;
      const matchesAssignee = !normalizedAssignee || taskAssignee === normalizedAssignee;

      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }
  updateTaskStatusAfterDrop(updatedTask: Tasks) {
    if(!updatedTask.id){
      return;
    }
    this.applyFilters();
    this.apiTaskService.updateTask(updatedTask).subscribe({
      next: () => {
        this.fetchTasks();
      },
      error: (error) => {
        console.log('Failed to update dropped task', error);
      },
    });
  }

  updateTaskCompleted(updatedTask: Tasks) {
    if (!updatedTask.id) {
      return;
    }
    
    this.apiTaskService.updateTask(updatedTask).subscribe({
      next: () => {
        this.fetchTasks();
      },
      error: (error) => {
        console.log('Failed to update task completion', error);
      },
    });
  }
}
