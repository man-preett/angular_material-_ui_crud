
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
  import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  imports: [MatRadioModule, MatFormFieldModule, ReactiveFormsModule],
  styleUrls: ['./radio.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RadioComponent,
      multi: true,
    },
  ],
})
export class RadioComponent implements ControlValueAccessor {
  @Input() options: any;
  @Input() label: string = '';
  @Output() selectionChange = new EventEmitter<any>();
  value: any;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
      this.value = this.options[0]?.value;
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

 
  ngOnChanges(changes: SimpleChanges): void {
    if (this.options.length && !this.value) {
      // If no value is set, default to the first option
      this.value = this.options[0]?.value;
    }
  }

  onSelectionChange(value: any) {
    this.value = value;
    this.selectionChange.emit(value);
    console.log('Selected value:', value);
    this.onChange(value);
    this.onTouched();
  }
}