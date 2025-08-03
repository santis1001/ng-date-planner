import { AfterViewInit, booleanAttribute, Component, computed, EventEmitter, forwardRef, input, Input, Output, Signal, signal, WritableSignal } from '@angular/core';
import { flush } from '@angular/core/testing';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DateInput } from '@AppModule/inputs/date-input/date-input';
import { single } from 'rxjs';

@Component({
  selector: 'ndp-radio-button',
  imports: [],
  templateUrl: './radio-button.html',
  styleUrl: './radio-button.css',
  providers: [
    provideNativeDateAdapter(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButton),
      multi: true,
    },
  ],
})
export class RadioButton implements AfterViewInit {

  label = input<string | null>(null);
  vertical = input(false, { transform: booleanAttribute });
  @Input({ transform: booleanAttribute }) ngDisabled = false;
  radioOptions = input<{ label: string, value: boolean }[]>([]);
  protected cId = Math.random().toString(36).substring(2, 9);
  protected formControl = new FormControl();
  @Output() valueChange = new EventEmitter<string | null>();

  onChange = (_: any) => { };
  onTouched = () => { };

  protected readonly optionsWithIndex = computed(() =>
    this.radioOptions().map((item, index) => ({
      ...item,
      index
    }))
  );

  get value(): string | null {
    return this.formControl.value;
  }

  ngAfterViewInit(): void {
    // console.log(this.label() + ': ' + this.ngDisabled)
    this.setDisabledState(this.ngDisabled)
    this.formControl.setValue(this.radioOptions().find(option => option.value)?.value, { emitEvent: false });
    this.formControl.valueChanges.subscribe(value => {
      console.log(value);
    });
  }

  writeValue(value: any): void {
    this.formControl.setValue(value, { emitEvent: true });
  }

  setDisabledState(isDisabled: boolean): void {
    this.ngDisabled = isDisabled;
  }
}
