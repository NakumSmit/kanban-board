import { Component } from '@angular/core';
import { TasksComponent } from '../tasks/tasks';
import { AddTaskModalComponent } from '../add-task-modal/add-task-modal';
import { Tasks } from '../../models/tasks';

@Component({
  selector: 'app-board',
  standalone:true,
  imports: [TasksComponent, AddTaskModalComponent],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class BoardComponent {

  ngOnInit(){
    this.fetchTasks();
  }
  
  fetchTasks(){
    const tasks = localStorage.getItem('tasks');
    if(tasks){
      this.tasks = JSON.parse(tasks);
    }
  }
  
  tasks: Tasks[] = [];
  isAddTaskModalOpen:boolean = false;

  addNewTask(task: Tasks){
    this.tasks.push(task);

    localStorage.setItem('tasks',JSON.stringify(this.tasks));
  }
  
  openAddTaskModal(){
    this.isAddTaskModalOpen = true;
  }

  closeAddTaskModal(){
    this.isAddTaskModalOpen = false;
  }
}
