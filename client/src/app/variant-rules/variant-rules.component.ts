import { Component, Input } from '@angular/core';
import { Role } from 'model/variantType';
import { RulesList } from 'model/chessRules';
import { getPieceAcronyme } from 'model/util';

@Component({
  selector: 'app-variant-rules',
  templateUrl: './variant-rules.component.html',
  styleUrls: ['./variant-rules.component.scss']
})
export class VariantRulesComponent {

  @Input() variant!: string;
  @Input() rules!: RulesList;

  constructor() { }

  toPiece(piece: Role | "All") {
    return piece === "All" ? "allw": getPieceAcronyme({role: piece, color: "white"});
  }

}