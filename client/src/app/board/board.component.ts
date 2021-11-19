import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ComponentFactoryResolver, ViewChild, AfterViewInit, ComponentFactory, ViewContainerRef, ElementRef, ChangeDetectorRef } from '@angular/core';
import { PieceComponent } from 'app/piece/piece.component';
import { PositionComponent } from 'app/position/position.component';

import { Chess, Move, Piece } from 'chessops/';
import { Atomic, RacingKings, Horde } from 'chessops/variant';
import { Explode } from 'model/variants';

import { Zoo } from 'model/variantChess';

import { parseSquare, toSquare } from 'model/util';
import { Board } from 'model/variantBoard';

export interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-game',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements AfterViewInit {

  @ViewChild('board') board!: ElementRef;

  @ViewChild('pieces', {read: ViewContainerRef}) pieces!: ViewContainerRef;
  @ViewChild('infoContent', {read: ViewContainerRef}) infoContent!: ViewContainerRef;
  @ViewChild('selectedContent', {read: ViewContainerRef}) selectedContent!: ViewContainerRef;
  
  variant: string;

  private pieceFactory!: ComponentFactory<PieceComponent>;
  private positionFactory!: ComponentFactory<PositionComponent>;

  private selectedPiece: PieceComponent | undefined;
  private selectedPositions: Array<Point> = [];
  private infoPositions: Array<Point> = [];
  private piecesComponent: Array<PieceComponent> = [];

  chess: Chess;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cd: ChangeDetectorRef) {
      this.chess = Chess.default();
      this.variant = "chess";
  }

  ngAfterViewInit() {
    this.pieceFactory = this.componentFactoryResolver.resolveComponentFactory(PieceComponent);
    this.positionFactory = this.componentFactoryResolver.resolveComponentFactory(PositionComponent);

    this.updateUIFromModel();

    // Indicate to angular we have a changement on the view because we create new piece
    this.cd.detectChanges();
  }

  selectVariant(type: string) {
    let chess: Chess = Chess.default();

    switch (type) {
      case "atomic":
        chess = Atomic.default();
        break;
      case "race": 
        chess = RacingKings.default();
        break;
      case "horde":
        chess = Horde.default();
        break;
      case "explode":
        chess = Explode.default();
        break;
      case "zoo":
        chess = Zoo.default();
    }
    this.chess = chess;
    this.variant = type;

    this.cleanChess();
    this.updateUIFromModel();
  }

  //#region Board
  clickOnBoard() {    
    if (this.selectedPiece)
      this.unselectPiece();
  }  

  private updateUIFromModel() {
    const currPieces: Array<PieceComponent> = this.piecesComponent;
    const currBoard: Array<[number, Piece]> = [... this.chess.board];
    const newPieces: Array<[number, Piece]> = [];
    const deadPieces: Array<PieceComponent> = [];
    
    for (const [pos, p] of currBoard) {
      const [x, y] = parseSquare(pos);
      if (! currPieces.some((piece) => piece.x === x && piece.y === y))
        newPieces.push([pos, p]);
    }

    for (const piece of currPieces) {
      if (! currBoard.some(([pos, p]) => {
        const [x, y] = parseSquare(pos);
        return piece.x === x && piece.y === y && piece.role === p.role && piece.color == p.color;
      })) {
        deadPieces.push(piece);
      }
    }

    for (const [pos, piece] of newPieces)
      this.createPiece(piece, pos);

    for (const piece of deadPieces) 
      piece.destroy().then(() => this.removePiece(piece));
      // this.removePiece(piece);

    this.updatePlayer();
  }

  private cleanChess() {
    this.piecesComponent.forEach(() => this.pieces.remove());
    this.piecesComponent = [];

    if (this.selectedPositions) 
      this.unselectPiece();
  }
  //#endregion Board

  //#region Select
  selectPiece(piece: PieceComponent) {
    // If piece already selected, not reselect it but unselect it
    if (this.selectedPiece === piece) {
      this.unselectPiece();
      return;
    }
    
    // If other piece select, unselect before select this one
    if (this.selectedPiece !== undefined)
      this.unselectPiece();

    this.selectedPiece = piece;
    this.createSelected(PositionComponent.IS_HERE, ...piece.getPosition());

    for (const p of this.chess.dests(toSquare(piece.x, piece.y)))
      this.createSelected(
        this.chess.board.get(p) === undefined ? PositionComponent.IS_EMPTY : PositionComponent.IS_EATABLE,
       ...this.parseSquareOnBoard(p)
       );
  }

  unselectPiece() {  
    this.selectedPiece = undefined;
    this.selectedContent.clear();
    this.selectedPositions = [];
  }
  //#endregion Select

  //#region Piece
  private parseSquareOnBoard(nb: number): [number, number] {
    const [x, y] = parseSquare(nb);
    return [x * 100, y * 100];
  }

  private createPosition(arr: Array<Point>, view: ViewContainerRef, type: string, x: number, y: number) {  
    const ref = view.createComponent(this.positionFactory);
    ref.instance.init(type, x, y, this);
    arr.push({x: x / 100, y: y / 100});
  }

  private createSelected(type: string, x: number, y: number) {
    this.createPosition(this.selectedPositions, this.selectedContent, type, x, y);
  }

  private createInfo(type: string, x: number, y: number) {
    this.createPosition(this.infoPositions, this.infoContent, type, x, y);
  }

  createPiece(piece: Piece, pos: number) {
    const instance: PieceComponent = this.pieces.createComponent(this.pieceFactory).instance;
    instance.role = piece.role;
    instance.color = piece.color;
    instance.move(...parseSquare(pos));
    instance.board = this;
    this.piecesComponent.push(instance);
  }

  removePiece(piece: PieceComponent) { 
    this.piecesComponent.forEach((p, index) => {    
      if (p.x === piece.x && p.y === piece.y && p.color === piece.color) {
        this.pieces.remove(index);
        this.piecesComponent.splice(index, 1);
        return;
      }
    });
  }
  //#endregion Piece

  //#region Player
  private updatePlayer() {
    this.piecesComponent.forEach(p => p.isMovable = this.chess.turn === p.color);    
  }
  //#endregion Player

  //#region Movements
  private applyMove(piece: PieceComponent, x: number, y: number) {
    const move: Move = { from: toSquare(piece.x, piece.y), to: toSquare(x, y) };
    
    piece.move(x, y);

    if (piece.role === "pawn" && (y === 0 || y === 7)) {
      // TODO Draw div hover board with z-index who is put on boarInfo
      move.promotion = "queen";
      piece.updateRole("queen");
    }

    this.chess.play(move);

    // Update UI
    this.clearPreviousInfo();
    this.updateBoard();
    this.unselectPiece();
    this.updatePlayer();
  }

  tryMoveSelectedTo(x: number, y: number) {
    if (! this.selectedPiece) return;
    this.applyMove(this.selectedPiece, x, y);
  }

  tryMoveTo(piece: PieceComponent, toPosition: CdkDragEnd) { 
    // Get Data about board
    const el = this.board.nativeElement;
    const {top, left} = el.getBoundingClientRect();
    const size: number = el.clientHeight;
    const gridSize: number = size / 8;
        
    // Verify position
    const toX: number = toPosition.dropPoint.x - left;
    if (toX < 0 || toX > size) return; 
    const toY: number = toPosition.dropPoint.y - top;
    if (toY < 0 || toY > size) return;     
    
    const x = Math.floor(toX / gridSize);
    const y = Math.floor(toY / gridSize);

    // Check if position is a given position
    if ((x === piece.x && y === piece.y) || ! this.selectedPositions.some(el => el.x === x && el.y === y))
      return;
    
    this.applyMove(piece, x, y);
  }
  //#endregion Movements

  private clearPreviousInfo() {
    this.infoContent.clear();
    this.infoPositions = [];
  }

  /**
   * Update Board
   * Movement already apply. So current player on model is the other player
   */
  private updateBoard() {
    this.updateUIFromModel();

    const otherPlayer: "white" | "black" = this.chess.turn;
    if (this.chess.isCheck()) {
      // Get the winning piece. For chessops it's king for zoo it's royalknight
      const masterPiece: number = ((this.chess instanceof Zoo) ? 
        (this.chess.board as Board).royalKnightOf(otherPlayer) : this.chess.board.kingOf(otherPlayer)) as number;
      
      this.createInfo(PositionComponent.IS_CHECK, ...this.parseSquareOnBoard(masterPiece));
    }
  }
}
