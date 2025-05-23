// Angular import
import { Component, inject, Input, input } from '@angular/core';
import {
  FormControl,
  FormsModule,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Signup } from '../../model/user.model';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { InputBoxComponent } from '../../comman/components/UI/input-box/input-box.component';
import { ButtonComponent } from '../../comman/components/UI/button/button.component';

@Component({
  selector: 'app-register',
  providers: [UserService],
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    InputBoxComponent,
    ButtonComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private router: Router, private toastr: ToastrService) {}
  userService = inject(UserService);

  RegisterForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'
      ),
    ]),
  });

  onRegister() {

    if (this.RegisterForm.invalid) {

      Object.keys(this.RegisterForm.controls).forEach((field) => {
        const control = this.RegisterForm.get(field);
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
      });
      return;
    }

    const data: Signup = {
      user_first_name: this.RegisterForm.value.firstName as string,
      user_last_name: this.RegisterForm.value.lastName as string,
      user_email: this.RegisterForm.value.email as string,
      user_password: this.RegisterForm.value.password as string,
    };
    this.userService.registerUser(data).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.router.navigate(['/home']);
          this.toastr.success('User registered successfully');
        }
      },
      error: (err) => {        
        this.toastr.error(err.error.message);
      },
    });
  }
}
