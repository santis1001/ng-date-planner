import { AfterViewInit, booleanAttribute, Component, ElementRef, EventEmitter, forwardRef, input, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { DateInput } from '../date-input/date-input';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { formatDateToString, parseFromString } from '@AppModule/dateUtils';

@Component({
  selector: 'ndp-date-range-input',
  imports: [MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, FormsModule, ReactiveFormsModule],
  templateUrl: './date-range-input.html',
  styleUrl: './date-range-input.css',
  providers: [
    provideNativeDateAdapter(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangeInput),
      multi: true,
    },
  ],

})
export class DateRangeInput implements AfterViewInit {

  label = input<string | null>(null);
  showError = input(false);
  vertical = input(true, { transform: booleanAttribute });
  @Input({ transform: booleanAttribute }) ngDisabled = false;
  @Output() valueChange = new EventEmitter<{ start?: string | null, end?: string | null }>();
  @ViewChild('matStartDate') matStartDateRef!: ElementRef<HTMLInputElement>;
  @ViewChild('matEndDate') matEndDateRef!: ElementRef<HTMLInputElement>;

  protected placeholder = input<string>('dd/mm/yyyy');
  protected cId = Math.random().toString(36).substring(2, 9);

  value: { start: string | null, end: string | null } = { start: null, end: null };

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  onChange = (_: any) => { };
  onTouched = () => { };

  ngAfterViewInit(): void {
    // console.log(this.label() + ': ' + this.ngDisabled)
    this.setDisabledState(this.ngDisabled)
    this.valueChange.subscribe(value => {
      // this.inputRef.nativeElement.value = value;
    })
  }


  setDisabledState(isDisabled: boolean): void {
    // this.ngDisabled = isDisabled;
    if (isDisabled) {
      this.range.disable({ emitEvent: false });
    } else {
      this.range.enable({ emitEvent: true });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: { start?: string | null, end?: string | null }): void {
    console.log(value)
    if (value === null || value === undefined) {
      this.value = { start: null, end: null };
      this.range.reset();
      this.onChange(this.value);
      this.valueChange.emit(this.value);
      return
    }

    if (typeof value === 'string') {
      // const [year, month, day] = value.split('-').map(Number);
      // value = parseFromString(value); // local date at midnight
    }
    if (value.start) {
      this.range.get('start')?.setValue(parseFromString(value.start), { emitEvent: false });
      this.value.start = value.start;
    }
    if (value.end) {
      this.range.get('end')?.setValue(parseFromString(value.end), { emitEvent: false });
      this.value.end = value.end;
    }

  }
  onDateSelected(event: MatDatepickerInputEvent<Date, any>) {
    // console.log(event);
    let dateValue;
    const formattedDate = formatDateToString(event.value);

    if (formattedDate === null) {
      console.warn('Formatted date is null');
      return;
    }

    switch (event.targetElement) {
      case this.matStartDateRef.nativeElement:
        dateValue = { start: formattedDate };
        break
      case this.matEndDateRef.nativeElement:
        dateValue = { end: formattedDate };
        break
    }

    if (formattedDate && dateValue) {

      this.writeValue(dateValue);
      
      if (this.value.start && this.value.end) {
        this.onChange(this.value);
        this.valueChange.emit(this.value);
      }

    }
  }

  closePicker() {
    if (this.value.start && this.value.end) {
      return true;
    }
    return false;
  }

}
