import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-button',
  imports: [MatIconModule, NgIf],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() class: string = '';
  @Input() type: string = '';

  @Output() click = new EventEmitter<void>();

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.click.emit();
  }
}
