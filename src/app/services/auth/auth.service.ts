import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly loginKey = 'isLoggedIn';
  
  login(email: string, password: string): boolean {
    if(email && password){
      localStorage.setItem(this.loginKey, 'true');
      return true;
    }

    return false;
  }

  logout(): void{
    localStorage.removeItem(this.loginKey);
  }

  isLoggedIn(): boolean{
    return localStorage.getItem(this.loginKey) === 'true';
  }
}
