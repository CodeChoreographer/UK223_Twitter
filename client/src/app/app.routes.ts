import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';

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
    path: 'profile',
    loadComponent: () => import('./edit-profile/edit-profile.component').then(m => m.EditProfileComponent
    )
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./admin-management/admin-management.component').then(m => m.AdminManagementComponent),
    canActivate: [AuthGuard, AdminGuard]
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
