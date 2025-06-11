import { Routes } from '@angular/router';
import { PrivateComponent } from './private.component';
import { UsersComponent } from './users/users.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProjectsComponent } from './projects/projects.component';
import { AddProjectComponent } from './add-project/add-project.component';

export const privateRoutes: Routes = [
  {
    path: '',
    component: PrivateComponent,
    children: [
      {
        path: '',
        component: ProjectsComponent,
      },
      {
        path: 'myprofile',
        component: MyProfileComponent,
      },
      {
        path: 'update-profile',
        component: UpdateProfileComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'add-project',
        component: AddProjectComponent,
      },
      {
        path: 'update-project/:id',
        component: AddProjectComponent,
      },
      {
        path: '**',
        component: ProjectsComponent,
        redirectTo: '',
      },
    ],
  },
];
