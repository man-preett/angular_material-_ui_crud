import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
export type Theme = 'dark' | 'light';
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  
  constructor() {
    this.setTheme(this.getLocalStorageTheme());
  }

  document = inject(DOCUMENT);

  setTheme(theme: Theme) {
     localStorage.setItem('prefered theme', theme);
    if (theme === 'dark') {
      this.document.documentElement.classList.add('dark-mode');
    } else {
      this.document.documentElement.classList.remove('dark-mode');
    }
  }
  getLocalStorageTheme() {
    return localStorage.getItem('prefered theme') as Theme;
  }
}
