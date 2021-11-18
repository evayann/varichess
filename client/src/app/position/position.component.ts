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

  //#region Position Style 
  static IS_HERE: string = "square";
  static IS_CHECK: string = "check";
  static IS_EMPTY: string = "circle";
  static IS_EATABLE: string = "corner";
  //#endregion Position Style

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
