// Angular import
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

// project import
import {
  NavigationItem,
  NavigationItems,
} from './navigation';


// project import
// icon
import { IconModule, IconService } from '@ant-design/icons-angular';
import {
  DashboardOutline,
  CreditCardOutline,
  LoginOutline,
  QuestionOutline,
  ChromeOutline,
  FontSizeOutline,
  ProfileOutline,
  BgColorsOutline,
  AntDesignOutline,
} from '@ant-design/icons-angular/icons';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgScrollbar, IconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', display: 'block' }),
        animate('250ms ease-in', style({ transform: 'translateY(0%)' })),
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  // public props
  @Output() NavCollapsedMob: EventEmitter<string> = new EventEmitter();
  @Output() showCollapseItem: EventEmitter<object> = new EventEmitter();

  @Input() item!: NavigationItem;

  navCollapsedMob;

  navigations: NavigationItem[];

  // version
  // title = 'Demo application for version numbering';
  // currentApplicationVersion = environment.appVersion;

  navigation = NavigationItems;
  windowWidth = window.innerWidth;

  // Constructor
  constructor(
    private location: Location,
    private locationStrategy: LocationStrategy,
    private iconService: IconService
  ) {
    this.windowWidth = window.innerWidth;
    this.navCollapsedMob = false;
    this.iconService.addIcon(
      ...[
        DashboardOutline,
        CreditCardOutline,
        FontSizeOutline,
        LoginOutline,
        ProfileOutline,
        BgColorsOutline,
        AntDesignOutline,
        ChromeOutline,
        QuestionOutline,
      ]
    );
    this.navigations = NavigationItems;
  }

  // Life cycle events
  ngOnInit() {
    if (this.windowWidth < 1025) {
      (document.querySelector('.coded-navbar') as HTMLDivElement).classList.add(
        'menupos-static'
      );
    }
    let current_url = this.location.path();
    // eslint-disable-next-line
    // @ts-ignore
    if (this.location['_baseHref']) {
      // eslint-disable-next-line
      // @ts-ignore
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const pre_parent = up_parent?.parentElement;
      const last_parent =
        up_parent?.parentElement?.parentElement?.parentElement?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (pre_parent?.classList.contains('coded-hasmenu')) {
        pre_parent.classList.add('coded-trigger');
        pre_parent.classList.add('active');
      }

      if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        if (pre_parent?.classList.contains('coded-hasmenu')) {
          pre_parent.classList.add('coded-trigger');
        }
      }
      last_parent!.classList.add('active');
    }
  }
  // public method
  navCollapse(e: MouseEvent) {
    let parent = e.target as HTMLElement;

    if (parent?.tagName === 'SPAN') {
      parent = parent.parentElement!;
    }

    parent = (parent as HTMLElement).parentElement as HTMLElement;

    const sections = document.querySelectorAll('.coded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      if (sections[i] !== parent) {
        sections[i].classList.remove('coded-trigger');
      }
    }

    let first_parent = parent.parentElement;
    let pre_parent = ((parent as HTMLElement).parentElement as HTMLElement)
      .parentElement as HTMLElement;
    if (first_parent?.classList.contains('coded-hasmenu')) {
      do {
        first_parent?.classList.add('coded-trigger');
        first_parent = (
          (first_parent as HTMLElement).parentElement as HTMLElement
        ).parentElement as HTMLElement;
      } while (first_parent.classList.contains('coded-hasmenu'));
    } else if (pre_parent.classList.contains('coded-submenu')) {
      do {
        pre_parent?.parentElement?.classList.add('coded-trigger');
        pre_parent = (
          ((pre_parent as HTMLElement).parentElement as HTMLElement)
            .parentElement as HTMLElement
        ).parentElement as HTMLElement;
      } while (pre_parent.classList.contains('coded-submenu'));
    }
    parent.classList.toggle('coded-trigger');
  }
  navCollapseMob() {
    if (this.windowWidth < 1025) {
      this.NavCollapsedMob.emit();
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
    }
  }

  closeOtherMenu(event: MouseEvent) {
    const ele = event.target as HTMLElement;
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement as HTMLElement;
      const up_parent = (
        (parent.parentElement as HTMLElement).parentElement as HTMLElement
      ).parentElement as HTMLElement;
      const last_parent = up_parent.parentElement;
      const sections = document.querySelectorAll('.coded-hasmenu');
      for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
        sections[i].classList.remove('coded-trigger');
      }

      if (parent.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
    }
    if (
      (
        document.querySelector('app-sidebar.pc-sidebar') as HTMLDivElement
      ).classList.contains('mob-open')
    ) {
      (
        document.querySelector('app-sidebar.pc-sidebar') as HTMLDivElement
      ).classList.remove('mob-open');
    }
  }

  subMenuCollapse(item: object) {
    this.showCollapseItem.emit(item);
  }
  navMob() {
    if (
      this.windowWidth < 1025 &&
      document
        .querySelector('app-sidebar.coded-navbar')!
        .classList.contains('mob-open')
    ) {
      this.NavCollapsedMob.emit();
    }
  }
 
}
