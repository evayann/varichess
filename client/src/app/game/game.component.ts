import { Component, Input } from '@angular/core';
import { getRulesList, RulesList } from "model/chessRules";
import { Chess } from 'model/variantChess';
import { Role } from 'model/variantType';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {

  @Input() variant: string = "chess";
  chess: Chess | undefined;

  constructor() { }

  getPiecesList(): Role[] {
    return getRulesList(this.variant).pieces;
  }

  getRulesList(): RulesList {
    return getRulesList(this.variant);
  }

  setChess(chess: Chess) {
    this.chess = chess;
  }
}
