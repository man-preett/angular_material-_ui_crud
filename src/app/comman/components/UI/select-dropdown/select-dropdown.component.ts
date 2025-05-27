import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-select-dropdown',
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDropdownComponent),
      multi: true,
    },
  ],
  templateUrl: './select-dropdown.component.html',
  styleUrl: './select-dropdown.component.scss',
})
export class SelectDropdownComponent implements ControlValueAccessor {
  @Input() options: any;
  @Input() label: string = '';
  @Input() value: string = '';
  @Output() click = new EventEmitter<void>();
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {}

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {      
      this.value = value;
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputChange(value: any): void {
    this.value = value;
    this.onChange(this.value);
    this.valueChange();
    this.onTouched();
  }
  valueChange(){
    this.click.emit();
  }
}
