import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { authGuard } from './guard/auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./components/login/login').then(m => m.LoginComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./components/dashboard/dashboard').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: '/login'
    },
];
