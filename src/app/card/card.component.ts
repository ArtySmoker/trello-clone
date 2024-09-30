import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card" 
         [style.backgroundColor]="card.color" 
         [style.height.px]="card.height" 
         #cardElement
         [class.resizing]="isResizing">
      <div *ngIf="!isEditing; else editMode">
        <p>{{ card.content }}</p>
        <button (click)="startEditing()">Edit</button>
        <button (click)="onDelete()">Delete</button>
      </div>
      <ng-template #editMode>
        <textarea [(ngModel)]="editedContent" (keyup.enter)="saveEdit()" rows="3"></textarea>
        <div class="color-picker">
          <label for="colorInput">Color:</label>
          <input id="colorInput" type="color" [(ngModel)]="editedColor">
        </div>
        <button (click)="saveEdit()">Save</button>
        <button (click)="cancelEdit()">Cancel</button>
      </ng-template>
      <div class="resize-handle" #resizeHandle (mousedown)="startResize($event)"></div>
    </div>
  `,
  styles: [`
    .card {
      background-color: white;
      border-radius: 3px;
      box-shadow: 0 1px 0 rgba(9,30,66,.25);
      padding: 10px;
      margin-bottom: 10px;
      position: relative;
      min-height: 50px;
      touch-action: none;
    }
    .card.resizing {
      cursor: ns-resize;
      user-select: none;
    }
    .resize-handle {
      width: 100%;
      height: 10px;
      position: absolute;
      bottom: 0;
      left: 0;
      cursor: ns-resize;
      background-color: rgba(0,0,0,0.1);
    }
  `]
})
export class CardComponent implements AfterViewInit {
  @Input() card: any;
  @Output() deleteCard = new EventEmitter<number>();
  @Output() editCard = new EventEmitter<{id: number, content: string, color: string, height: number}>();
  @Output() resizeStateChange = new EventEmitter<boolean>();

  @ViewChild('cardElement') cardElement!: ElementRef;
  @ViewChild('resizeHandle') resizeHandle!: ElementRef;

  isEditing = false;
  editedContent = '';
  editedColor = '';
  isResizing = false;
  startY = 0;
  startHeight = 0;

  ngAfterViewInit() {
    this.cardElement.nativeElement.style.height = `${this.card.height}px`;
  }

  startResize(event: MouseEvent) {
    this.isResizing = true;
    this.startY = event.clientY;
    this.startHeight = this.cardElement.nativeElement.offsetHeight;
    this.resizeStateChange.emit(true);
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;
    const newHeight = this.startHeight + event.clientY - this.startY;
    this.card.height = Math.max(50, newHeight); // Минимальная высота 50px
    this.cardElement.nativeElement.style.height = `${this.card.height}px`;
    this.editCard.emit({id: this.card.id, content: this.card.content, color: this.card.color, height: this.card.height});
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.isResizing) {
      this.isResizing = false;
      this.resizeStateChange.emit(false);
    }
  }

  startEditing() {
    this.isEditing = true;
    this.editedContent = this.card.content;
    this.editedColor = this.card.color;
  }

  saveEdit() {
    if (this.editedContent.trim() !== '') {
      this.editCard.emit({
        id: this.card.id, 
        content: this.editedContent,
        color: this.editedColor,
        height: this.card.height
      });
      this.card.content = this.editedContent;
      this.card.color = this.editedColor;
      this.isEditing = false;
    }
  }

  cancelEdit() {
    this.isEditing = false;
  }

  onDelete() {
    this.deleteCard.emit(this.card.id);
  }
}