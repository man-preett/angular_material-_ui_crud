import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() class: string = '';

  @Output() click = new EventEmitter<void>();

  onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.click.emit();
  }
}
