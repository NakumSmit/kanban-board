import { Component } from '@angular/core';
import { TasksComponent } from '../tasks/tasks';
@Component({
  selector: 'app-board',
  standalone:true,
  imports: [TasksComponent],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class BoardComponent {}
