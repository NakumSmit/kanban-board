import {
  Component,
  Input,
  signal,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { DatePipe, TitleCasePipe, NgClass } from '@angular/common';
import { Userdata } from '../../services/userdata';
import { Tasks } from '../../models/tasks';

interface KanbanColumn {
  title: string;
  status: string;
  class: string;
  tasks: Tasks[];
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, NgClass],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.scss'],
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
  }

}