import { Injectable } from '@angular/core';
import { Profile } from '../interfaces/auth';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class BehaviorService {
  constructor() {}
  Profilesubject = new BehaviorSubject<Profile>({
    user_first_name: '',
    user_last_name: ''
  })
  currentProfile = this.Profilesubject.asObservable();

  setProfile(profile: Profile) {
    this.Profilesubject.next({
      user_first_name: profile.user_first_name,
      user_last_name: profile.user_last_name,
    });
  }

  private resizeTrigger = new Subject<void>();
  resize = this.resizeTrigger.asObservable();

  triggerResize() {
    this.resizeTrigger.next();
  }
}
