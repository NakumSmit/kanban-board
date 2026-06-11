import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss', '../../app.scss'],
})

export class LoginComponent {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  user: any;
  loginError ='';
  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get username() {
    return this.loginForm.get('username');
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email ?? '';
      const password = this.loginForm.value.password ?? '';
      const userNameValue = this.loginForm.value.username ?? '';
      const success = this.authService.login(email, password);
      if(success){
      localStorage.setItem('username', userNameValue);
      this.loginForm.reset();
      this.router.navigate(['/dashboard']);
      } else {
        this.loginError = 
        'Invalid email or password. Please try again.';
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
