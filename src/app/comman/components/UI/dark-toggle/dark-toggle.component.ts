import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Theme, ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-dark-toggle',
  imports: [MatSidenavModule, MatSlideToggleModule, MatToolbarModule],
  templateUrl: './dark-toggle.component.html',
  styleUrl: './dark-toggle.component.scss',
})
export class DarkToggleComponent {
  currentTheme: string = '';
  constructor() {
    this.currentTheme = this.themeService.getLocalStorageTheme();
  }
  themeService = inject(ThemeService);

  changeTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }
}
