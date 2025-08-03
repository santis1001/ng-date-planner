import { AfterViewInit, Component, inject, Input, signal, WritableSignal } from '@angular/core';
import { DateList } from '../../types/date-planner.type';
import { DateInput } from "@AppModule/inputs/date-input/date-input";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateOptions } from "../date-options/date-options";
import { DateRangeInput } from "@AppModule/inputs/date-range-input/date-range-input";
import { RadioButton } from "@AppModule/buttons/radio-button/radio-button";

@Component({
  selector: 'ndp-date-config',
  imports: [DateInput, ReactiveFormsModule, DateOptions, DateRangeInput, RadioButton],
  templateUrl: './date-config.html',
  styleUrl: './date-config.css'
})
export class DateConfig implements AfterViewInit {
  @Input() data: WritableSignal<DateList> = signal([]);

  protected readonly fb: FormBuilder = inject(FormBuilder);
  protected dateForm: FormGroup;
  protected dateListForm: FormGroup;
  protected readonly radioOptions: { label: string, value: boolean }[] =
    [
      { label: 'Single', value: true },
      { label: 'Range', value: false }
    ];

  constructor() {
    this.dateForm = this.fb.group({
      newDate: [null]
    });

    this.dateListForm = this.fb.group({
    });
  }

  protected initializeFormControls() {
    this.dateListForm = this.fb.group({
    });
  }

  protected additionalDateControls() {
    this.data().forEach(item => {
      this.dateListForm.addControl(item.name, new FormControl(item.value));
    });
  }

  protected reloaddateListFormFromData() {
    this.initializeFormControls();
    this.additionalDateControls();
    this.ngAfterViewInit();
  }

  ngAfterViewInit(): void {
    this.dateListForm.valueChanges.subscribe(value => {
      console.log(value);
      Object.keys(value).forEach(key => {
        if (value[key] === null || value[key] === undefined) {
          console.warn(`Value for ${key} is null or undefined`);
          return;
        }
        console.log(`Value for ${key}:`, value[key]);
        this.updateDate(key);
      });
    });

  }

  protected addNewDate() {
    const newDate = this.dateForm.get('newDate')?.value;
    if (newDate) {
      const name = this.randomString;
      const color = this.randomColor;
      const updated = [...this.data(), { name, value: newDate, color }];

      // this.data().push({ name, value: newDate, color });
      this.data.set(updated);

      this.reloaddateListFormFromData();
      this.dateForm.get('newDate')?.setValue(null);
      console.log('saved')
    }
  }

  protected deleteDate(name: string) {
    const date = this.dateListForm.get(name);
    if (date) {
      this.data.set(this.data().filter(item => item.name !== name));
      this.reloaddateListFormFromData();
      console.log('deleted', name);
    }
  }

  protected updateItem(name: string, event: { value: string, color: string }) {
    console.log(name, event.value, event.color);
    const index = this.data().indexOf(this.data().find(item => item.name === name)!);
    const newName = event.value;
    const newColor = event.color;
    if (index !== -1 && newName) {
      // const item = this.data().find(item => item.name === name);
      // console.log(item)
      // if (!item) {
      //   console.error('Item not found for name:', name);
      //   return
      // }

      const updated = this.data().map(item =>
        item.name === name
          ? { ...item, name: newName, color: newColor }
          : item
      );

      // item.name = newName;
      // item.color = newColor;
      this.data.set(updated);

      this.reloaddateListFormFromData();
      console.log('updated', name, 'to', newName, 'with color', newColor);
    }
  }

  protected updateDate(name: string) {
    console.log(name, this.dateListForm.get(name)?.value);
    const index = this.data().indexOf(this.data().find(item => item.name === name)!);

    const newDate = this.dateListForm.get(name)?.value;
    if (index !== -1 && newDate) {
      const updated = this.data().map(item =>
        item.name === name
          ? { ...item, value: newDate }
          : item
      );

      // this.data().find(item => item.name === name)!.value = newDate;
      this.data.set(updated);
      console.log('updated date of', name, 'to', newDate);
    }
  }

  protected get randomString(): string {
    return Math.random().toString(36).slice(2, 10);
  }
  protected get randomColor(): string {
    return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
  }

  printValue(value: any) {
    console.log(value);
  }

}
