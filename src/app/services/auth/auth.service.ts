import { Injectable } from '@angular/core';

interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private allowedUsers: User[] = [
    {
      email: 'admin@gmail.com',
      password: 'admin@123',
    },
    {
      email: 'smitnakum9@gmail.com',
      password: 'Smit#789',
    }
  ];
  
  login(email: string, password: string): boolean {
    const userExits = this.allowedUsers.some(user => 
      user.email === email && user.password === password
    );
    if(userExits) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      return true;
    }

    return false;
  }

  logout(): void{
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
  }

  isLoggedIn(): boolean{
    return localStorage.getItem('isLoggedIn') === 'true';  
  }
}
