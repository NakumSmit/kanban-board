import {
  Component,
  Input,
  signal,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { DatePipe, TitleCasePipe, NgClass } from '@angular/common';
import { Userdata } from '../../services/userdata';
import { Tasks } from '../../models/tasks';
import { ViewTaskModal } from '../view-task-modal/view-task-modal';

interface KanbanColumn {
  title: string;
  status: string;
  class: string;
  tasks: Tasks[];
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, NgClass, ViewTaskModal],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.scss', '../../app.scss'],
})

export class TasksComponent implements OnInit, OnChanges {

  @Input() tasks: Tasks[] = [];

  users = signal<any[]>([]);

  columns: KanbanColumn[] = [
    {
      title: 'Todo',
      status: 'todo',
      class: 'todo-title',
      tasks: []
    },
    {
      title: 'In Progress',
      status: 'in-progress',
      class: 'in-progress-title',
      tasks: []
    },
    {
      title: 'Testing',
      status: 'testing',
      class: 'testing-title',
      tasks: []
    },
    {
      title: 'Done',
      status: 'done',
      class: 'done-title',
      tasks: []
    }
  ];

  constructor(private userdata: Userdata) { }

  isViewTaskModalOpen:boolean = false;
  selectedTask?:Tasks;
  @Output() taskView = new EventEmitter<Tasks>();

  ngOnInit() {
    this.userdata.getUserData().subscribe((res: any) => {
      this.users.set(res);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tasks']) {
      this.organizeTasksByColumn();
    }
  }

  organizeTasksByColumn() {
    this.columns.forEach(column => {
      column.tasks = this.tasks.filter(
        task => task.status === column.status
      );
    });
  }

  editViewTask(task: Tasks) {
    console.log(task);
    this.selectedTask = task;
    this.isViewTaskModalOpen = true;
    // console.log(this.selectedTask);
    this.taskView.emit(task);
  }
  
  closeViewTaskModal(){
    this.isViewTaskModalOpen = false;
    this.selectedTask = undefined;
  }

}