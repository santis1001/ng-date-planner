import { formatDate } from '@angular/common';
import { AfterViewInit, booleanAttribute, Component, ElementRef, EventEmitter, forwardRef, Input, input, Output, signal, ViewChild } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { formatDateToString, parseFromString } from '@AppModule/dateUtils';

@Component({
  selector: 'ndp-date-input',
  imports: [MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, FormsModule, ReactiveFormsModule],
  templateUrl: './date-input.html',
  styleUrl: './date-input.css',
  providers: [
    provideNativeDateAdapter(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInput),
      multi: true,
    },
  ],

})
export class DateInput implements AfterViewInit {
  label = input<string | null>(null);
  placeholder = input<string>('dd/mm/yyyy');
  showError = input(false);
  vertical = input(true, { transform: booleanAttribute });

  @Input({ transform: booleanAttribute }) ngDisabled = false;

  value: string | null = null;
  @ViewChild('dateInputRef') inputRef!: ElementRef<HTMLInputElement>;

  protected formControl = new FormControl(formatDateToString(new Date()));

  @Output() valueChange = new EventEmitter<string>();
  protected cId = Math.random().toString(36).substring(2, 9);

  onChange = (_: any) => { };
  onTouched = () => { };

  ngAfterViewInit(): void {
    // console.log(this.label() + ': ' + this.ngDisabled)
    this.setDisabledState(this.ngDisabled)
    this.valueChange.subscribe(value => {
      this.inputRef.nativeElement.value = value;
    })
  }
  writeValue(value: any): void {
    // console.log(value)
    if (typeof value === 'string') {
      // const [year, month, day] = value.split('-').map(Number);
      value = parseFromString(value); // local date at midnight
    }

    this.formControl.setValue(value, { emitEvent: false });
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // this.ngDisabled = isDisabled;
    if (isDisabled) {
      this.formControl.disable({ emitEvent: false });
    } else {
      this.formControl.enable({ emitEvent: true });
    }
  }

  updateValue(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    this.value = newValue;
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  onDateSelected(date: any) {
    const formattedDate = formatDateToString(date);
    if (formattedDate) {
      // console.log(formattedDate)
      this.writeValue(formattedDate);
      this.value = formattedDate;
      this.onChange(formattedDate);
      this.valueChange.emit(formattedDate);
    }
  }

}
