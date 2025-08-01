import { Component, inject, Input, signal, WritableSignal } from '@angular/core';
import { DateList } from '../../types/date-planner.type';
import { DateInput } from "@AppModule/inputs/date-input/date-input";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateOptions } from "../date-options/date-options";

@Component({
  selector: 'ndp-date-config',
  imports: [DateInput, ReactiveFormsModule, DateOptions],
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
      this.data().push({ name, value: newDate, color: '#ffffff' });
      console.log('saved')
    }
  }

  protected deleteDate(name: string) {
    const date = this.dateForm.get(name);
    if (date) {
      this.dateForm.removeControl(name);
      this.dateNameIndex = this.dateNameIndex.filter(y => y !== name);
      this.data.set(this.data().filter(item => item.name !== name));
      console.log('deleted', name);
    }
  }

  protected updateItem(name: string, event: {value: string, color: string}) {
    console.log(name, event.value, event.color);
    const index = this.dateNameIndex.indexOf(name);
    const newName = event.value;
    const newColor = event.color;
    if (index !== -1 && newName) {
      this.dateNameIndex[index] = newName;
      this.dateForm.addControl(newName, new FormControl(this.dateForm.get(name)?.value));      
      this.dateForm.removeControl(name);      
      this.data().find(item => item.name === name)!.name = newName;
      this.data().find(item => item.name === name)!.color = newColor;
      console.log('updated', name, 'to', newName, 'with color', newColor);
    }
  }

  protected get randomString(): string {
    return Math.random().toString(36).slice(2, 10);
  }
}
