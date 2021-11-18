import { Component } from '@angular/core';
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { BoardComponent } from 'app/board/board.component';
import { Role } from 'chessops';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.scss']
})
export class PieceComponent {
  color!: string;
  role!: string;
  board!: BoardComponent;

  x!: number;
  y!: number;
  dx!: number;
  dy!: number;

  isSelected: boolean = false;
  isDragging: boolean = false;

  isDeaing: boolean = false;
  rot: number = 0;

  isMovable: boolean = false;

  constructor() { }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.dx = x * 100;
    this.dy = y * 100;
  }

  updateRole(role: string) {
    this.role = role;
  }

  dragPiece(event: CdkDragStart) {
    // If previous move isn't drag, we need to set new initialTransform 
    event.source._dragRef["_initialTransform"] = "translate(" + this.dx + "%, " + this.dy + "%)";
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
    // Stop propagation to don't trigger parent element when click on a piece on board
    event.stopPropagation();

    // And select this one 
    this.isSelected = true;
    this.board.selectPiece(this);
  }

  async destroy() {
    this.isDeaing = true;
    await delay(1000, (time) => this.rot = time);
    return true;    
  }

  unselect() {
    this.isSelected = false;
  }

  getPosition(): [number, number] {
    return [this.dx, this.dy];
  }

  getPieceAcronyme(): string {
    let type: string = this.role[0];
    if (this.role === "knight") type = "n";
    else if (this.role === "royalknight") type = "rk";
    
    return type + this.color[0];
  }
}

function delay(ms: number, exec: (time: number) => void) {
  return new Promise(resolve => setTimeout(() => exec(1), ms));
}