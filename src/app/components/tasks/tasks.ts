import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { DatePipe, TitleCasePipe, NgClass } from '@angular/common';
import { Tasks } from '../../models/tasks';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

type taskStatus = 'todo' | 'in-progress' | 'review' | 'done';
interface KanbanColumn {
  title: string;
  status: taskStatus;
  class: string;
  tasks: Tasks[];
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, NgClass, DragDropModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.scss', '../../app.scss'],
})
export class TasksComponent implements OnChanges, AfterViewInit, OnDestroy {

  @ViewChildren('columnScrollContainer')
  columnScrollContainers!: QueryList<ElementRef<HTMLElement>>;
  private destroy$ = new Subject<void>();

  @Input() tasks: Tasks[] = [];
  @Output() viewTask = new EventEmitter<Tasks>();
  @Output() taskStatusChanged = new EventEmitter<Tasks>();
  @Output() taskCompletedChanged = new EventEmitter<Tasks>();
  @Input() searchTerm: string = '';
  @Input() selectedPriority: string = '';
  @Input() selectedAssignee: string = '';
  connectedDropLists: taskStatus[] = ['todo', 'in-progress', 'review', 'done'];
  loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  role = this.loggedInUser.role || 'user';
  permissionMessage = '';
  private moveErrorMessage = '';

