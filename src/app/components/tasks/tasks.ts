import { Component, signal } from '@angular/core';
import { Userdata } from '../../services/userdata';
import { Input } from '@angular/core';
import { Tasks } from '../../models/tasks';
@Component({
  selector: 'app-tasks',
  standalone:true,
  imports: [],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.scss'],
})
export class TasksComponent {

  @Input() tasks: Tasks[] = [];
  users = signal<any[]>([]);

  constructor(private userdata: Userdata) {}

  ngOnInit() {
    this.userdata.getUserData().subscribe((res: any) => {
      this.users.set(res);
    })
  }
}
