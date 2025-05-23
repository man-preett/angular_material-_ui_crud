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
    this.iconService.addIcon(
      ...[
        MenuUnfoldOutline,
        MenuFoldOutline,
        SearchOutline,
        BellOutline,
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
      ]
    );
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

  profile = [
    {
      icon: 'edit',
      title: 'Edit Profile',
      url: '/home/update-profile',
    },
    {
      icon: 'user',
      title: 'View Profile',
      url: '/home/myprofile',
    },
    {
      icon: 'user',
      title: 'Change password',
      url: '/home/change-password',
    },
  ];

  setting = [
    {
      icon: 'question-circle',
      title: 'Support',
    },
    {
      icon: 'user',
      title: 'Account Settings',
    },
    {
      icon: 'lock',
      title: 'Change',
    },
    {
      icon: 'comment',
      title: 'Feedback',
    },
    {
      icon: 'unordered-list',
      title: 'History',
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
