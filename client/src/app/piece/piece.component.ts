import { Component } from '@angular/core';
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { BoardComponent } from 'app/board/board.component';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.scss']
})
export class PieceComponent {
  color!: string;
  type!: string;
  board!: BoardComponent;

  x!: number;
  y!: number;
  dx!: number;
  dy!: number;

  isSelected: boolean = false;
  isDragging: boolean = false;

  isMovable: boolean = false;

  constructor() { }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.dx = x * 100;
    this.dy = y * 100;
  }

  dragPiece(event: CdkDragStart) {
    if (! this.isMovable) return;

    // If previous move isn't drag, we need to set new initialTransform 
    event.source._dragRef["_initialTransform"] = "translate(" + this.dx + "%, " + this.dy + "%)";
    this.board.selectPiece(this);
    this.isDragging = true;
  }

  dropPiece(event: CdkDragEnd) {   
    // Try to move piece on board and reset dragger
    this.board.tryMoveTo(this, event)
    this.board.unselectPiece();
    event.source._dragRef.reset();
    this.isDragging = false;
  }

  select(event: Event) {
    if (! this.isMovable) return;
    
    // Stop propagation to don't trigger parent element when click on a piece on board
    event.stopImmediatePropagation();
    
    // Unselect other piece if exist
    this.board.unselectPiece();

    // And select this one 
    this.isSelected = true;
    this.board.selectPiece(this);
  }

  unselect() {
    this.isSelected = false;
  }

  getPosition(): [number, number] {
    return [this.dx, this.dy];
  }
}
