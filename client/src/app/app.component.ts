import { Component, ViewChild } from "@angular/core";
import { BoardComponent } from "./board/board.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})

export class AppComponent {

  @ViewChild('board') board!: BoardComponent; 

  constructor() {}

  selectVariant(type: string) {
    this.board.selectVariant(type);
  }
}
