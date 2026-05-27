import { Component, OnInit } from '@angular/core';
import { TasksComponent } from '../tasks/tasks';
import { AddTaskModalComponent } from '../add-task-modal/add-task-modal';
import { Tasks } from '../../models/tasks';
import { ViewTaskModal } from '../view-task-modal/view-task-modal';  
@Component({
  selector: 'app-board',
  standalone:true,
  imports: [TasksComponent, AddTaskModalComponent, ViewTaskModal],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class BoardComponent implements OnInit {

  ngOnInit(){
    this.fetchTasks();
  }
  
  fetchTasks(){
    const tasks = localStorage.getItem('tasks');
    if(tasks){
      this.tasks = JSON.parse(tasks);
    }
    this.filteredTasks = [...this.tasks];
  }
  
  tasks: Tasks[] = [];
  filteredTasks: Tasks[] = [];
  isAddTaskModalOpen:boolean = false;

  addNewTask(task: Tasks){
    this.tasks = [...this.tasks, task];

    localStorage.setItem('tasks',JSON.stringify(this.tasks));
  }
  
  openAddTaskModal(){
    this.isAddTaskModalOpen = true;
  }

  closeAddTaskModal(){
    this.isAddTaskModalOpen = false;
  }

  searchTasks(event:Event){
    const searchTerm = (event.target as HTMLInputElement).value;
    if(searchTerm.trim() === ""){
      this.fetchTasks();
    }else{
      this.tasks = this.filteredTasks.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
  }

  selectedTask?: Tasks;
  isViewTaskModalOpen:boolean = false;
  
  closeViewTaskModal(){
    this.isViewTaskModalOpen = false;
    this.selectedTask = undefined;
  }
  
  editViewTask(task: Tasks) {
    this.selectedTask = task;
    this.isViewTaskModalOpen = true;
  }
}
