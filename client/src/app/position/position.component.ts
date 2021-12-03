import { Component, HostBinding } from '@angular/core';
import { BoardComponent } from 'app/board/board.component';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent {

  private board!: BoardComponent;

  interaction!: boolean;
  type!: string;
  x!: number;
  y!: number;
  @HostBinding("style.--nb-cell") 
  get pieceSize() { return this.board.nbCell; }

  //#region Position Style 
  static IS_HERE: string = "square";
  static IS_CHECK: string = "check";
  static IS_EMPTY: string = "circle";
  static IS_CASTLE: string = "castle";
  static IS_EATABLE: string = "corner";
  //#endregion Position Style

  constructor() { }

  init(type: string, x: number, y: number, interaction: boolean, board: BoardComponent) {
    this.x = x; 
    this.y = y;
    this.type = type;
    this.board = board;
    this.interaction = interaction;
  }

  goTo(event: Event) {
    // Stop propagation to don't trigger parent element when click on a piece on board
    event.stopPropagation();

    if (! this.interaction)
      return;

    this.board.tryMoveSelectedTo(this.x / 100, this.y / 100);
  }
}
