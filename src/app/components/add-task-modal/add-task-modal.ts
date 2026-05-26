import { Component, EventEmitter, Output } from '@angular/core';
import { Tasks } from '../../models/tasks';
import { FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-task-modal',
  standalone:true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-task-modal.html',
  styleUrls: ['./add-task-modal.scss','../../app.scss'],
})
export class AddTaskModalComponent {


  taskForm = new FormGroup({
      title: new FormControl("",[
        Validators.required,
        Validators.minLength(3),
        Validators.pattern("[a-zA-Z].*")
      ]),
      description: new FormControl("",[
        Validators.required,
        Validators.minLength(10),
        Validators.pattern("[a-zA-Z].*")
      ]),
      priority: new FormControl("",Validators.required),
      dueDate: new FormControl("",Validators.required),
      assignedUser: new FormControl("",[
        Validators.required,
        Validators.pattern("[a-zA-Z].*")
      ]),
      status: new FormControl("",Validators.required)
    })




  @Output() closeModal = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<Tasks>();

    close(): void {
      this.closeModal.emit();
    }

    private generateTaskId():string{
      const date = new Date().getTime();
      const random = Math.random();
      const id = `TASK-${date.toString(16).toUpperCase()}-${random.toString(16).slice(2).toUpperCase()}`;
      return id;
    }

    get title() {
      return this.taskForm.get('title');
    }
    get description(){
      return this.taskForm.get('description');
    }
    get priority(){
      return this.taskForm.get('priority');
    }
    get dueDate(){
      return this.taskForm.get('dueDate');
    }
    get assignedUser(){
      return this.taskForm.get('assignedUser');
    }
    get status(){
      return this.taskForm.get('status');
    }

  addTask(){

    if(this.taskForm.valid){

    const newTask: Tasks = {
      taskId: this.generateTaskId(),
      title: this.taskForm.value.title!,
      description: this.taskForm.value.description!,
      priority: this.taskForm.value.priority! as "high" | "medium" | "low",
      dueDate: new Date(this.taskForm.value.dueDate!),
      assignedUser: this.taskForm.value.assignedUser!,
      status: this.taskForm.value.status! as "todo" | "in-progress" | "testing" | "done"
    }    
    
    this.taskCreated.emit(newTask);
    this.taskForm.reset();
    this.close();
   }else{
    this.taskForm.markAllAsTouched();
   }
  }

}
