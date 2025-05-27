import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
  @Input() options: any='';
  @Input() label: string = '';
  @Output() selectionChange = new EventEmitter<any[]>();

  value: any[] = [];

  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(value: any[]): void {
    this.value = value || [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

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

  trackByFn(index: number, item: any): any {
    return item.value;
  }
}
