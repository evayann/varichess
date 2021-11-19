import { Component } from '@angular/core';
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { BoardComponent } from 'app/board/board.component';
import { position } from './piece.animation';
@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.scss'],
  animations: [position]
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
  lifeState: string = "live";

  dyingTime: number = 1000;

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
    this.lifeState = "dead";
    await delay(this.dyingTime);
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

function delay(ms: number) {
  return new Promise(resolve => setTimeout(() => resolve(1), ms));
}