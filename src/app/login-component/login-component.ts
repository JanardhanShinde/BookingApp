import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login(form: NgForm) {

    if (form.invalid) {
      alert('Please enter valid details');
      return;
    }

    // Fake login success (later connect API)
    console.log('Login Success');

    this.router.navigate(['/dashboard']);
  }
  goToSignup() {
  this.router.navigate(['/signup']);
}
}
