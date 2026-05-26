import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tasks } from '../../models/tasks';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-view-task-modal',
  standalone: true,
  imports: [NgClass],
  templateUrl: './view-task-modal.html',
  styleUrls: ['./view-task-modal.scss','../add-task-modal/add-task-modal.scss'],
})
export class ViewTaskModal {

    @Input() task!: Tasks;  
    @Output() closeModal = new EventEmitter<void>();  

    close(){
        this.closeModal.emit();
    }
}
