import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ComponentFactoryResolver, ViewChild, OnInit, ComponentFactory, ViewContainerRef, ElementRef } from '@angular/core';
import { BoardDirective } from 'app/board.directive';
import { PieceComponent } from 'app/piece/piece.component';
import { PositionComponent } from 'app/position/position.component';

import { Chess } from "model/chess";

export interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-game',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @ViewChild('board') board!: ElementRef;
  @ViewChild(BoardDirective, { static: true }) boardContent!: any;
  
  private pieceFactory!: ComponentFactory<PieceComponent>;
  private positionFactory!: ComponentFactory<PositionComponent>;
  private boardContainer!: ViewContainerRef;

  private selectedPiece: PieceComponent | undefined;
  private selectedPlaces: Array<Point> = [];

  c = new Chess();


  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.pieceFactory = this.componentFactoryResolver.resolveComponentFactory(PieceComponent);
    this.positionFactory = this.componentFactoryResolver.resolveComponentFactory(PositionComponent);
    this.boardContainer = this.boardContent.viewContainerRef;

    for (let piece of this.c.getInitialePosition()) {
      this.addPiece(piece.type, piece.x, piece.y);
    }
  }

  private createPlace(type: string, x: number, y: number) {
    const ref = this.boardContainer.createComponent(this.positionFactory);
    ref.instance.init(type, x, y, this);
    this.selectedPlaces.push({x: x / 100, y: y / 100});
  }

  selectPiece(piece: PieceComponent) {
    // If piece already selected, not reselect it
    if (this.selectedPiece === piece) return;
    
    this.selectedPiece = piece;
    const [px, py] = piece.getPosition();
    this.createPlace("square", px, py);

    for (const play of this.c.getPlayFor(piece.type, piece.x, piece.y))
      this.createPlace("circle", play.x * 100, play.y * 100);

  }

  unselectPiece() {
    console.log("test");
    
    this.selectedPiece?.unselect();
    this.selectedPiece = undefined;
    for (let i = this.selectedPlaces.length; i--;) 
      this.boardContainer.remove();
    this.selectedPlaces = [];

  }

  addPiece(type: string, px: number, py: number) {
    const componentRef = this.boardContainer.createComponent(this.pieceFactory);
    componentRef.instance.type = type;
    componentRef.instance.color = type === type.toUpperCase() ? "w" : "b";
    componentRef.instance.move(px, py);
    componentRef.instance.board = this;
  }

  tryMoveSelectedTo(x: number, y: number) {
    // TODO : Ask if row column is ok
    if (! this.selectedPiece) return;

    // Check if movement is legal, if it's apply it
    if (! this.c.moveToIfLegal(this.selectedPiece.type, this.selectedPiece.x, this.selectedPiece.y, x, y))
      return;

    // Apply movement after verification and clean places
    this.selectedPiece.move(x, y);
    this.unselectPiece();
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
    
    // Check if movement is legal, if it's apply it
    if (! this.c.moveToIfLegal(piece.type, piece.x, piece.y, x, y))
      return;

    piece.move(x, y);
    this.unselectPiece();
  }
}
