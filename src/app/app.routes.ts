import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard-component/dashboard-component';
import { LoginComponent } from './login-component/login-component';


export const routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
//   { path: 'forgot-password', component: ForgotPasswordComponent },
   { path: 'dashboard', component: DashboardComponent }
];
