import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {

  loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  username = this.loggedInUser.username ?? 'User';
  role = this.loggedInUser.role ?? 'user';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
