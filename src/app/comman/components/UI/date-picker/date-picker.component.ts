import { Component, forwardRef, Input } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-date-picker',
  imports: [
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
  ],
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class DatePickerComponent implements ControlValueAccessor {
  constructor(private datepipe: DatePipe) {}
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() name: string = '';
  value: any = '';

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {}

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value ? new Date(value) : '';
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  updateValue(event: any): void {
    const formattedDate = this.datepipe.transform(event.value, 'yyyy-MM-dd');
    const dateValue = formattedDate ? formattedDate : null;
    this.onChange(dateValue); // Pass the formatted date to parent form
    this.value = dateValue;
  }
}
