import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ndp-selector',
  imports: [],
  templateUrl: './selector.html',
  styleUrl: './selector.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Selector),
    multi: true
  }],
  standalone: true

})
export class Selector {

  @Input() label: string | null = null;
  @Input() placeholder: string = 'Selecciona una opción';
  @Input() options: { label: string, value: any }[] = [];
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<any>();

  value: any = null;

  onChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  updateValue(event: Event) {
    const newValue = (event.target as HTMLSelectElement).value;
    this.value = newValue;
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }
}
