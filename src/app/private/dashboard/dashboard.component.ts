import { Component } from '@angular/core';
import { PrivateComponent } from '../private.component';
import { UsersComponent } from '../users/users.component';

@Component({
  selector: 'app-dashboard',
  imports: [PrivateComponent,UsersComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
