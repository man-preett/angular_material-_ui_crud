import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-tabs',
  imports: [MatTabsModule, RouterLink, MatIconModule, NgFor, NgIf],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  @Input() tabs: Array<{
    label: string;
    items: Array<{
      title: string;
      icon: string;
      url?: string;
      action?: () => void;
    }>;
  }> = [];
  @Output() dropdownClose = new EventEmitter<void>();

  closeDropdown() {
    this.dropdownClose.emit(); 
  }
}