  columns: KanbanColumn[] = [
    {
      title: 'Todo',
      status: 'todo',
      class: 'todo-title',
      tasks: [],
    },
    {
      title: 'In Progress',
      status: 'in-progress',
      class: 'in-progress-title',
      tasks: [],
    },
    {
      title: 'Review',
      status: 'review',
      class: 'review-title',
      tasks: [],
    },
    {
      title: 'Done',
      status: 'done',
      class: 'done-title',
      tasks: [],
    },
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['tasks'] ||
      changes['searchTerm'] ||
      changes['selectedPriority'] ||
      changes['selectedAssignee']
    ) {
      this.organizeTasksByColumn();
    }
  }
  
  ngAfterViewInit() {
    this.columnScrollContainers.forEach((container, index) => {
      const column = this.columns[index];
      if (!column) {
        return;
      }
      fromEvent(container.nativeElement, 'scroll')
      .pipe(
        throttleTime(500),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.onColumnScroll(column.title);
      });
    });
  }
  onColumnScroll(columnTitle: string) {
    console.log(`${columnTitle} column scrolling`);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private sortTaskByPriority(tasks: Tasks[]){
    const priorityOrder: Record<string, number> = { 
      high: 1,
      medium: 2,
      low: 3,
    };

    return [...tasks].sort((a, b) => {
      const aPriority = a.priority?.trim().toLowerCase() || '';
      const bPriority = b.priority?.trim().toLowerCase() || '';
      return priorityOrder[aPriority] - priorityOrder[bPriority];
    });
  }

  organizeTasksByColumn() {
    const filteredTasks = this.tasks.filter((task) => this.matchesCurrentFilters(task));
    this.columns.forEach((column) => {
      column.tasks = filteredTasks.filter((task) => task.status === column.status);

      column.tasks = this.sortTaskByPriority(column.tasks);
    });
  }

  canMarkCompleted(task: Tasks): boolean{
    const loggedInUsername = this.loggedInUser.username?.trim().toLowerCase();
    const taskAssignee = task.assignedUser?.trim().toLowerCase();

    return(
      this.role === 'admin' ||
      this.role === 'hr' ||
      loggedInUsername === taskAssignee
    );
  }

  markTaskCompleted(task: Tasks, event: Event): void {
    event.stopPropagation();
    if(!this.canMarkCompleted(task)){
      this.showPermissionMessage(
        'You cannot complete tasks assigned to another user.'
      );
      return;
    }
    task.isCompleted = !task.isCompleted;
    this.taskCompletedChanged.emit({
      ...task
    });
  }

  matchesCurrentFilters(task: Tasks): boolean {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();
    const normalizedPriority = this.selectedPriority.trim().toLowerCase();
    const normalizedAssignee = this.selectedAssignee.trim().toLowerCase();

    const taskTitle = task.title?.trim().toLowerCase() || '';
    const taskDescription = task.description?.trim().toLowerCase() || '';
    const taskPriority = task.priority?.trim().toLowerCase() || '';
    const taskAssignee = task.assignedUser?.trim().toLowerCase() || '';

    const matchesSearch =
      !normalizedSearch ||
      taskTitle.includes(normalizedSearch);

    const matchesPriority = !normalizedPriority || taskPriority === normalizedPriority;

    const matchesAssignee = !normalizedAssignee || taskAssignee === normalizedAssignee;

    return matchesSearch && matchesPriority && matchesAssignee;
  }

  editViewTask(task: Tasks) {
    this.viewTask.emit(task);
  }
  
  private showPermissionMessage(message: string): void {
    this.permissionMessage = message;
    setTimeout(() => {
      this.permissionMessage = '';
    }, 3000);
  }
  
  private canEditTask(task: Tasks): boolean {
    if (this.role === 'admin') {
      return true;
    }
    if (this.role === 'hr') {
      return true;
    }
    const loggedInUsername = this.loggedInUser.username?.trim().toLowerCase();
    const taskAssignee = task.assignedUser?.trim().toLowerCase();
    const isAssignedToCurrentUser = loggedInUsername === taskAssignee;
    const isEditableStatus =
    task.status === 'todo' ||
    task.status === 'in-progress';
    return isAssignedToCurrentUser && isEditableStatus;
  }

  private canDragTask(task: Tasks): boolean {
    if (this.role === 'admin' || this.role === 'hr') {
      return true;
    }
    const loggedInUsername = this.loggedInUser.username?.trim().toLowerCase();
    const taskAssignee = task.assignedUser?.trim().toLowerCase();
    return loggedInUsername === taskAssignee;
  }

  private canMoveTask(
    task: Tasks,
    currentStatus: taskStatus,
    targetStatus: taskStatus
  ): boolean {

    this.moveErrorMessage = '';

    if (currentStatus === targetStatus) {
      return true;
    }

    if (this.role === 'admin') {
      if(currentStatus ==='in-progress' &&
        targetStatus === 'review' &&
        !task.isCompleted
      ){
        this.moveErrorMessage =
        'Task must be marked completed before moving to Review.';
        return false;
      }
      return true;
    }

    if (this.role === 'hr') {
      if (
        currentStatus === 'in-progress' &&
        targetStatus === 'review' &&
        !task.isCompleted
      ) {
        this.moveErrorMessage = 
        'Task must be marked completed before moving to Review.';
        return false;
      }
      const allowedMove = 
      (currentStatus === 'todo' && targetStatus === 'in-progress') ||
      (currentStatus === 'in-progress' && targetStatus === 'todo') ||
      (currentStatus === 'in-progress' && targetStatus === 'review') ||
      (currentStatus === 'review' && targetStatus === 'in-progress');

      if(!allowedMove){
        this.moveErrorMessage = 
        `Access denied: ${this.role.toUpperCase()} cannot move task from ${currentStatus} to ${targetStatus}.`
      }
      return allowedMove;
    }
    const allowedMove = 
    (currentStatus === 'todo' && targetStatus === 'in-progress') ||
    (currentStatus === 'in-progress' && targetStatus === 'todo'); 

    if(!allowedMove){
      this.moveErrorMessage =
      `Access denied: ${this.role.toUpperCase()} cannot move task from ${currentStatus} to ${targetStatus}.`;
    }
    return allowedMove;
  }

  drop(event: CdkDragDrop<Tasks[]>, newStatus: taskStatus): void {
    const movedTask = event.item.data as Tasks;

    if (!movedTask) {
      return;
    }
    
    if (!this.canDragTask(movedTask)) {
      this.showPermissionMessage(
        'You can move only tasks assigned to you.'
      );
      this.organizeTasksByColumn();
      return;
    }
    const oldStatus = event.previousContainer.id as taskStatus;
    if(
      event.previousContainer !== event.container && 
      !this.canMoveTask(movedTask, oldStatus, newStatus)
    ){
      if(this.moveErrorMessage){
        this.showPermissionMessage(this.moveErrorMessage);
      }

      this.organizeTasksByColumn();
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    const movedTaskIndexInColumn = event.container.data.findIndex(
      (task) => task.id === movedTask.id,
    );

    if (movedTaskIndexInColumn !== -1) {
      event.container.data[movedTaskIndexInColumn] = {
        ...event.container.data[movedTaskIndexInColumn],
        status: newStatus,
      };
    }

    const updatedVisibleTasks = this.columns.flatMap((column) =>
      column.tasks.map((task) => ({
        ...task,
        status: column.status,
      })),
    );

    const visibleTaskIds = new Set(updatedVisibleTasks.map((task) => String(task.id)));

    const visibleQueue = [...updatedVisibleTasks];

    const updatedAllTasks = this.tasks.map((task) => {
      if (visibleTaskIds.has(String(task.id))) {
        return visibleQueue.shift()!;
      }

      return task;
    });

    this.tasks = updatedAllTasks;

    this.organizeTasksByColumn();
    
    this.taskStatusChanged.emit({...movedTask,status: newStatus});
  }
}
