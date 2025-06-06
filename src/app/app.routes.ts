import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { privateRoutes } from './private/private.routes';
import { authGuard, noAuthGuard } from './guards/auth.guard';
import { UsersComponent } from './private/users/users.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    loadChildren: () => authRoutes,
  },
  {
    path: 'projects',
    canActivate: [authGuard],
    loadChildren: () => privateRoutes,
  },
  { path: 'users', component: UsersComponent },
];
