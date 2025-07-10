import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ButtonComponent } from '../../comman/components/UI/button/button.component';
import { MyProfile } from '../../interfaces/auth';
import { UsersService } from '../../api-client';
@Component({
  selector: 'app-my-profile',
  imports: [ButtonComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent {
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private usersService : UsersService
  ) {}
  user: MyProfile | null = null;
  ngOnInit() {
    this.myProfile();
  }
  myProfile() {
    this.usersService.myProfileApiUsersMyprofileGet().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.user = res.data;
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.detail);
      },
    });
  }
  onEdit() {
    this.router.navigate(['/projects/update-profile']);
  }
}
