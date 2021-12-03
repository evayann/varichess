import { Component, ViewChild } from "@angular/core";
import { BoardComponent } from "./board/board.component";

import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/big-smile';
import { Piece, RULES } from "model/variantType";
import { Chess } from "model/variantChess";
import { getRulesList, RulesList } from "model/chessRules";
import { MatSidenav } from "@angular/material/sidenav";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})

export class AppComponent {

  @ViewChild('board') board!: BoardComponent; 
  @ViewChild('sidenav') sidenav!: MatSidenav;

  variant: string = "";
  chess: Chess | undefined;
  rules:readonly string[] = RULES;
  user!: string;

  private play: boolean = false;
  
  constructor() {
    this.user = createAvatar(style, {
      seed: randomSeed(25)
    });
  }
  
  setPlay(state: boolean) {
    this.play = state;
  }

  isPlaying() {
    return this.play;
  }
  
  selectVariant(type: string) {
    this.play = false; // Reset previous game
    this.variant = type;
    this.sidenav.toggle();
  }

  setChess(chess: Chess) {
    this.chess = chess;
  }

  getPiecesList(): Piece[] {
    const pieces: Piece[] = [];
    
    if (!this.chess) return pieces;

    for (let i = 0; i < 64; i++) {
      let piece: Piece | undefined;
      if ((piece = this.chess.board.get(i)) && ! pieces.some(p => p.role === piece?.role))
        pieces.push(piece);
    }
    return pieces;
  }

  getRulesList(): RulesList {
    return getRulesList(this.variant);
  }
}

function randomSeed(length: number) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) 
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 return result;
}