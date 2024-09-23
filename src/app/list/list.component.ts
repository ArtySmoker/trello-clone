// src/app/list/list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, CardComponent, FormsModule],
  template: `
    <div class="list">
      <h3>{{ list.title }} <button (click)="onDeleteList()">X</button></h3>
      <app-card *ngFor="let card of list.cards" 
                [card]="card"
                (deleteCard)="deleteCard($event)"
                (editCard)="editCard($event)">
      </app-card>
      <div class="add-card">
        <input [(ngModel)]="newCardContent" placeholder="Enter card content">
        <button (click)="onAddCard()">Add Card</button>
      </div>
    </div>
  `,
  styles: [`
    .list {
      background-color: #ebecf0;
      border-radius: 3px;
      width: 270px;
      padding: 10px;
      margin-right: 10px;
    }
    .add-card {
      margin-top: 10px;
    }
  `]
})
export class ListComponent {
  @Input() list: any;
  @Output() deleteList = new EventEmitter<number>();
  @Output() addCard = new EventEmitter<{listId: number, cardContent: string}>();
  @Output() updateCard = new EventEmitter<{listId: number, cardId: number, content: string}>();
  
  newCardContent = '';

  onDeleteList() {
    this.deleteList.emit(this.list.id);
  }

  onAddCard() {
    if (this.newCardContent.trim()) {
      this.addCard.emit({listId: this.list.id, cardContent: this.newCardContent});
      this.newCardContent = '';
    }
  }

  deleteCard(cardId: number) {
    this.list.cards = this.list.cards.filter((c: any) => c.id !== cardId);
  }

  editCard(editedCard: {id: number, content: string}) {
    this.updateCard.emit({
      listId: this.list.id,
      cardId: editedCard.id,
      content: editedCard.content
    });
  }
}