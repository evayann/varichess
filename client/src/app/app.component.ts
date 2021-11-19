import { Component, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { BoardComponent } from "./board/board.component";

import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/big-smile';

import { RULES } from "model/variantType";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})

export class AppComponent implements AfterViewInit {

  @ViewChild('board') board!: BoardComponent; 
  @ViewChild('user') userContainer!: ElementRef; 

  rules: string[] = RULES;
  
  constructor() {}
  ngAfterViewInit(): void {
    this.userContainer.nativeElement.innerHTML = createAvatar(style, {
      seed: randomSeed(25)
    });
  }

  selectVariant(type: string) {
    this.board.selectVariant(type);
  }
}

function randomSeed(length: number) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}