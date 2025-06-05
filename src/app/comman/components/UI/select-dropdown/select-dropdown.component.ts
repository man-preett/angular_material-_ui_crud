import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-select-dropdown',
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
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
  constructor() {
    this.filteredOptions = this.options.slice();
  }
  @Input() options: any[] = [];
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() searchSelect: boolean = false;
  @Output() click = new EventEmitter<void>();
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};
  searchQuery: string = '';
  filteredOptions: any[] = [];

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.value = value;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.filteredOptions = this.options;
    }
  }

  filterOptionsRaw(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    const query = inputValue.toLowerCase();
    this.filteredOptions = this.options.filter((option) =>
      option.display.toLowerCase().includes(query)
    );
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
  valueChange() {
    this.click.emit();
  }
  getDisplayText(val: any): string {
    const matched = this.options.find((o) => o.value === val);
    return matched ? matched.display : '';
  }
}
