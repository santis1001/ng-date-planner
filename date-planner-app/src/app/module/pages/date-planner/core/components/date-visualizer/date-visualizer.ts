import { Component, Input, signal, WritableSignal } from '@angular/core';
import { DateList } from '../../types/date-planner.type';

@Component({
  selector: 'ndp-date-visualizer',
  imports: [],
  templateUrl: './date-visualizer.html',
  styleUrl: './date-visualizer.css'
})
export class DateVisualizer {
  @Input() data: WritableSignal<DateList> = signal([]);

  JSON: any = JSON;

}
