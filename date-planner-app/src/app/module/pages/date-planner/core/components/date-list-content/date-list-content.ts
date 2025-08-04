import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DateList } from '../../types/date-planner.type';
import { DateLabel } from "../date-label/date-label";
import { parseFromString } from '@AppModule/dateUtils';

@Component({
  selector: 'ndp-date-list-content',
  imports: [DateLabel],
  templateUrl: './date-list-content.html',
  styleUrl: './date-list-content.css'
})
export class DateListContent {

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

  protected toDate(date: string): Date  {
    return parseFromString(date)??new Date
  }

}
