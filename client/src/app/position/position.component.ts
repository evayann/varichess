import { Component } from '@angular/core';
import { BoardComponent } from 'app/board/board.component';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent {

  private board!: BoardComponent;

  type!: string;
  x!: number;
  y!: number;

  constructor() { }

  init(type: string, x: number, y: number, board: BoardComponent) {
    this.x = x; 
    this.y = y;
    this.type = type;
    this.board = board;
  }

  goTo() {
    this.board.tryMoveSelectedTo(this.x / 100, this.y / 100);
  }
}
