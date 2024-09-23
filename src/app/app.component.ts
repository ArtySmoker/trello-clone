import { Component } from '@angular/core';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BoardComponent],
  template: `
    <app-board></app-board>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'trello-clone';
}