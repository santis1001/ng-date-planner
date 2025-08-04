import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DateList } from '../../types/date-planner.type';
import { Check } from "@AppModule/buttons/check/check";

@Component({
  selector: 'ndp-date-advanced-options',
  imports: [Check],
  templateUrl: './date-advanced-options.html',
  styleUrl: './date-advanced-options.css'
})
export class DateAdvancedOptions {

  JSON: any = JSON;
  private _data = new BehaviorSubject<DateList>([]);

  @Input() set data(value: DateList) {
    this._data.next(value);
    // console.log('Data set:', value);
  }

  get data(): DateList {
    return this._data.getValue();
  }

  get dataObservable() {
    return this._data.asObservable();
  }

}
