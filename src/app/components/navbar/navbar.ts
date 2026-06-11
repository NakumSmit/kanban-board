import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {

  username = localStorage.getItem('username') ?? 'User';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    localStorage.removeItem('username');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
