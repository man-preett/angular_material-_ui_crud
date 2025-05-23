import { Component, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDirective, IconService } from '@ant-design/icons-angular';
import {
  BellOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  SearchOutline,
  SettingOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline,
  GithubOutline,
} from '@ant-design/icons-angular/icons';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BehaviorService } from '../../services/behavior.service';
import { DarkToggleComponent } from '../../comman/components/UI/dark-toggle/dark-toggle.component';
import { style } from '@angular/animations';
import { TabsComponent } from "../../comman/components/UI/tabs/tabs.component";

@Component({
  selector: 'app-header',
  imports: [
    IconDirective,
    RouterModule,
    NgScrollbarModule,
    NgbNavModule,
    NgbDropdownModule,
    CommonModule,
    DarkToggleComponent,
    TabsComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  // public props
  NavCollapse = output();
  NavCollapsedMob = output();

  private iconService = inject(IconService);
  navCollapsed!: boolean;
  windowWidth: number;
  navCollapsedMob: boolean;
  styleSelectorToggle = input<boolean>();
  Customize = output();
  screenFull: boolean = true;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private profileSubject: BehaviorService
  ) {
    this.windowWidth = window.innerWidth;
    this.navCollapsedMob = false;
    this.navCollapsed = false;
 
  }

  // public method
  navCollapse() {
    if (this.windowWidth >= 1025) {
      this.navCollapsed = !this.navCollapsed;
      this.NavCollapse.emit();
    }
  }

  navCollapseMob() {
    if (this.windowWidth < 1025) {
      this.NavCollapsedMob.emit();
    }
  }

  userTabs = [
    {
      label: 'Profile',
      items: [
        { icon: 'edit', title: 'Edit Profile', url: '/home/update-profile' },
        { icon: 'person', title: 'View Profile', url: '/home/myprofile' },
        {
          icon: 'lock',
          title: 'Change password',
          url: '/home/change-password',
        },
        {
          icon: 'logout',
          title: 'Logout',
          action: () => this.onLogout(),
        },
      ],
    },
    {
      label: 'Settings',
      items: [
        { icon: 'help', title: 'Support', url: '/support' },
        {
          icon: 'settings',
          title: 'Account Settings',
          url: '/account-settings',
        },
        { icon: 'lock', title: 'Change', url: '/change' },
        { icon: 'feedback', title: 'Feedback', url: '/feedback' },
        { icon: 'history', title: 'History', url: '/history' },
      ],
    },
  ];

  onLogout() {
    localStorage.removeItem('token');
    this.toastr.success('User logged out successfully', 'success');
    this.router.navigate(['/auth/login']);
  }
  data: any;
  ngOnInit() {
    this.profileSubject.currentProfile.subscribe({
      next: (userProfile) => {
        this.data = userProfile;
      },
    });
  }
}
