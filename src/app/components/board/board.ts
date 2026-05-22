import { Component } from '@angular/core';
import { TasksComponent } from '../tasks/tasks';
import { AddTaskModalComponent } from '../add-task-modal/add-task-modal';
@Component({
  selector: 'app-board',
  standalone:true,
  imports: [TasksComponent, AddTaskModalComponent],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class BoardComponent {

  isAddTaskModalOpen:boolean = false;
  
  openAddTaskModal(){
    this.isAddTaskModalOpen = true;
  }

  closeAddTaskModal(){
    this.isAddTaskModalOpen = false;
  }
}
