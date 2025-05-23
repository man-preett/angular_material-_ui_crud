// Angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Project import
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
@Component({
  selector: 'app-private',
  imports: [
    CommonModule,
    // BreadcrumbComponent,
    SidebarComponent,
    RouterModule,
    HeaderComponent,
  ],
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss'],
})
export class PrivateComponent {
  // public props
  navCollapsed: boolean;
  navCollapsedMob: boolean;

  // public method
  navMobClick() {
    if (
      this.navCollapsedMob &&
      !document
        .querySelector('app-navigation.pc-sidebar')
        ?.classList.contains('mob-open')
    ) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
    if (
      document
        .querySelector('app-navigation.pc-sidebar')
        ?.classList.contains('navbar-collapsed')
    ) {
      document
        .querySelector('app-navigation.pc-sidebar')
        ?.classList.remove('navbar-collapsed');
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    if (
      document
        .querySelector('app-navigation.pc-sidebar')
        ?.classList.contains('mob-open')
    ) {
      document
        .querySelector('app-navigation.pc-sidebar')
        ?.classList.remove('mob-open');
    }
  }
  constructor() {
    this.navCollapsed = false;
    this.navCollapsedMob = true;
  }
}
