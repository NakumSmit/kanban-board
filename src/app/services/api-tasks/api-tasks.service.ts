import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiTasks, Tasks } from '../../models/tasks';

@Injectable({
  providedIn: 'root'
})
export class ApiTasksService {

  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getBoardTasks(): Observable<Tasks[]> {
    return this.http.get< Tasks[] >(this.apiUrl).pipe(
      map((tasks: Tasks[]) => tasks.map((task: Tasks) => ({...task, dueDate: new Date(task.dueDate)})))
    );
  }

  addTask(task: Tasks): Observable<Tasks>{
    return this.http.post<Tasks>(this.apiUrl, task);
  }

  updateTask(task: Tasks): Observable<Tasks>{
    return this.http.put<Tasks>(`${this.apiUrl}/${task.id}`, task);
  }

  deleteTask(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
