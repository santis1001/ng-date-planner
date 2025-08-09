import { AfterViewInit, Component, computed, DestroyRef, effect, inject, Input, QueryList, Renderer2, signal, SimpleChanges, TemplateRef, ViewChild, ViewChildren, WritableSignal } from '@angular/core';
import { DateList, DateRangeItem } from '../../types/date-planner.type';
import { MatCalendar } from "@angular/material/datepicker";
import { parseFromString } from '@AppModule/dateUtils';
import { BehaviorSubject, delay, filter } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { DateListContent } from "../date-list-content/date-list-content";
import { getContrastingTextColor } from '@AppModule/colorUtils';
import { StringBuilder } from '@AppModule/string-builder.utils';
import { isDateGroupItem, isDateRangeItem } from '../../functions/date.functions';


@Component({
  selector: 'ndp-date-visualizer',
  imports: [MatCalendar, DateListContent],
  templateUrl: './date-visualizer.html',
  styleUrl: './date-visualizer.css'
})
export class DateVisualizer implements AfterViewInit {

  constructor(private domSanitizer: DomSanitizer) {
  }

  JSON: any = JSON;
  selected: any;


  protected calendarCount: WritableSignal<number> = signal(1);
  readonly calendarList = computed(() => Array.from({ length: this.calendarCount() }));
  @ViewChildren(MatCalendar) calendars!: QueryList<MatCalendar<Date>>;

  private _data = new BehaviorSubject<DateList>([]);

  @Input() set data(value: DateList) {
    this._data.next(value);
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
        if (this.calendars)
          this.calendars.forEach(calendar => calendar.updateTodaysDate());

      });
  }

  ngAfterViewInit(): void {

  }

  protected calendarStyles() {

    document.querySelectorAll('style[data-calendar-style]').forEach(el => el.remove());

    const styleTag = document.createElement('style');
    styleTag.setAttribute('data-calendar-style', 'true');

    const singleDateStyles = this.getSingleDates.map(item => {
      const className = `date-${item.name}`;
      return `
      .${className} .mat-calendar-body-cell-content {
        background-color: ${item.color} !important;
        color: ${getContrastingTextColor(item.color)} !important;
        border-radius: 50%;
      }`;
    });

    const groupDateStyles = this.getGroupDates.map(item => {
      const className = `date-${item.name}`;
      return `
      .${className} .mat-calendar-body-cell-content {
        background-color: ${item.color} !important;
        color: ${getContrastingTextColor(item.color)} !important;
        border-radius: 50%;
      }`;
    });

    const rangeDateStyles = this.getRangeDates.map(item => {
      const classNameStart = `date-${item.name}-start`;
      const classNameEnd = `date-${item.name}-end`;
      const classRange = `date-range-${item.name}`;

      /*
      .${classRange} .mat-calendar-body-cell-content {
              color: ${getContrastingTextColor(item.color)} !important;        
            }
      */
      return `
      
      .${classRange}::before{
        background-color: ${item.color}33 !important;
      }

      .${classNameStart} .mat-calendar-body-cell-content {
        background-color: ${item.color} !important;
        color: ${getContrastingTextColor(item.color)} !important;
        border-radius: 50%;

      }
      .${classNameStart}::before{
        background-color: ${item.color}33 !important;
      }
      
      .${classNameEnd} .mat-calendar-body-cell-content {
        background-color: ${item.color} !important;
        color: ${getContrastingTextColor(item.color)} !important;
        border-radius: 50%;
      }

      .${classNameEnd}::before {
          background-color: ${item.color}33 !important;
      }
    `;
    });


    const styleContent = [...singleDateStyles, ...groupDateStyles, ...rangeDateStyles].join('\n');
    styleTag.innerHTML = styleContent;

    console.log('Applying calendar styles:\n', styleContent);
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

  protected get getRangeDates() {
    return this.data.filter(item => typeof item.value === 'object' && isDateRangeItem(item) && item.value.start && item.value.end)
      .map(item => {
        const start = parseFromString((item as DateRangeItem).value.start);
        const end = parseFromString((item as DateRangeItem).value.end);
        return start && end ? { ...item, start, end } : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }

  protected get getGroupDates() {
    return this.data.filter(item => typeof item.value === 'object' && isDateGroupItem(item) && item.value.length > 0)
      .map(item => {
        return { ...item, dates: (item.value as []).map(d => parseFromString(d)) };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }

  protected readonly getDateClass = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dateClass: string[] = [];


    const matchRange = this.getRangeDates.find(item => date >= item.start && date <= item.end);
    if (matchRange) {
      const isStart = date.getTime() === matchRange.start.getTime()
      const isEnd = date.getTime() === matchRange.end.getTime();
      if (isStart || isEnd) {
        dateClass.push(`mat-calendar-body-range-${isStart ? 'start' : 'end'} mat-calendar-body-in-range date-${matchRange.name}-${isStart ? 'start' : 'end'}`);
      } else {
        dateClass.push(`mat-calendar-body-in-range date-range-${matchRange.name}`)
      }
    }

    const matchSingle = this.getSingleDates.find(item => {
      const d = item.date!;
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });

    if (matchSingle) dateClass.push(`date-${matchSingle.name}`);

    const matchGroup = this.getGroupDates.find(item => {
      return item.dates.some(date => {
        return date && date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
      });
    });
    if (matchGroup) dateClass.push(`date-${matchGroup.name}`)

    if (dateClass.length > 0) console.log('Date classes for', date, ':', dateClass.join(' '));
    
    return dateClass.join(" ").toString();
  };


}
