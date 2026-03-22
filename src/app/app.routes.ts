import { Routes } from '@angular/router';
import { LoginComponent } from './LoginComponent/logincomponent/logincomponent';
import { ForgotPasswordComponent } from './Forgot Password Page/forgot-passwordcomponent/forgot-passwordcomponent';
import { DashboardComponent } from './DashboardComponent/dashboard.component/dashboard.component';

export const routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
   { path: 'dashboard', component: DashboardComponent }
];
