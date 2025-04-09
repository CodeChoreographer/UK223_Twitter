import { Routes } from '@angular/router'
import { RegisterComponent } from './register/register.component'
import { LoginComponent } from './login/login.component'

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
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
]
