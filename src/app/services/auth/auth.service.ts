import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Users } from '../../models/tasks';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient){}
  
  private readonly usersUrl = 'https://kanban-board-api-lc6k.onrender.com/users';
  
  login(email: string, password: string): Observable<boolean>{
    return this.http.get<Users[]>(`${this.usersUrl}?email=${email}`).pipe(
      map(users => {
        const foundUser =users.find(user => 
          user.email === email && user.password === password
        );
        
        if(foundUser){
          localStorage.setItem('isLoggedIn', 'true');

          localStorage.setItem('loggedInUser', JSON.stringify({
            id: foundUser.id,
            username: foundUser.username,
            email: foundUser.email,
            role: foundUser.role
          }));
          
          return true;
        }
        
        return false;
      })
    );
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean{
    return localStorage.getItem('isLoggedIn') === 'true';  
  }

  getLoggedInUSer(): Users | null {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user): null;
  }

  logout(): void{
    localStorage.clear();
  }
}
