import { Component, forwardRef, Input } from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ControlValueAccessor,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-input-box',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputBoxComponent),
      multi: true,
    },
  ],
  templateUrl: './input-box.component.html',
  styleUrl: './input-box.component.scss',
})
export class InputBoxComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = '';
  @Input() placeholder: string = '';
  @Input() name: string = '';
  value: any = '';

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {}

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;      
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputChange(event: any): void {
    this.onChange(event.target.value);
  }
}
