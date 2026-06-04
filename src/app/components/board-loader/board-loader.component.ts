import { Component } from '@angular/core';

@Component({
  selector: 'app-board-loader',
  standalone: true,
  imports: [],
  templateUrl: './board-loader.component.html',
  styleUrl: './board-loader.component.scss'
})
export class BoardLoaderComponent {
  skeletonColumns = [
    { title: 'Todo', class: 'todo-title' },
    { title: 'In Progress', class: 'in-progress-title' },
    { title: 'Review', class: 'review-title' },
    { title: 'Done', class: 'done-title' },
  ];
  skeletonCards = [1, 2, 3];
}
