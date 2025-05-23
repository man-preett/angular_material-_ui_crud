import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Route, Router, RouterModule } from '@angular/router';
import { InputBoxComponent } from '../../comman/components/UI/input-box/input-box.component';
import { ButtonComponent } from '../../comman/components/UI/button/button.component';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, RouterModule, InputBoxComponent,ButtonComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ChangePasswordForm = new FormGroup({
    currentPass: new FormControl('', Validators.required),
    newPass: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'
      ),
    ]),
    confirmPass: new FormControl('', Validators.required),
  });

  ChangePassword() {
    if (this.ChangePasswordForm.invalid) {
      Object.keys(this.ChangePasswordForm.controls).forEach((field) => {
        const control = this.ChangePasswordForm.get(field);
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
      });
      return;
    }
    const confirm_pass = this.ChangePasswordForm.get('confirmPass')?.value;
    const data = {
      current_password: this.ChangePasswordForm.get('currentPass')?.value,
      new_password: this.ChangePasswordForm.get('newPass')?.value,
    };
    this.userService.changePassword(data).subscribe({
      next: (res: any) => {
        if (data.new_password == confirm_pass) {
          if (res.status) {
            this.toastr.success('Password Changed successfully');
            this.router.navigate(['/home']);
          } 
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }
  onBack() {
    this.router.navigate(["/home"])
  }
}
