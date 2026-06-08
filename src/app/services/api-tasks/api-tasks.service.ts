import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiTasks, Tasks } from '../../models/tasks';

@Injectable({
  providedIn: 'root'
})
export class ApiTasksService {

  private apiUrl = 'https://dummyjson.com/c/6147-2c97-496c-995d'

  constructor(private http: HttpClient) {}

  getTasks(): Observable<ApiTasks[]> {
    return this.http
      .get<{ tasks: ApiTasks[] }>(this.apiUrl)
      .pipe(map((response) => response.tasks));
  }

  getBoardTasks(): Observable<Tasks[]> {
    return this.http.get<{ tasks: ApiTasks[] }>(this.apiUrl).pipe(
      map((response) => response.tasks.map((task) => this.mapApiTaskToTask(task)))
    );
  }

  private mapApiTaskToTask(apiTask: ApiTasks): Tasks {
    return {
      taskId: apiTask.id,
      title: apiTask.title,
      description: apiTask.description,
      priority: apiTask.priority,
      dueDate: new Date(apiTask.date),
      assignedUser: apiTask.user,
      status: apiTask.status,
    };
  }
}
