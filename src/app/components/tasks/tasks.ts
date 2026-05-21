import { Component, signal } from '@angular/core';
import { Userdata } from '../../services/userdata';

@Component({
  selector: 'app-tasks',
  imports: [],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class TasksComponent {
  users = signal<any[]>([]);

  constructor(private userdata: Userdata) {}

  ngOnInit() {
    this.userdata.getUserData().subscribe((res: any) => {
      this.users.set(res);
    })
  }
}
