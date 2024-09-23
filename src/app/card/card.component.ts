// src/app/card/card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div *ngIf="!isEditing; else editMode">
        <p>{{ card.content }}</p>
        <button (click)="startEditing()">Edit</button>
        <button (click)="onDelete()">Delete</button>
      </div>
      <ng-template #editMode>
        <input [(ngModel)]="editedContent" (keyup.enter)="saveEdit()">
        <button (click)="saveEdit()">Save</button>
        <button (click)="cancelEdit()">Cancel</button>
      </ng-template>
    </div>
  `,
  styles: [`
    .card {
      background-color: white;
      border-radius: 3px;
      box-shadow: 0 1px 0 rgba(9,30,66,.25);
      padding: 10px;
      margin-bottom: 10px;
    }
    input {
      width: 100%;
      margin-bottom: 5px;
    }
  `]
})
export class CardComponent {
  @Input() card: any;
  @Output() deleteCard = new EventEmitter<number>();
  @Output() editCard = new EventEmitter<{id: number, content: string}>();

  isEditing = false;
  editedContent = '';

  onDelete() {
    this.deleteCard.emit(this.card.id);
  }

  startEditing() {
    this.isEditing = true;
    this.editedContent = this.card.content;
  }

  saveEdit() {
    if (this.editedContent.trim() !== '') {
      this.editCard.emit({id: this.card.id, content: this.editedContent});
      this.isEditing = false;
    }
  }

  cancelEdit() {
    this.isEditing = false;
  }
}