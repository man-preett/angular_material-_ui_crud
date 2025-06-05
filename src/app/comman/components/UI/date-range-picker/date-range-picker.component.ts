import { Component, forwardRef, Input} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import {
  MatDateRangePicker,
  MatDateRangeInput,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-range-picker',
  imports: [
    MatInputModule,
    MatDateRangePicker,
    MatDateRangeInput,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,

  ],
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true,
    },
  ],
})
export class DateRangePickerComponent implements ControlValueAccessor {
  constructor(private datePipe: DatePipe) {}
  @Input() label: string = '';
  @Input() placeholderStart: string = '';
  @Input() placeholderEnd: string = '';
  @Input() name: string = '';
  @Input() startControl!: FormControl;
  @Input() endControl!: FormControl;

  value: { start: string | null; end: string | null } = {
    start: null,
    end: null,
  };

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(val: { start: string | null; end: string | null }): void {
    this.value = val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  updateValue() {
    
    const start = this.startControl.value;
    const end = this.endControl.value;

    const formatted = {
      start: start ? this.datePipe.transform(start, 'yyyy-MM-dd') : null,
      end: end ? this.datePipe.transform(end, 'yyyy-MM-dd') : null,
    };
    this.value = formatted;
    this.startControl.setValue(formatted.start);
    this.endControl.setValue(formatted.end);

    this.onChange(this.value);
    this.onTouched();
  }
}
