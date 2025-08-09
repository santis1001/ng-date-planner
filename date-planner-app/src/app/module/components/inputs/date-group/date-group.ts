import { AfterViewInit, booleanAttribute, Component, ViewContainerRef, EventEmitter, forwardRef, Input, input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DateRangeInput } from '../date-range-input/date-range-input';
import {
  Overlay,
  OverlayRef,
  OverlayPositionBuilder
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Card } from "@AppModule/contents/card/card";
import { DateInput } from '../date-input/date-input';
import { formatDateToString } from '@AppModule/dateUtils';
import { distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'ndp-date-group',
  imports: [Card, DateInput, ReactiveFormsModule],
  templateUrl: './date-group.html',
  styleUrl: './date-group.css',
  providers: [
    provideNativeDateAdapter(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateGroup),
      multi: true,
    },
  ],

})
export class DateGroup implements AfterViewInit {

  label = input<string | null>(null);
  showError = input(false);
  vertical = input(true, { transform: booleanAttribute });
  @Input({ transform: booleanAttribute }) ngDisabled = false;
  @Output() valueChange = new EventEmitter<string[]>();
  value: string[] = [];
  private isWriting = false;

  protected cId = Math.random().toString(36).substring(2, 9);
  protected get subId() { return Math.random().toString(36).substring(2, 4); }

  @ViewChild('menuTemplate') menuTemplateRef!: TemplateRef<any>;
  private overlayRef: OverlayRef | null = null;
  protected showOptions = false;

  fg: FormGroup = new FormGroup(
    [new FormControl<String | null>(null)]
  );

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private vcr: ViewContainerRef

  ) { }

  get isMenuOpen(): boolean {
    return this.showOptions;
  }

  onChange = (_: any) => { };
  onTouched = () => { };

  ngAfterViewInit(): void {
    this.buildForm();
    this.setDisabledState(this.ngDisabled)

    // this.valueChange.subscribe(value => {
    //   // this.inputRef.nativeElement.value = value;
    //   console.log('Value changed:', value);
    // })

    this.fg.valueChanges
      .pipe(
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        filter(value => !this.isWriting)
      )
      .subscribe(value => {
        
        if (JSON.stringify(this.value) === JSON.stringify(Object.values(value))) return; // skip if we are writing from outside

        this.value = Object.values(value)
        this.onChange(this.value);
        this.valueChange.emit(this.value);

      });
  }

  private buildForm(): void {
    this.fg = new FormGroup({});

    Array.from({ length: this.value.length }, (v, i) => ({ name: `${this.cId}-${this.subId}`, form: new FormControl<string | null>(this.value[i] || null) }))
      .forEach(controlObj => {
        this.fg.addControl(controlObj.name, controlObj.form);
      });

  }

  get controlsArray() {
    return Object.entries(this.fg.controls).map(([name, control], index) => ({
      name,
      index,
      control
    }));
  }

  setDisabledState(isDisabled: boolean): void {
    // this.ngDisabled = isDisabled;
    if (isDisabled) {
      this.fg.disable({ emitEvent: false });
    } else {
      this.fg.enable({ emitEvent: true });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: string[]): void {
    this.isWriting = true;

    this.value = value || [];
    this.buildForm()

    this.isWriting = false;
  }
  private addControl(val: string | null = null): void {
    const name = `${this.cId}-${this.subId}`;
    this.fg.addControl(name, new FormControl<string | null>(val));
  }

  addNewControl() {
    const newDate = formatDateToString(new Date());
    if (newDate) {
      this.addControl(newDate);
      // this.value.push(newDate);
      // this.onChange(this.value);
      // this.valueChange.emit(this.value);
      this.valueChange.emit(Object.values(this.fg.value));
    }
  }

  deleteControl(controlName: string, index: number) {
    if (this.fg.contains(controlName)) {
      this.fg.removeControl(controlName);
      // this.value.splice(index, 1);
      // this.onChange(this.value);
      // this.valueChange.emit(this.value);
      this.valueChange.emit(Object.values(this.fg.value));

    }
  }

  openMenu(origin: HTMLElement) {
    this.showOptions = true;
    if (this.overlayRef) {
      this.closeMenu();
      return;
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(origin)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    this.overlayRef.backdropClick().subscribe(() => this.closeMenu());

    const portal = new TemplatePortal(this.menuTemplateRef, this.vcr);
    this.overlayRef.attach(portal);
  }

  closeMenu() {
    this.overlayRef?.detach();
    this.overlayRef = null;
    this.showOptions = false;
  }

}
