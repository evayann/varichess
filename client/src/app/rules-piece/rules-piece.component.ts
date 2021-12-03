import { Component, Input, ViewChild } from '@angular/core';
import { BoardComponent } from 'app/board/board.component';
import { getPieceAcronyme } from 'model/util';
import { Board } from 'model/variantBoard';
import { Chess } from 'model/variantChess';
import { Piece, Role } from 'model/variantType';

@Component({
  selector: 'app-rules-piece',
  templateUrl: './rules-piece.component.html',
  styleUrls: ['./rules-piece.component.scss']
})
export class RulesPieceComponent {

  @ViewChild('board') board!: BoardComponent;

  private demoChess!: Chess;
  
  @Input() pieces: Role[] = [];
  currentPiece: Role | undefined;
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
      const piece: Piece = {role: this.currentPiece, color: "white"};

      // 35 is center position on board 7 
      board.take(35); 
      this.board.updateUIFromModel();
      board.set(35, piece);
      this.board.updateUIFromModel();
      
      this.board.selectPiece(piece);
    }
  }

  setChess(chess: Chess) {
    this.demoChess = chess;
    this.updatePieceMovements();
  }

  getCurrentPieceAcronyme(): string {
    return this.currentPiece ? getPieceAcronyme({role: this.currentPiece, color: "white"}) : "pw";
  }
}
