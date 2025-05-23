export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Home',
        type: 'item',
        classes: 'nav-item',
        url: '/home',
        icon: 'dashboard',
        breadcrumbs: false,
      },
    ],
  },
  {
    id: 'authentication',
    title: 'Authentication',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'login',
        title: 'Login',
        type: 'item',
        classes: 'nav-item',
        url: '/auth/login',
        icon: 'login',
        target: true,
        breadcrumbs: false,
      },
      {
        id: 'register',
        title: 'Register',
        type: 'item',
        classes: 'nav-item',
        url: '/auth/signup',
        icon: 'profile',
        target: true,
        breadcrumbs: false,
      },
    ],
  },
  {
    id: 'utilities',
    title: 'UI Components',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'myprofile',
        title: 'myprofile',
        type: 'item',
        classes: 'nav-item',
        url: '/home/myprofile',
        icon: 'font-size',
      },
      {
        id: 'users',
        title: 'users',
        type: 'item',
        classes: 'nav-item',
        url: '/home/users',
        icon: 'chrome',
      },
    ],
  },
];
