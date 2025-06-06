  import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-chips',
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss',
})
export class ChipsComponent {
  @Input() names: string[] = [];
  // remove(name: string) {
  //   this.names = this.names.filter((n) => n !== name);
  //   console.log(this.names, 'this.namess');
  // }
  @Output() chipClick = new EventEmitter<string>();

  onChipClick(key: string) {
    const formattedKey = key.split(':')[0].toLowerCase().replace(/\s+/g, '_');
    this.chipClick.emit(formattedKey);
  }
}
