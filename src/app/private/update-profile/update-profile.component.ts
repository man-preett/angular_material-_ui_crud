import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BehaviorService } from '../../services/behavior.service';
import { InputBoxComponent } from '../../comman/components/UI/input-box/input-box.component';
import { ButtonComponent } from '../../comman/components/UI/button/button.component';
import { SelectDropdownComponent } from '../../comman/components/UI/select-dropdown/select-dropdown.component';

@Component({
  selector: 'app-update-profile',
  imports: [ReactiveFormsModule, InputBoxComponent,ButtonComponent,SelectDropdownComponent],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss',
})
export class UpdateProfileComponent {
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private behaviorService: BehaviorService
  ) {}
  user: any;
  genderOptions: any = [
    { value: 'female', display: 'Female' },
    { value: 'male', display: 'Male' },
  ];
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  ProfileGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.profileData();
    this.getCountry();
  }
  profileData() {
    this.userService.profile().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.user = res.data;
          this.ProfileGroup.patchValue({
            firstName: this.user.user_first_name,
            lastName: this.user.user_last_name,
            age: this.user.user_age,
            gender: this.user.user_gender,
            country: this.user.user_country,
            state: this.user.user_state ,
            city: this.user.user_city ,
          });
          this.getState();
          this.getCity();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }
  getCountry() {
    this.userService.country().subscribe({
      next: (res: any) => {
        if (res.status) {
          // this.countries = res.data;
          this.countries = res.data.map((country: any) => ({
            value: country.country_name,
            display: country.country_name,
          }));
          
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }
  getState() {
    
    const user_country = this.ProfileGroup.get('country')?.value;
    const data = {
      country_name: user_country,
    };
    if (data.country_name) {
      this.userService.state(data)?.subscribe({
        next: (res: any) => {
          if (res.status) {
            this.states = res.data.map((state:any) => ({
              value: state.state_name,
              display:state.state_name
            }))
          }
        },
        error: (err) => {
          this.toastr.error(err.message);
        },
      });
    }
  }
  getCity() {
    const user_state = this.ProfileGroup.get('state')?.value;
    const data = {
      state_name: user_state,
    };
    if (data.state_name) {
      this.userService.city(data)?.subscribe({
        next: (res: any) => {
          if (res.status) {
            this.cities = res.data.map((city:any) => ({
              value: city.city_name,
              display:city.city_name
            }))
          }
        },
        error: (err) => {
          this.toastr.error(err.message);
        },
      });
    }
  }
  updateData() {
    if (this.ProfileGroup.invalid) {
      Object.keys(this.ProfileGroup.controls).forEach((field) => {
        const control = this.ProfileGroup.get(field);
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
      });
      return;
    }
    const data: any = {
      user_first_name: this.ProfileGroup.value.firstName,
      user_last_name: this.ProfileGroup.value.lastName,
      user_age: this.ProfileGroup.value.age,
      user_gender: this.ProfileGroup.value.gender,
      user_country: this.ProfileGroup.value.country,
      user_state: this.ProfileGroup.value.state,
      user_city: this.ProfileGroup.value.city ,
    };
    this.userService.updateProfile(data).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.behaviorService.setProfile({
           user_first_name: res.data.user_first_name,
           user_last_name: res.data.user_last_name,
         });
          this.toastr.success('Profile updated successfully');
          this.router.navigate(['/projects/myprofile']);
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }
}
