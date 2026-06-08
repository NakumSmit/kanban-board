import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiTasks } from '../../models/tasks';

@Injectable({
  providedIn: 'root'
})
export class ApiTasksService {

  private apiUrl = 'https://dummyjson.com/c/6147-2c97-496c-995d'

  constructor(private http: HttpClient) {}

  getTasks(): Observable<ApiTasks[]> {
    return this.http.get<ApiTasks[]>(this.apiUrl); 
  }
}
