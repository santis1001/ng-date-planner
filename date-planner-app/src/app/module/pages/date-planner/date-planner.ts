import { Component, signal, Signal, WritableSignal } from '@angular/core';
import { Section } from "@AppModule/contents/section/section";
import { DateConfig } from "./core/components/date-config/date-config";
import { DateVisualizer } from "./core/components/date-visualizer/date-visualizer";
import { DateList } from './core/types/date-planner.type';

@Component({
  selector: 'app-date-planner',
  imports: [Section, DateConfig, DateVisualizer],
  templateUrl: './date-planner.html',
  styleUrl: './date-planner.css'
})
export class DatePlanner {

  protected dateConfig : WritableSignal<DateList> = signal([]);
  

}
