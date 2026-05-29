import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Tasks } from '../../models/tasks';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-add-task-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-task-modal.html',
  styleUrls: ['./add-task-modal.scss', '../../app.scss'],
})

export class AddTaskModalComponent {

  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Input() selectedTask?: Tasks;

  @Output() closeModal = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<Tasks>();
  @Output() taskDeleted = new EventEmitter<string>();

  ngOnInit() {
    if (this.selectedTask) {
      this.taskForm.patchValue({
        title: this.selectedTask.title,
        description: this.selectedTask.description,
        priority: this.selectedTask.priority,
        dueDate: this.formatDate(this.selectedTask.dueDate),
        assignedUser: this.selectedTask.assignedUser,
        status: this.selectedTask.status,
      });
    }
    if (this.mode === 'view') {
      this.taskForm.disable();
    }
  }

  private formatDate(date: Date | string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  taskForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern('[a-zA-Z].*'),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.pattern('[a-zA-Z].*'),
    ]),
    priority: new FormControl('', Validators.required),
    dueDate: new FormControl('', Validators.required),
    assignedUser: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z].*')]),
    status: new FormControl('', Validators.required),
  });

  close(): void {
    this.closeModal.emit();
  }

  private generateTaskId(): string {
    const date = new Date().getTime();
    const random = Math.random();
    const id = `TASK-${date.toString(16).toUpperCase()}-${random.toString(16).slice(2).toUpperCase()}`;
    return id;
  }

  get title() {
    return this.taskForm.get('title');
  }
  get description() {
    return this.taskForm.get('description');
  }
  get priority() {
    return this.taskForm.get('priority');
  }
  get dueDate() {
    return this.taskForm.get('dueDate');
  }
  get assignedUser() {
    return this.taskForm.get('assignedUser');
  }
  get status() {
    return this.taskForm.get('status');
  }

  addTask() {
    if (this.taskForm.valid) {
      const newTask: Tasks = {
        taskId: this.generateTaskId(),
        title: this.taskForm.value.title!,
        description: this.taskForm.value.description!,
        priority: this.taskForm.value.priority! as 'high' | 'medium' | 'low',
        dueDate: new Date(this.taskForm.value.dueDate!),
        assignedUser: this.taskForm.value.assignedUser!,
        status: this.taskForm.value.status! as 'todo' | 'in-progress' | 'testing' | 'done',
      };
      this.taskCreated.emit(newTask);
      this.taskForm.reset();
      this.close();

    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  deleteTask(taskId: string) {
    this.taskDeleted.emit(taskId);
    this.close();
  }

  gotoEditMode() {
    this.mode = 'edit';
    this.taskForm.enable();
  }

  updateTask() {
    this.mode = 'edit';
    if (this.taskForm.valid && this.selectedTask) {
      const updatedTask: Tasks = {
        taskId: this.selectedTask.taskId,
        title: this.taskForm.value.title!,
        description: this.taskForm.value.description!,
        priority: this.taskForm.value.priority! as 'high' | 'medium' | 'low',
        dueDate: new Date(this.taskForm.value.dueDate!),
        assignedUser: this.taskForm.value.assignedUser!,
        status: this.taskForm.value.status! as 'todo' | 'in-progress' | 'testing' | 'done',
      };
      this.taskCreated.emit(updatedTask);
      this.taskForm.reset();
      this.close();
      this.selectedTask.taskId = updatedTask.taskId;
      // this.selectedTask.deleteTask();
    } else {
      this.taskForm.markAllAsTouched();
    }
  }
}
