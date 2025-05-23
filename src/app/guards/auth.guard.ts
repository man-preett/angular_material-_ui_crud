import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorService } from '../services/behavior.service';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const behaviorService = inject(BehaviorService);
  const userService = inject(UserService);
  const isLoggedin = localStorage.getItem('token');
  
  let profileData = [];
  userService.profile().subscribe({
    next: (res: any) => {
      profileData = res.data;
      behaviorService.setProfile({
        user_first_name: res.data.user_first_name,
        user_last_name: res.data.user_last_name,
      });
    },
  });
  if (!isLoggedin) {
    toastr.error('User is not Loggedin', 'error');
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};

export const noAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const isLoggedin = localStorage.getItem('token');
  if (isLoggedin) {   
    toastr.success('User is already loggedin');
    router.navigate(['/home']);
    return true;
  }
  return true;
};