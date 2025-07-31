import { AfterViewInit, booleanAttribute, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, input, InputSignal, OnInit, Output, signal, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { REGEX_CHARS_ALLOWED } from '@AppModule/regex.constant';

@Component({
  selector: 'ndp-text-input',
  imports: [],
  templateUrl: './text-input.html',
  styleUrl: './text-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInput),
      multi: true,
    },
  ],
  standalone: true,
})
export class TextInput implements ControlValueAccessor, AfterViewInit {

  label = input<string | null>(null);
  placeholder = input<string>('');
  vertical = input(true, { transform: booleanAttribute });
  isPassword = input(false, { transform: booleanAttribute });
  isCurrency = input(false, { transform: booleanAttribute });
  showError = input(false);
  type = input<"text" | "date" | "password" | "number">('text');
  amount: string = "$0.00";

  @Input({ transform: booleanAttribute }) ngDisabled = false;

  @ViewChild('textInputRef') inputRef!: ElementRef<HTMLInputElement>;

  @Input() set value(val: string) {
    console.log(val)
    this._value = val;
    this.onChange(val);
  }

  get value(): string {
    return this._value;
  }

  ngAfterViewInit(): void {

    // console.log(this.label() + ': ' + this.ngDisabled)

    if (this.isCurrency() && this.value.length == 0) {
      this.value = this.amount;
    }
  }

  @Output() valueChange = new EventEmitter<string>();

  protected _value: string = '';
  protected cId = this.generateRandomId();

  protected onChange = (_: any) => { };
  protected onTouched = () => { };

  updateValue(event: Event) {
    this.formatCurrency(event);
    if (!this.isCurrency()) {
      const newValue = (event.target as HTMLInputElement).value;
      this._value = newValue;
      this.onChange(newValue);
      this.valueChange.emit(newValue);
    }

  }

  writeValue(value: any): void {
    this._value = value || '';

    if (this.isCurrency()) {
      this.amount = this._value || '$0.00';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Optional: you can wire this to a `[disabled]` input
  }

  private generateRandomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  formatCurrency(event: any) {
    // console.log(event)
    if (this.isCurrency()) {
      if (!event.data) {
        this.amount = '$0.00';
        (event.target as HTMLInputElement).value = this.amount;
        return;
      }

      if (/\d/.test(event.data)) {
        const cleanAmount: number = (this.amount.replace(REGEX_CHARS_ALLOWED.currecy, '') as any) as number * 10;
        const newInput: number = event.data as number / 100;
        let newAmount: number = cleanAmount + newInput;

        const formattedamount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(newAmount as any);
        (event.target as HTMLInputElement).value = (formattedamount.replace(/[$]/g, '') as string);
        this.amount = (formattedamount as string);

        const inputElement: HTMLInputElement = (event.target as HTMLInputElement);
        // setTimeout(() => {null}, 60);
        const dotIndex = (event.target as HTMLInputElement).value.length;
        inputElement.setSelectionRange(dotIndex, dotIndex);
        this._value = this.amount;
        this.onChange(this.amount);
        this.valueChange.emit(this.amount);

      }
      // console.log(this.amount);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.isCurrency()) {

      const allowedKeys = [
        'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', // control keys
        '.', ',', '$' // allowed symbols
      ];
      const deleteKeys =
        ['Delete', 'Backspace']


      const isNumber = event.key >= '0' && event.key <= '9';
      const isAllowedSymbol = allowedKeys.includes(event.key);
      const isDelete = deleteKeys.includes(event.key);

      if (!isNumber && !isAllowedSymbol) {
        event.preventDefault(); // block disallowed characters
      }
      if (isDelete && this.isCurrency()) {
        // console.log('delete')
        this.amount = '$0.00'
        this.inputRef.nativeElement.value = this.amount
        this.inputRef.nativeElement.dispatchEvent(new InputEvent('input', {
          data: '0'
        }))
      }
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (this.isCurrency()) {
      const pastedInput: string = event.clipboardData?.getData('text') || '';
      const validPattern = /^[\d.,$]+$/;

      if (!validPattern.test(pastedInput)) {
        event.preventDefault(); // block paste if invalid
      }
    }
  }


}
