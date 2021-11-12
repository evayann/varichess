import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ComponentFactoryResolver, ViewChild, AfterViewInit, ComponentFactory, ViewContainerRef, ElementRef, ChangeDetectorRef } from '@angular/core';
import { PieceComponent } from 'app/piece/piece.component';
import { PositionComponent } from 'app/position/position.component';

import { Chess } from "model/chess";
import { ChessRules } from 'model/rules/chessRules';
import { RaceRules } from 'model/rules/raceRules';
import { Rules } from 'model/rules/rules';

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

  @ViewChild('blackPiece', {read: ViewContainerRef}) bPiece!: ViewContainerRef;
  @ViewChild('whitePiece', {read: ViewContainerRef}) wPiece!: ViewContainerRef;
  @ViewChild('boardContent', {read: ViewContainerRef}) boardContent!: ViewContainerRef;
  
  private pieceFactory!: ComponentFactory<PieceComponent>;
  private positionFactory!: ComponentFactory<PositionComponent>;

  private selectedPiece: PieceComponent | undefined;
  private selectedPlaces: Array<Point> = [];
  private piecesComponent: [Array<PieceComponent>, Array<PieceComponent>] = [[], []];

  private static WHITE = 0;
  private static BLACK = 1;

  c: Chess;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cd: ChangeDetectorRef) {
      this.c = new Chess(new ChessRules());
    }

  ngAfterViewInit() {
    this.pieceFactory = this.componentFactoryResolver.resolveComponentFactory(PieceComponent);
    this.positionFactory = this.componentFactoryResolver.resolveComponentFactory(PositionComponent);

    this.initChess();

    // Indicate to angular we have a changement on the view because we create new piece
    this.cd.detectChanges();
  }

  selectVariant(type: string) {
    let rules: Rules = new ChessRules();
    switch (type) {
      case "explode":
        rules = new ChessRules();
        break;
      case "race": 
        rules = new RaceRules();
        break;
    }
    this.c = new Chess(rules);
    this.initChess();
  }

  //#region Board
  clickOnBoard() {    
    if (this.selectedPiece)
      this.unselectPiece();
  }  

  private initChess() {
    // Clean board before add new 
    this.cleanChess();

    this.c.getInitialePosition().forEach(piece => this.createPiece(piece.type, piece.x, piece.y));
    this.selectPlayer(this.c.getCurrentPlayer());
  }

  private cleanChess() {
    this.piecesComponent.forEach((pieces, i) => {
      const container: ViewContainerRef = i ? this.bPiece : this.wPiece;
      pieces.forEach(() => container.remove());
    });

    this.piecesComponent = [[], []];

    this.selectedPlaces.forEach(() => this.boardContent.remove());
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
    const [px, py] = piece.getPosition();
    this.createPlace("square", px, py);

    // Add movement zone
    for (const play of this.c.getPlayFor(piece.type, piece.x, piece.y))
      this.createPlace("circle", play.x * 100, play.y * 100);

    // Add eating zone
    for (const play of this.c.getEatFor(piece.type, piece.x, piece.y))
      this.createPlace("corner", play.x * 100, play.y * 100);
  }

  unselectPiece() {  
    this.selectedPiece = undefined;
    for (let i = this.selectedPlaces.length; i--;) 
      this.boardContent.remove();
    this.selectedPlaces = [];

  }
  //#endregion Select

  //#region Piece
  private createPlace(type: string, x: number, y: number) {  
    const ref = this.boardContent.createComponent(this.positionFactory);
    ref.instance.init(type, x, y, this);
    this.selectedPlaces.push({x: x / 100, y: y / 100});
  }

  createPiece(type: string, px: number, py: number) {
    const color: number = type.toUpperCase() === type ? BoardComponent.WHITE : BoardComponent.BLACK;    
    const instance: PieceComponent = this.constructPiece(color);
    instance.type = type;
    instance.color = color ? "b" : "w";
    instance.move(px, py);
    instance.board = this;
  }

  constructPiece(color: number): PieceComponent {
    const instance: PieceComponent = (color ? this.bPiece : this.wPiece).createComponent(this.pieceFactory).instance;
    this.piecesComponent[color].push(instance);
    return instance;
  }

  removePiece(x: number, y: number) { 
    const color: number = this.c.getCurrentPlayer() ? BoardComponent.BLACK : BoardComponent.WHITE; // Remove piece from opposite player
    let piece: number = -1;
    
    this.piecesComponent[color].forEach((p, index) => {    
      if (p.x === x && p.y === y) {
        piece = index;
        return;
      }
    });

    if (piece >= 0) {
      (color ? this.bPiece : this.wPiece).remove(piece);
      this.piecesComponent[color].splice(piece, 1);
    }
  }
  //#endregion Piece

  //#region Player
  private selectPlayer(player: number) {
    this.piecesComponent.forEach((p, pId) => {
      const selected = player === pId;
      p.forEach(piece => piece.isMovable = selected);
    });    
  }
  //#endregion Player

  //#region Movements
  private applyMove(piece: PieceComponent, x: number, y: number) {
    // Check if movement is legal, if it's apply it
    const [legal, eat] = this.c.moveToIfLegal(piece.type, piece.x, piece.y, x, y);
    if (! legal)
      return;

    if (eat)
      this.removePiece(x, y);

    piece.move(x, y);
    this.unselectPiece();
    this.selectPlayer(this.c.getCurrentPlayer());
  }

  tryMoveSelectedTo(x: number, y: number) {
    // TODO : Ask if row column is ok
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
    if (! this.selectedPlaces.some(el => el.x === x && el.y === y))
      return;
    
    this.applyMove(piece, x, y);
  }
  //#endregion Movements
}
