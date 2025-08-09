import { booleanAttribute, Component, input } from '@angular/core';
import { getContrastingTextColor } from '@AppModule/colorUtils';

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
  start = input<Date>(new Date());
  end = input<Date>(new Date());

  isRangeDate = input(false, { transform: booleanAttribute });
  isDateGroup = input(false, { transform: booleanAttribute });

  getContrastingTextColor = getContrastingTextColor;
}
