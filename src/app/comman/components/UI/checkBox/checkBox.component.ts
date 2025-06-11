import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Option } from '../../../../interfaces/project';
@Component({
  selector: 'app-checkBox',
  imports: [MatCheckboxModule, MatFormFieldModule],
  templateUrl: './checkBox.component.html',
  styleUrl: './checkBox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckBoxComponent,
      multi: true,
    },
  ],
})
export class CheckBoxComponent implements ControlValueAccessor {
  @Input() options: Option[] = [];
  @Input() label: string = '';
  @Output() selectionChange = new EventEmitter<Option[]>();

  value: Option[] = [];

  private onChange: (value: Option[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: Option[]): void {
    this.value = value || [];
  }

  registerOnChange(fn: (value: Option[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // isChecked(optionValue: Option): boolean {
  //   return this.value.some((v) => v.value === optionValue.value);
  // }

  isChecked(optionValue: any): boolean {
    return this.value?.includes(optionValue);
  }

  onCheckboxChange(optionValue: any, checked: boolean): void {
    if (checked) {
      this.value = [...this.value, optionValue];
    } else {
      this.value = this.value.filter((v) => v !== optionValue);
    }
    this.selectionChange.emit(this.value);
    this.onChange(this.value);
    this.onTouched();
  }

  trackByFn(index: number, item: Option): string {
    return item.value;
  }
}
