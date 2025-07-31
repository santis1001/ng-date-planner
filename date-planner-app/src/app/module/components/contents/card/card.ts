import { Component, input } from '@angular/core';

@Component({
  selector: 'ndp-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card {

  title = input<string | null>(null);
  
}
