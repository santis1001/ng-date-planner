import { Component, inject, Input, signal, WritableSignal } from '@angular/core';
import { DateList } from '../../types/date-planner.type';
import { DateInput } from "@AppModule/inputs/date-input/date-input";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ndp-date-config',
  imports: [DateInput, ReactiveFormsModule],
  templateUrl: './date-config.html',
  styleUrl: './date-config.css'
})
export class DateConfig {
  @Input() data: WritableSignal<DateList> = signal([]);

  protected readonly fb: FormBuilder = inject(FormBuilder);
  constructor() {
    this.dateForm = this.fb.group({
      newDate: [null]
    });
  }

  protected dateForm: FormGroup;
  protected dateNameIndex: string[] = [];

  protected addNewDate() {
    const newDate = this.dateForm.get('newDate')?.value;
    if (newDate) {
      const name = this.randomString;
      this.dateForm.addControl(name, new FormControl(newDate))
      this.dateNameIndex.push(name);
      console.log('saved')
    }
  }

  protected deleteDate(name: string) {
    const date = this.dateForm.get(name);
    if (date) {
      this.dateForm.removeControl(name);
      this.dateNameIndex = this.dateNameIndex.filter(y => y !== name);
    }
  }

  protected get randomString(): string {
    return Math.random().toString(36).slice(2, 10);
  }
}
