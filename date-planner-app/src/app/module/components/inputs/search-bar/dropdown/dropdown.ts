import { Component, EventEmitter, Input, input, Output, signal } from '@angular/core';

@Component({
  selector: 'ndp-dropdown',
  imports: [],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css'
})
export class Dropdown {

  @Output() selectItem = new EventEmitter<any>();
  @Input() items: { key: any; value: string }[] = [];

  trackByFn(index: number) {
    return index;
  }

}
