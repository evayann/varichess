import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { getPieceAcronyme } from 'model/util';
import { Piece } from 'model/variantType';
import { Chess } from 'model/variantChess';
import { Board } from 'model/variantBoard';
import { BoardComponent } from 'app/board/board.component';
import { RulesList } from "model/chessRules";

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnChanges {

  @ViewChild('board') board!: BoardComponent;

  private demoChess!: Chess;

  @Input() rules: RulesList | undefined;
  @Input() pieces: Piece[] = [];
  currentPiece: Piece | undefined;
  private currIdx: number;

  constructor() {
    this.currIdx = 0;
  }

  ngOnChanges() {
    this.nextPiece();
  }

  previousPiece() {
    this.currentPiece = this.pieces[(this.currIdx >= 0 ? this.currIdx-- : (this.currIdx = this.pieces.length - 1)) % this.pieces.length];
    this.updatePieceMovements();
  }

  nextPiece() {
    this.currentPiece = this.pieces[(this.currIdx++) % this.pieces.length];
    this.updatePieceMovements();
  }

  updatePieceMovements() {  
    if (this.demoChess && this.board && this.currentPiece) {
      const board: Board = this.demoChess.board as Board;
      board.take(28 + ((this.currIdx + 1) % 2) * 7);
      board.set(28 + (this.currIdx % 2) * 7, this.currentPiece);
      this.board.updateUIFromModel();
      this.board.selectPiece(this.currentPiece);
    }
  }

  setChess(chess: Chess) {
    this.demoChess = chess;
    this.updatePieceMovements();
  }

  getCurrentPieceAcronyme(): string {
    return this.currentPiece ? getPieceAcronyme(this.currentPiece) : "pw";
  }
}
