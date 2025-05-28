// project import
import { Component, inject } from '@angular/core';
import { FormsModule,FormGroup,FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { Login } from '../../model/user.model';
import { ToastrService } from 'ngx-toastr';
import { InputBoxComponent } from '../../comman/components/UI/input-box/input-box.component';
import { ButtonComponent } from '../../comman/components/UI/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [UserService, ToastrService],
  imports: [
    RouterModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    InputBoxComponent,
    ButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private router: Router, private toastr: ToastrService) {}
  userService = inject(UserService);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'
      ),
    ]),
  });

  onLogin() {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach((field) => {
        const control = this.loginForm.get(field);
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
      });
      return;
    }
    const data: Login = {
      user_email: this.loginForm.value.email as string,
      user_password: this.loginForm.value.password as string,
    };
    this.userService.loginUser(data).subscribe({
      next: (res: any) => {
        if (res.status) {
          localStorage.setItem('token', res.data);
          localStorage.setItem('isLoggedIn', 'true');
          this.toastr.success('User login successfully');
          this.router.navigate(['/home']);
        } else {
          this.toastr.error('User not logged in', 'error');
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }
}


