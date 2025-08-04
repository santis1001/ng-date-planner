import { Component, input } from '@angular/core';

@Component({
  selector: 'ndp-date-label',
  imports: [],
  templateUrl: './date-label.html',
  styleUrl: './date-label.css'
})
export class DateLabel {
  label = input<string | null>(null);
  color = input<string>('');
  date = input<Date>(new Date());
}
