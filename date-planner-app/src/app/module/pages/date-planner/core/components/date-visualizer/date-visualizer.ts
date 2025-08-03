import { AfterViewInit, Component, computed, DestroyRef, effect, inject, Input, QueryList, Renderer2, signal, SimpleChanges, TemplateRef, ViewChild, ViewChildren, WritableSignal } from '@angular/core';
import { DateList } from '../../types/date-planner.type';
import { MatCalendar } from "@angular/material/datepicker";
import { parseFromString } from '@AppModule/dateUtils';
import { BehaviorSubject, delay, filter } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ndp-date-visualizer',
  imports: [MatCalendar, AsyncPipe],
  templateUrl: './date-visualizer.html',
  styleUrl: './date-visualizer.css'
})
export class DateVisualizer implements AfterViewInit {

  constructor(private domSanitizer: DomSanitizer) {
  }

  // @Input() data: WritableSignal<DateList> = signal([]);

  JSON: any = JSON;
  selected: any;


  protected calendarCount: WritableSignal<number> = signal(1);
  readonly calendarList = computed(() => Array.from({ length: this.calendarCount() }));
  @ViewChildren(MatCalendar) calendars!: QueryList<MatCalendar<Date>>;


  private _data = new BehaviorSubject<DateList>([]);
  // private _dataChanged = new BehaviorSubject<boolean>(false);

  // set dataChanged(value: boolean) {
  //   this._dataChanged.next(value);
  // }
  // get dataChanged(): boolean {
  //   return this._dataChanged.getValue();
  // }
  // get dataChangedObservable() {
  //   return this._dataChanged.asObservable().pipe(delay(50));
  // }

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

  ngOnInit(): void {
    this.dataObservable
      .pipe()
      .subscribe(data => {
        // console.log('Data changed:', data);
        this.calendarStyles();
        if(this.calendars)
          this.calendars.forEach(calendar => calendar.updateTodaysDate());
        
      });
  }

  ngAfterViewInit(): void {

  }
  
  protected calendarStyles() {
    const styleTag = document.createElement('style');
    const styleContent = this.getSingleDates.map(item => {
      const className = `date-${item.name}`;
      return `
        .${className} .mat-calendar-body-cell-content {
          background-color: ${item.color} !important;
          color: white !important;
          border-radius: 50%;
        }`;
    }).join('\n');
    styleTag.innerHTML = styleContent;
    console.log('Adding styles for date visualizer:', styleContent);
    document.head.appendChild(styleTag);
  }

  protected incrementCalendarCount() {
    this.calendarCount.update(count => count + 1);
  }
  protected decrementCalendarCount() {
    if (this.calendarCount() > 1) {
      this.calendarCount.update(count => count - 1);
    }
  }
  protected get getSingleDates() {
    return this.data.filter(item => typeof item.value === 'string')
      .map(item => ({ ...item, date: parseFromString(item.value as string) }))
      .filter(item => item.date != null);
  }

  protected readonly getDateClass = (date: Date): string => {
    const match = this.getSingleDates.find(item => {
      // console.log('getDateClass', date, item.date);

      return item.date!.getDate() === date.getDate() && item.date!.getMonth() === date.getMonth() && item.date!.getFullYear() === date.getFullYear()
    }
    );
    if (match) console.log('getDateClass', date, match);
    return match ? `date-${match.name}` : '';
  }

}
