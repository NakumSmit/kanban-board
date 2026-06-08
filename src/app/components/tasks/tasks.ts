import {
  Component,
  Input,
  signal,
  OnInit,
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
import { ApiTasksService } from '../../services/api-tasks/api-tasks.service';
import { Tasks } from '../../models/tasks';
import { ApiTasks } from '../../models/tasks';
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
export class TasksComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  constructor(private apiTaskService: ApiTasksService) {}

  @ViewChildren('columnScrollContainer')
  columnScrollContainers!: QueryList<ElementRef<HTMLElement>>;
  private destroy$ = new Subject<void>();

  @Input() tasks: Tasks[] = [];
  @Output() viewTask = new EventEmitter<Tasks>();
  @Output() taskStatusChanged = new EventEmitter<Tasks[]>();
  @Input() searchTerm: string = '';
  @Input() selectedPriority: string = '';
  @Input() selectedAssignee: string = '';
  users: ApiTasks[] = [] ;
  connectedDropLists: taskStatus[] = ['todo', 'in-progress', 'review', 'done'];

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
  
  ngOnInit() {
    this.apiTaskService.getTasks()
    .pipe(takeUntil(this.destroy$))
    .subscribe((res: any) => {
      this.users = res;
    });
  }

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

  organizeTasksByColumn() {
    const filteredTasks = this.tasks.filter((task) => this.matchesCurrentFilters(task));
    this.columns.forEach((column) => {
      column.tasks = filteredTasks.filter((task) => task.status === column.status);
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

  drop(event: CdkDragDrop<Tasks[]>, newStatus: taskStatus): void {
    const movedTask = event.item.data as Tasks;

    if (!movedTask) {
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
      (task) => task.taskId === movedTask.taskId,
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

    const visibleTaskIds = new Set(updatedVisibleTasks.map((task) => String(task.taskId)));

    const visibleQueue = [...updatedVisibleTasks];

    const updatedAllTasks = this.tasks.map((task) => {
      if (visibleTaskIds.has(String(task.taskId))) {
        return visibleQueue.shift()!;
      }

      return task;
    });

    this.tasks = updatedAllTasks;

    this.organizeTasksByColumn();

    this.taskStatusChanged.emit(this.tasks);
  }
}
