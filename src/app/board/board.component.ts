import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from '../list/list.component';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';

interface Card {
  id: number;
  content: string;
  color: string;
  height: number;
}

interface List {
  id: number;
  title: string;
  cards: Card[];
  width: number;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, ListComponent, FormsModule, DragDropModule],
  template: `
    <div class="board">
      <h2>{{ title }}</h2>
      <div class="lists-container" cdkDropListGroup>
        <app-list *ngFor="let list of lists" 
                  [list]="list" 
                  (deleteList)="deleteList($event)"
                  (addCard)="addCard($event)"
                  (updateCard)="updateCard($event)"
                  (resizeList)="resizeList($event)"
                  (cardMoved)="onCardMoved($event)">
        </app-list>
        <div class="add-list">
          <input [(ngModel)]="newListTitle" placeholder="Enter list title">
          <button (click)="addList()">Add List</button>
        </div>
      </div>
    </div>
  `,
  styles: [/* ... styles remain unchanged ... */]
})
export class BoardComponent implements OnInit {
  title = 'My Trello Board';
  lists: List[] = [];
  newListTitle = '';
  isDraggingEnabled = true;

  ngOnInit() {
    this.loadLists();
  }

  loadLists() {
    // В реальном приложении здесь был бы запрос к API
    this.lists = [
      { id: 1, title: 'To Do', cards: [{ id: 1, content: 'Task 1', color: '#ffffff', height: 100 }, { id: 2, content: 'Task 2', color: '#ffffff', height: 100 }], width: 270 },
      { id: 2, title: 'In Progress', cards: [{ id: 3, content: 'Task 3', color: '#ffffff', height: 100 }], width: 270 },
      { id: 3, title: 'Done', cards: [{ id: 4, content: 'Task 4', color: '#ffffff', height: 100 }], width: 270 },
    ];
  }

  addList() {
    if (this.newListTitle.trim()) {
      const newId = Math.max(...this.lists.map(l => l.id), 0) + 1;
      this.lists.push({ id: newId, title: this.newListTitle, cards: [], width: 270 });
      this.newListTitle = '';
    }
  }

  deleteList(listId: number) {
    this.lists = this.lists.filter(l => l.id !== listId);
  }

  addCard(data: { listId: number, cardContent: string }) {
    const list = this.lists.find(l => l.id === data.listId);
    if (list) {
      const newId = Math.max(...list.cards.map((c: Card) => c.id), 0) + 1;
      list.cards.push({ id: newId, content: data.cardContent, color: '#ffffff', height: 100 });
    }
  }

  updateCard(data: { listId: number, cardId: number, content: string, color: string, height: number }) {
    const list = this.lists.find(l => l.id === data.listId);
    if (list) {
      const card = list.cards.find((c: Card) => c.id === data.cardId);
      if (card) {
        card.content = data.content;
        card.color = data.color;
        card.height = data.height;
      }
    }
  }

  resizeList(data: { listId: number, width: number }) {
    const list = this.lists.find(l => l.id === data.listId);
    if (list) {
      list.width = data.width;
    }
  }

  dropList(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
  }

  toggleDragging() {
    this.isDraggingEnabled = !this.isDraggingEnabled;
  }

  onCardMoved(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // Update the lists after the move
    this.lists = [...this.lists];
  }
}