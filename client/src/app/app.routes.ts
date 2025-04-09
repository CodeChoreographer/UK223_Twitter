import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () =>
        import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
        import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
        import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: '**',
    loadComponent: () =>
        import('./error-page/error-page.component').then(
            (m) => m.ErrorPageComponent
        ),
    data: {
      title: 'Seite nicht gefunden',
      errorCode: '404',
      errorMessage: 'Seite nicht gefunden',
    },
  },
];
