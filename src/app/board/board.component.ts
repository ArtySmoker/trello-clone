// src/app/board/board.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from '../list/list.component';
import { FormsModule } from '@angular/forms';

interface List {
  id: number;
  title: string;
  cards: Card[];
}

interface Card {
  id: number;
  content: string;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, ListComponent, FormsModule],
  template: `
    <div class="board">
      <h2>{{ title }}</h2>
      <div class="lists-container">
        <app-list *ngFor="let list of lists" 
                  [list]="list" 
                  (deleteList)="deleteList($event)"
                  (addCard)="addCard($event)"
                  (updateCard)="updateCard($event)">
        </app-list>
        <div class="add-list">
          <input [(ngModel)]="newListTitle" placeholder="Enter list title">
          <button (click)="addList()">Add List</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .board {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 20px;
    }
    .lists-container {
      display: flex;
      overflow-x: auto;
    }
    .add-list {
      margin-left: 10px;
    }
  `]
})
export class BoardComponent {
  title = 'My Trello Board';
  lists: List[] = [
    { id: 1, title: 'To Do', cards: [{ id: 1, content: 'Task 1' }, { id: 2, content: 'Task 2' }] },
    { id: 2, title: 'In Progress', cards: [{ id: 3, content: 'Task 3' }] },
    { id: 3, title: 'Done', cards: [{ id: 4, content: 'Task 4' }] },
  ];
  newListTitle = '';

  addList() {
    if (this.newListTitle.trim()) {
      const newId = Math.max(...this.lists.map(l => l.id), 0) + 1;
      this.lists.push({ id: newId, title: this.newListTitle, cards: [] });
      this.newListTitle = '';
    }
  }

  deleteList(listId: number) {
    this.lists = this.lists.filter(l => l.id !== listId);
  }

  addCard(data: { listId: number, cardContent: string }) {
    const list = this.lists.find(l => l.id === data.listId);
    if (list) {
      const newId = Math.max(...list.cards.map(c => c.id), 0) + 1;
      list.cards.push({ id: newId, content: data.cardContent });
    }
  }

  updateCard(data: { listId: number, cardId: number, content: string }) {
    const list = this.lists.find(l => l.id === data.listId);
    if (list) {
      const card = list.cards.find(c => c.id === data.cardId);
      if (card) {
        card.content = data.content;
      }
    }
  }
}