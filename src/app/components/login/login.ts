import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {

  private fb = inject(FormBuilder);

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

      localStorage.setItem(
        'user',
        JSON.stringify(this.loginForm.value)
      );

      console.log(this.loginForm.value);

      this.loginForm.reset();
    }
  }
}