import { AfterViewInit, booleanAttribute, Component, EventEmitter, forwardRef, input, Input, Output } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { RadioButton } from '../radio-button/radio-button';

@Component({
  selector: 'ndp-check',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './check.html',
  styleUrl: './check.css',
  providers: [
    provideNativeDateAdapter(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Check),
      multi: true,
    },
  ],

})
export class Check implements AfterViewInit {
  label = input<string | null>(null);
  vertical = input(false, { transform: booleanAttribute });
  @Input({ transform: booleanAttribute }) ngDisabled = false;
  protected cId = Math.random().toString(36).substring(2, 9);
  protected formControl = new FormControl(false);

  @Output() valueChange = new EventEmitter<boolean | null>();
  
  @Output()
  get value() {
    return this.formControl.value;
  }

  onChange = (_: any) => { };
  onTouched = () => { };

  ngAfterViewInit(): void {
    // console.log(this.label() + ': ' + this.ngDisabled)
    this.setDisabledState(this.ngDisabled)

    // this.formControl.valueChanges.subscribe(value => {
    //   console.log(value);
    // });
  }

  writeValue(value: any): void {
    this.formControl.setValue(value, { emitEvent: true });
  }

  setDisabledState(isDisabled: boolean): void {
    this.ngDisabled = isDisabled;
  }
}
